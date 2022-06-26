
require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
const cookies = require("cookie-parser");
const multer = require('multer')
const sharp = require('sharp')

const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Comment = require('../models/comment.js')
const Post = require('../models/post.js')
const Like = require('../models/like.js')
const Friend = require('../models/friend.js')

const router = new express.Router()
router.use(cookies());

router.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please update an image .jpg .png .jpeg'))
        }
        cb(undefined, true)
    }
})

router.get('/register', (req,res) => {
    res.render('register')
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/users/register', async (req, res) => {
    // console.log(req.body)
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const phone = req.body.phone
    const month = req.body.month
    const day = req.body.day
    const year = req.body.year
    const gender = req.body.gender
    const dob = year +'-'+month+'-' +day
    // const avatarurl= ""

    const user = new User({username, password, email,phone,dob,gender})
    // const user = new User({username, password, email})

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 })
        res.redirect('/newsfeed')
        // res.redirect('/login')
        // res.send(user)
        // console.log(user)
        
    } catch (e) {
        res.status(400).send(e)
    }

})


router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body)
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 })
        res.redirect('/newsfeed')
        // res.redirect('/chat')
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/users/uploadAvatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 400 }).png().toBuffer()
    req.user.avatar = buffer
    req.user.avatarurl= '/users/' +req.user._id +'/avatar'
    await req.user.save()
    res.redirect('back')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {

            throw new Error()
        } else {
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        }

    } catch (e) {
        res.status(404).send()
        console.log(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    console.log('Cookies: ', req.cookies)
    res.send(req.user)
})
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.redirect('/login')

    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/:id',auth,  async (req, res) => {
    try {
        // console.log(req.params.id )
        const _id = req.params.id 
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }else {
            const match = {friends : true }
            await user.populate({
                path: 'friends',
                match: match
                
            }).execPopulate();
            var friendArr = await Promise.all(user.friends.map(friend => User.findById(friend.receiver)))
            var postArr = await Post.find({user: user})
            if(postArr.length!= 0){
                const post3 = postArr.sort((a,b) => b.createdAt - a.createdAt)
                for(var i = 0; i < postArr.length; i++){
                    await postArr[i].populate({
                        path:'comments',
                        options:{
                            sort: {
                                createdAt: -1
                            }
                        }
                    }).execPopulate()
                    await postArr[i].populate({
                        path:'user'
                    }).execPopulate()
                    if(postArr[i].comments.length!=0){
                        for(var j = 0; j < postArr[i].comments.length; j++){
                            await postArr[i].comments[j].populate({
                                path:'userid'
                            }).execPopulate()
                            // console.log("ok")
                        }
                    }
                }
            }
            //like
            var likeArr = []
            for(var k = 0; k < postArr.length; k++) {
                var flag = false;
                // console.log('post: ',postArr[k]._id)
                var like = await Like.findOne({userid:req.user._id, post: postArr[k]._id})
                if (like){
                    flag = true
                }
                likeArr.push(flag)
            }
            //friend status
            var status = 0
            var friend = await Friend.findOne({requester: req.user._id, receiver: user._id})
            if(friend) {
                status = friend.status
            }
            //friend request
            var friendRequest = await Friend.find({requester: req.user._id, status:2})
            for(var i = 0; i < friendRequest.length; i++){
                await friendRequest[i].populate({
                    path:'receiver'
                }).execPopulate()
                // console.log(req.user.friends[i])
            }
            //notification
            await req.user.populate({
                path: 'notifications',
                options: {
                    sort: {
                        updatedAt: -1
                    }
                }
                
            }).execPopulate();
            for(var i = 0; i <req.user.notifications.length; i++) {
                await req.user.notifications[i].populate({
                    path: 'users'
                    
                }).execPopulate();
            }

            res.render('personalpage', {thisuser: user, friendArr, postArr, user: req.user, likeArr, status,friendRequest, notiArr: req.user.notifications})
        } 
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.post('/edit', auth, async (req, res) => {
    // console.log(req.body)
    const updates = Object.keys(req.body)
    // console.log(updates)

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.redirect('back')
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})
router.post('/editbio', auth, async (req, res) => {
    console.log(req.body)
    // const updates = Object.keys(req.body)
    // console.log(updates)

    try {
        req.user.bio = req.body.bio
        await req.user.save()
        res.redirect('back')
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

module.exports = router