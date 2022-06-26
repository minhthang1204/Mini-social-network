const express = require ('express')
const bodyParser = require("body-parser")  

const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Friend = require('../models/friend.js')

const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));

//{{url}}/send-request?id=....

router.post('/send-request',auth,  async (req, res) => {
    console.log(req.query.id)
    var match= {
        receiver: req.query.id
    }
    try{
        await req.user.populate({
            path: 'friends',
            match: match
            
        }).execPopulate();
        // console.log(req.user.friends)
        
        
                let actionA = await Friend.create({
                    requester: req.user._id,
                    receiver: req.query.id,
                    status: 1,
                    friends: false
                });
        
                let actionB = await Friend.create({
                    requester: req.query.id,
                    receiver: req.user._id,
                    status: 2,
                    friends: false
                });
            
                let userA = await User.findByIdAndUpdate(req.user._id, {
                    $push: {friends: actionA._id}
                });
            
                let userB = await User.findByIdAndUpdate(req.query.id, {
                    $push: {friends: actionB._id}
                });
            
                return res.redirect('back');
 
    }catch(err)
    {
        console.log(err);
        return
    }
})

//{{url}}/accept-friend?id=....&status=2
router.post('/accept-friend',auth, async (req, res) => {
    console.log(req.query.id)
    try{
        if(req.query.status == 1 || req.query.status == 3)
        {
            let actionA = await Friend.findOneAndRemove({
                requester: req.user._id,
                receiver: req.query.id,
            });

            let actionB = await Friend.findOneAndRemove({
                requester: req.query.id,
                receiver: req.user._id,
            });

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {friends: actionA._id}
            });

            await User.findOneAndUpdate({_id: req.query.id},{
                $pull: {friends: actionB._id}
            });

            return res.redirect('back')
            // return res.json(200, {
            //     message: 'Request canceled or Unfriend'
            // });
        }
        else if(req.query.status == 2)
        {
            await Friend.findOneAndUpdate({
                requester: req.user._id,
                receiver: req.query.id
            }, {
                $set: {status: 3, friends: true}
            });

            await Friend.findOneAndUpdate({
                requester: req.query.id,
                receiver: req.user._id
            }, {
                $set: {status: 3, friends: true}
            });

            return res.redirect('back')
        }
    }catch(err)
    {
        console.log(err);
        return;
    }

    router.get('/friends', auth, async (req, res) => {
        const match = {friends : true }
        try {
            await req.user.populate({
                path: 'friends',
                match: match
                
            }).execPopulate();
            // res.send(req.user.friends)
    
            var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
            res.send(friendArr)
             
            
        } catch (e) {
            res.status(500).send()
        }
    })
    
    //{{url}}/search?id=....
    router.get('/search', auth, async (req, res) => {
        // console.log(req.query.username)
        if (req.query.username) {
            var username = req.query.username 
            // console.log(username)
            try {
                var userArr = await User.find({username: { '$regex' : username, '$options' : 'i' }})
                // res.send(userList)
                // res.render('search',{userArr, user: req.user} )
                res.render('chat',{userArr, user: req.user} )
                 
          
            } catch (e) {
                res.status(500).send()
                console.log(e)
            }
        }
        
    })
    router.post('/livesearch', auth, async (req, res) => {
        var user = await User.find({})
    
        res.status(201).send(user)
    })
    module.exports = router
})