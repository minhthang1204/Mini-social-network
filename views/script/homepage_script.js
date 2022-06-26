// const e = require("express");

function borderToggle() {
    var all = document.getElementsByTagName('div');
    var option = all[0].style.borderWidth;
    option = (option == '0.02px') ? '0px' : '0.02px';
    for (var i = 0, max = all.length; i < max; i++) {
        all[i].style.borderWidth = option;
    }
    if (option == '0px') {
        var all = document.getElementsByClassName('interaction-option');
        for (var i = 0, max = all.length; i < max; i++) {
            all[i].style.borderTopWidth = '0.02px';
        }
    }
    var imageList = document.getElementsByClassName('img-wrapper');
    for (var i = 0; i < imageList.length; i++){
        var url = imageList[i].style.backgroundSize
        console.log(url)
        // var url = url.substring(5, url.length - 2)
        // console.log(url)
        // var image = new Image(url)
        // console.log(image.naturalHeight)
    }
}
function inboxOpen() {
    var inboxPane = document.getElementById('inbox-pane');
    if (inboxPane.style.display != 'none') inboxPane.style.display = 'none';
    else {
        // var nothing = true;
        // var list = inboxPane.children;
        // for (var i = 0; i < list.length; i++){
        //     if (list[i].innerHTML.trim().length == 0){
        //         nothing = false;
        //         break;
        //     }
        // }
        // if (nothing) document.getElementById('chat-search').display = 'block';
        inboxPane.style.display = 'flex';
    }
}

function addToIconPane(username, avtURL, userId) {
    var iconPane = document.getElementById('icon-pane');
    var newInboxIcon = document.createElement('div');
    newInboxIcon.setAttribute('id', 'ii-' + username);
    newInboxIcon.style.marginTop = 'inherit';
    newInboxIcon.innerHTML = `<user-avt username="` + username + `" avt-url="` + avtURL + `" user-id="` + userId + `" size="48px" shadowable clickable></user-avt>`;
    iconPane.prepend(newInboxIcon);
}

function addEnterHandler(username) {
    var ibMaker = document.getElementById('ib-maker-' + username);
    if (ibMaker != null) ibMaker.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // joinChat(document.getElementById('ib-card-' + username).getAttribute('user-id'));
            {   
                room = document.querySelector('user-card[username="' + username + '"]').getAttribute('chat-id')
                sendMessage(ibMaker.innerHTML, room);
                var inboxContent = document.getElementById('inbox-content-' + username);
                var newDiv = document.createElement('div');
                newDiv.innerHTML =
                    `<self-content>
                            <content-card>`+ ibMaker.innerHTML + `</content-card>
                    </self-content>`;
                inboxContent.append(newDiv);
                this.innerHTML = '';
                inboxContent.scrollTop = inboxContent.scrollHeight - inboxContent.clientHeight
            }
        }
    })
}

function chatSearchOpen(){
    var inboxPane = document.getElementById('inbox-pane');
    inboxPane.style.display = 'flex';
    var inboxList = inboxPane.children;
    if (inboxList[2].innerHTML != '') {
        var data = inboxList[2].children[0];
        addToIconPane(data.getAttribute('username'), data.getAttribute('avt-url'), data.getAttribute('user-id'));
    }
    inboxList[2].innerHTML =
        `<inbox-card search>
        </inbox-card>`;
}
function userInboxOpen(username, avtURL, userId) {
    var inboxPane = document.getElementById('inbox-pane');
    inboxPane.style.display = 'flex';
    var inboxList = inboxPane.children;
    var user = document.getElementById('username').value;
    var exist = false;
    for (var i = 0; i < inboxList.length; i++) {
        if (username == user || inboxList[i].getAttribute('id') == ('ic-' + username)) {
            exist = true;
            break;
        }
    }

    if (!exist) {
        try {
            document.getElementById('ii-' + username).remove();
        } catch (error) {

        }
        if (inboxList[2].innerHTML != '') {
            var data = inboxList[2].children[0];
            addToIconPane(data.getAttribute('username'), data.getAttribute('avt-url'), data.getAttribute('user-id'));
        }
        console.log('chat-contents-' + userId)
        var chatContents = document.getElementById('chat-contents-' + userId).value;
        
        inboxList[2].innerHTML =
            `<inbox-card id="ib-card-` + username + `" username="` + username + `" avt-url="` + avtURL + `" user-id="` + userId + `">
                `+ chatContents + `
            </inbox-card>`;
        addEnterHandler(username);
        inboxList[2].setAttribute('id', 'ic-' + username);
        inboxPane.prepend(inboxList[2]);
        var inboxContent = document.getElementById('inbox-content-' + username);
        inboxContent.scrollTop = inboxContent.scrollHeight - inboxContent.clientHeight;
    }
}

