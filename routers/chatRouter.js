const express = require('express')

const auth = require('../middleware/auth.js')

const chatController = require('../controllers/chat')

const router = express.Router()

// router.get('/', auth, chatController.getChats)

// router.post('/', auth, chatController.postChats)

// router.get('/', auth, chatController.getChatUser)

//router.post('/:chatId', auth, chatController.postSendMessage)

module.exports = router