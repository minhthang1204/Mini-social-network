const [USER_ONLINE, RECEIVE_MESSAGE, SEND_MESSAGE, JOIN_CHAT] = ['USER_ONLINE', 'RECEIVE_MESSAGE', 'SEND_MESSAGE', 'JOIN_CHAT']

const sendId = document.getElementById('userid').value
console.log('my id: ' + sendId)
const socket = io()

socket.on('connect', () => {
    // console.log(socket.id)
})

socket.emit(USER_ONLINE, sendId)

socket.on('disconnect', () => {
    console.log('disconnect')
})

socket.on(USER_ONLINE, message => {
    // console.log(message)
})

socket.on(RECEIVE_MESSAGE, message => {
    console.log(message)
    userInboxOpen(message.username, message.avtURL, message.sendId);
    try {    
        var inboxContent = document.getElementById('inbox-content-' + message.username);
        var newDiv = document.createElement('div');
        newDiv.innerHTML =
            `<user-content avt-url="` + message.avtURL +`" posted-time="` + message.time + `">
                <content-card>`+ message.content + `</content-card>
            </user-content>`;
        inboxContent.append(newDiv);
        var inboxContent = document.getElementById('inbox-content-' + message.username);
        inboxContent.scrollTop = inboxContent.scrollHeight - inboxContent.clientHeight;   
    } catch{
    }
    console.log('received: ' + message.content + ' at ' + message.time)
})

socket.on(JOIN_CHAT, commonChat => {
    var receiveId = (commonChat.members[0] == sendId) ? commonChat.members[1] : commonChat.members[0]
    // console.log(receiveId);
    var userCard = document.querySelector("user-card[user-id='" + receiveId + "']");
    userCard.setAttribute('chat-id', commonChat._id);
    var messages = commonChat.messages;
    var i = messages.length;
    console.log('----' + commonChat._id + ', length: ' + i)
    console.log(commonChat)
    var n = 0;
    var chatContents = '';
    while (i-- > 0){
        if (++n > 5){
            break
        }
        console.log(messages[i])
        var content = messages[i].content;
        chatContents = ((messages[i].creator == sendId)
        ? `<self-content posted-time="` + messages[i].time + `"><content-card>`+ content + `</content-card></self-content>` 
        : `<user-content posted-time="` + messages[i].time + `" avt-url="/users/`+ receiveId +`/avatar"><content-card>`+ content + `</content-card></user-content>`) + chatContents; 
    }
    newInput = document.createElement('input')
    newInput.setAttribute('hidden', '')
    newInput.setAttribute('id', 'chat-contents-' + receiveId)
    newInput.value = chatContents
    document.getElementById('hidden-info').append(newInput)
})

// function chatTest1() {
//     var recvId = document.getElementById('test1').value
//     joinChat(recvId)
// }

// function chatTest2() {
//     var recvId = document.getElementById('test2').value
//     joinChat(recvId)
// }

function joinChat(recvId) {
    socket.emit(JOIN_CHAT, { sendId, recvId })
}

// submit message
function sendMessage(content, room) {
    console.log('clicked!')
    const creator = document.getElementById('userid').value
    // const content = document.getElementById('message-input').value
    const msg = { creator, content }
    socket.emit(SEND_MESSAGE, { room, msg })
}

//update DOM
function appendMessge(msg) {
    // const messageInput = document.getElementById('message-input').value
    // messageInput.value = ""

    // // const messageElement = document.createElement('p')
    // // messageElement.innerText = message.content
    // // messageContainer.append(messageElement)

}