function userInboxMinimize(username, avtURL, userId) {
    userInboxClose(username);
    addToIconPane(username, avtURL, userId);
}

function userInboxClose(username) {
    var ic = document.getElementById('ic-' + username);
    var inboxPane = document.getElementById('inbox-pane');
    ic.innerHTML = '';
    ic.setAttribute('id', '');
    inboxPane.append(ic);
}

function chatSearch(){

}

function commentToggle(postId) {
    console.log(postId);
    var commentPane = document.getElementById('comment-pane-' + postId);
    commentPane.style.display = (commentPane.style.display == 'none') ? 'block' : 'none';
}

function addImage() {
    var img = document.getElementById('post-img');
    input.click();

}

function newPost() {
    var content = document.getElementById('post-text-holder').innerHTML;
    var input = document.getElementById('content');
    input.value = content;
}

function newComment(username, avtURL, postId, content) {
    var commentPane = document.getElementById('comment-pane-' + postId);
    console.log('comment-pane-' + postId);
    var commentList = commentPane.children[1];
    var newCmtCard = document.createElement('self-comment');
    var data = {
        content: content,
        post: postId
    }

    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/comments/create", true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = function () {
        if (this.status == 201) {
            newCmtCard.innerHTML = content;
            commentList.prepend(newCmtCard);
        }
    }

    xhr.send(JSON.stringify(data))

}

function likeToggle(id) {
    var likeIcon = document.getElementById('like-icon' + id);
    var liked;
    if (likeIcon.innerHTML == `<i style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/ptmOCQ76hZw.png&quot;); background-position: 0px -196px; background-size: 74px 362px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>`){
        likeIcon.innerHTML = `<i style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/ngLgffUUmQH.png&quot;); background-position: 0px -758px; background-size: 34px 976px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>`;
        liked = false;
    }
    else {
        likeIcon.innerHTML = `<i style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/ptmOCQ76hZw.png&quot;); background-position: 0px -196px; background-size: 74px 362px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>`;
        liked = true;
    }
    console.log(liked);
    var likeCount = document.getElementById('like-count-' + id);
    likeCount.innerHTML = parseInt('0' + likeCount.innerHTML) + ((liked) ? 1 : -1);
    if (likeCount.innerHTML > 1) likeCount.innerHTML = likeCount.innerHTML + ' Likes';
    else likeCount.innerHTML = likeCount.innerHTML + ' Like';
    var data = {    
        post: id
    }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/likes/create", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function() {
        if(this.status == 201){
            var result = JSON.parse(xhr.response)
            
        }
    }

    xhr.send(JSON.stringify(data))
}

function likeShow(postId){
    
}

function showResults(searchText) {
    var res = '';
    var size = 0;
    console.log("ok")
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/livesearch", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        if (this.status == 201) {
            var result = JSON.parse(xhr.response)
            console.log(result)
            var hint = document.getElementById('search-hint');
            for (var i = 0; i < result.length; i++) {
                if (result[i].username.indexOf(searchText) != -1) {
                    res = res + `<user-card username="` + result[i].username + `" avt-url="` + result[i].avatarurl + `" href="/users/` + result[i]._id + `"></user-card>`;
                    if (++size == 6) break;
                }
             }
            if (res == '' || searchText == ''){
                hint.style.display = 'none';
            }
            else {
                hint.style.display = 'block';
            }
            hint.innerHTML = res; 
        }
    }

    xhr.send()
}

function navButtonOn(id){
    document.getElementById(id).children[0].children[0].children[0].style.color = '#1877f2'
}

function navButtonOff(id){
    var pageName = document.getElementById('pagename').value
    document.getElementById(id).children[0].children[0].children[0].style.color = (pageName + '-nav' == id) ? '#1877f2' : 'rgba(0, 220, 255, 1)'
}

function addException(id){
    document.getElementById('exception').value = id + '-dropdown'
}

function removeException(){
    document.getElementById('exception').value = 'undefined-id'
}

function dropDownOff(){
    var exception = document.getElementById('exception').value
    var list = document.querySelectorAll('.dropdown-pane:not(#' + exception + ')')
    for (var i = 0; i < list.length; i++){
        list[i].style.display = 'none'
    }
}

function openDropdown(id){
    var style = document.getElementById(id + '-dropdown').style
    if (style.display == 'none') style.display = 'block'
    else style.display = 'none';
    console.log('hehe')
}

function requestHidden(id){
    var card = document.getElementById(id);
    var dropdown = card.parentNode;
    card.remove()
    if(dropdown.innerHTML.trim().length == 0){
        dropdown.innerHTML = `<a class="each-drop-content" href="#">No friend request yet</a>`
    }
    // borderToggle()
}
