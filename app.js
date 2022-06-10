require('./models/mongoose')
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const cookies = require("cookie-parser");

const userRouter = require('./routers/userRouter.js')
const friendRouter = require('./routers/friendRouter.js')
const postRouter = require('./routers/postRouter.js')
const commentRouter = require('./routers/commentRouter.js')
const likeRouter = require('./routers/likeRouter.js')
const notificationRouter = require('./routers/notificationRouter.js')

const app = express()
const port = process.env.PORT || 3000

const viewsPath = path.join(__dirname, './views/ejs')
const publicDirectoryPath = path.join(__dirname, './views')

app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(friendRouter)
app.use(likeRouter)
app.use(notificationRouter)
app.use(commentRouter)
app.use(express.static(publicDirectoryPath))
app.use(cookies());

app.set('view engine', 'ejs')
app.set('views', viewsPath)

 
 
// mongoose = require('mongoose');
// mongoose.connect
var dh = 'dinh huong'
// app.get('', (req,res) => {
//     res.render('login')
// })
app.get('/user/111', (req,res) => {
    var friendArr = [
        {
            username: '1',
            avatarurl: '',
            _id:'123'
        },
        {
            username: '2',
            avatarurl: '',
            _id:'456'
        },
        {
            username: '3',
            avatarurl: '',
            _id: '789'
        },
        {
            username: '4',
            avatarurl: '',
            _id:'111'
        }
    ]
    var postArr = [
        {
            _id: "123123",
            user: {
                _id: "123123",
                username: "Hb",
                avatarurl: ""
            },
            comments: [
                {
                    content: "11111",
                    userid: {
                        _id: "123123",
                        username: "Hb",
                        avatarurl: ""
                    },
                    post: "123123"
                }
            ],
            content:"helloooooo",
            imgurl: ""
        },
        {
            _id: "123123",
            user: {
                _id: "123123",
                username: "Hb",
                avatarurl: ""
            },
            comments: [
                {
                    content: "11111",
                    userid: {
                        _id: "123123",
                        username: "Hb",
                        avatarurl: ""
                    },
                    post: "123123"
                }
            ],
            content:"helloooooo",
            imgurl: ""
        }
    ]
    var user = {
        username: 'hung219',
        avatarurl: '../image/avt.jpg',
        _id: '123',

    }
    var thisuser = {
        username: 'aaa',
        avatarurl: '../image/avt.jpg',
        _id: '123',
        
    }
    var likeArr= [true,false,false,true]
    res.render('personalpage',{user, postArr, friendArr,likeArr, thisuser});
})
// app.post('/aaaa', function(req,res){
//     var data = 'hello';
//     res.send(data);
// })


app.get('', (req, res) => {
    res.render('login')
})

// app.use('/chat', chatRouter)


// app.listen(port, () => {
//     console.log('Server is on port: ' + port)
// })

const server = app.listen(port)

const socketRouter = require('./routers/socketRouter')
const io = require('./socket').init(server)
io.on('connection', socket => {
    socketRouter(io, socket)
})

//C:\Users\ASUS\Downloads\mongodb-windows-x86_64-4.4.6\mongodb-win32-x86_64-windows-4.4.6\bin\mongod --dbpath=C:\Users\ASUS\Downloads\mongodb-windows-x86_64-4.4.6\mongodb_data
