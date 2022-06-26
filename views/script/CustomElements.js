function ifNull(attributeValue, defaultValue) {
    if (attributeValue == null || attributeValue == '') return defaultValue
    else return attributeValue;
}

function parseTime(time) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var toTime = new Date(time);
    var now = Date.now();
    var t = (now - toTime.getTime()) / 3600000
    if (toTime.getFullYear() == new Date(now).getFullYear()) {
        if (t >= 24) {
            t = toTime.getDate() + ' ' + months[toTime.getMonth()] + ' at ' + ((toTime.getHours() < 10) ? '0' : '') + toTime.getHours() + ':' + toTime.getMinutes()
        }
        else if (t >= 2) {
            t = parseInt(t) + ' hours ago'
        }
        else if (t >= 1) {
            t = 'an hour ago'
        }
        else {
            t = t * 60
            if (t >= 2) {
                t = parseInt(t) + ' minutes ago'
            }
            else if (t >= 1) {
                t = 'a minute ago'
            }
            else {
                t = 'just now'
            }
        }
    }
    else {
        t = months[toTime.getMonth()] + ' ' + toTime.getDate() + ', ' + toTime.getFullYear()
    }
    return t
}

function ifTimeNull(attributeValue, defaultValue) {
    if (attributeValue == null || attributeValue == '' || attributeValue == 'undefined') return defaultValue
    else return parseTime(attributeValue)
}

window.customElements.define('user-post', class extends HTMLElement {

    constructor() {
        super();
        var postId = this.getAttribute('post-id');
        postId = ifNull(postId, '');
        var username = this.getAttribute('username');
        var avtURL = this.getAttribute('avt-url');
        var text = this.getAttribute('text');
        var href = this.getAttribute('href');
        var likeCount = this.getAttribute('like-count');
        var cmtCount = this.getAttribute('cmt-count');
        var cmtText = (parseInt(cmtCount) > 1) ? cmtCount + ' Comments' : (parseInt(cmtCount) == 1 ? '1 Comment' : '')
        var likeText = (parseInt(likeCount) > 1) ? likeCount + ' Likes' : (parseInt(likeCount) == 1 ? '1 Like' : '');
        var imgURL = this.getAttribute('img-url');
        var img = (imgURL == null || imgURL == '') ? `` : `<img x="0" y="0" height="100%" width="100%" src="` + imgURL + `" alt="Post" style="height: auto; width: 100%;"></img>`;
        var postedTime = this.getAttribute('posted-time');
        postedTime = ifTimeNull(postedTime, 'long time ago')
        var likeIcon = (this.getAttribute('liked') == 'true') ? `<i style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/ptmOCQ76hZw.png&quot;); background-position: 0px -196px; background-size: 74px 362px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>` :
            `<i  style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/ngLgffUUmQH.png&quot;); background-position: 0px -758px; background-size: 34px 976px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>`;
        this.innerHTML = `<div class="post visible-box">
        <div class="post-head">
            <div class="filler flexable">
                <div style="width:70%" class="poster-pane">
                    <user-card username="` + username + `" avt-url="` + avtURL + `" href="` + href + `"></user-card>
                </div>
                <div style="width:30%" class="posted-time right-text">
                    ` + postedTime + `
                </div>
            </div>
        </div>
        <div class="content">
            <div class="text-content">
                <div class="filler">
                    ` + text + `
                </div>
            </div>
            <div class="image-content">
                <div class="filler">
                ` + img + `
                </div>
            </div>
        </div>
        <div class="interaction" style="font-size: small;">
            <div class="counter flexable">
                <div class="reaction-counter left-text" >
                    <a id="like-count-` + postId + `" class="underlinable" onclick="likeShow(`+ postId + `)">` + likeText + `</a>
                </div>
                <div class="comment-counter mid-text">
                    <a id="cmt-count-` + postId + `" class="underlinable" ">` + cmtText + `</a>
                </div>
                <div class="share-counter right-text" >
                    <a class="underlinable" > 2 Shares </a>
                </div>
            </div>
            <div class="interaction-option flexable">
                <div type="class="like-button interaction-button" >
                    <form id="like-form` + postId + `" onsubmit="return false;">
                    <button id="like-button` + postId + `" type="submit" class="color-change like-button" style="display: flex; width: 100%" onClick="likeToggle('` + postId + `')">
                            <div class="flexable">
                                <div id="like-icon` + postId + `" style="width:fit-content; height: 18px;">` + likeIcon + `</div>
                                <div>
                                    Like
                                </div>
                            </div>
                    </button>
                    </form>
                </div>
                <div class="comment-button interaction-button">
                    <div class="color-change" style="display: flex; width: 100%" onClick="commentToggle('` + postId + `')">
                            <div class="flexable">
                                <div style="width:fit-content; height: 18px;">
                                    <i 
                                        style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/z7XVB9GeK-b.png&quot;); background-position: -22px -170px; background-size: 74px 358px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>
                                </div>
                                <div>
                                    Comment
                                </div>
                            </div>
                    </div>
                </div>
                <div class="more-button interaction-button" onClick="share(` + postId + `)">
                    <div class="color-change" style="display: flex; width: 100%">
                            <div class="flexable">
                                <div style="width:fit-content; height: 18px;">
                                    <i 
                                        style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/z7XVB9GeK-b.png&quot;); background-position: -20px -192px; background-size: 74px 358px; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;"></i>
                                </div>
                                <div>
                                    Share
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            <div id="comment-pane-` + postId + `" class="comment-pane" style="display: none">
                <div class="self-comment">
                    <div class="flexable">
                        <user-avt self></user-avt>
                        <content-card box-id="` + postId + `" editable max-size="580px"></content-card>
                    </div>
                </div> 
                <div class="comment-list">
                    ` + this.innerHTML + `
                </div>
                <div class="mid-text" style="font-size:1.2em">
                    <a class="underlinable clickable">
                        <b>More</b>
                    </a>
                </div>
            </div>
        </div>
    </div>`;
    }
});

window.customElements.define('inbox-card', class extends HTMLElement {
    constructor(username, avtURL, id, toSearch) {
        super();
        username = this.getAttribute('username');
        avtURL = this.getAttribute('avt-url');
        toSearch = (this.getAttribute('search') == '') ? `` : `<user-card username="` + username + `" avt-url="` + avtURL + `" href="/users/` + userId + `"></user-card>`
        var userId = this.getAttribute('user-id')
        this.innerHTML = `<div class="inbox-card shadowable visible-box">
        <div class="inbox-head flexable shadowable">
            <div style="width:70%" class="">
                `+ toSearch + `
            </div>
            <div class="flexable" style="width:30%; height:100%; text-align: right;">
                <div class="color-change minimize-button button" onclick="userInboxMinimize('` + username + `','` + avtURL + `','` + userId + `')">
                    <div style="height:26px; width:fit-content">
                        <svg width="26px" height="26px" viewBox="-4 -4 24 24">
                            <line x1="2" x2="14" y1="8" y2="8" stroke-linecap="round" stroke-width="2"
                                stroke="#bec2c9"></line>
                        </svg>
                    </div>
                </div>
                <div class="color-change close-button button" onclick="userInboxClose('` + username + `')">
                    <div style="height:26px; width:fit-content">
                        <svg width="26px" height="26px" viewBox="-4 -4 24 24">
                            <line x1="2" x2="14" y1="2" y2="14" stroke-linecap="round" stroke-width="2"
                                stroke="#bec2c9"></line>
                            <line x1="2" x2="14" y1="14" y2="2" stroke-linecap="round" stroke-width="2"
                                stroke="#bec2c9"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div id="inbox-content-` + username + `" class="inbox-content scrollview" style="height:78.5%; overflow-y: scroll;">
            ` + this.innerHTML + `
        </div>
        <div class="inbox-interaction flexable" style="font-size:small; height:fit-content">
            <div class="wrapper clickable">
                <i
                    style="background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/jJF3ugHVLNd.png); background-position: 0 -298px; background-size: 34px 631px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;">
                </i>
            </div>
            <div class="wrapper clickable">
                <i
                    style="background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/jJF3ugHVLNd.png); background-position: 0 -298px; background-size: 34px 631px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;">
                </i>
            </div>
            <div class="wrapper clickable">
                <i
                    style="background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/jJF3ugHVLNd.png); background-position: 0 -298px; background-size: 34px 631px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;">
                </i>
            </div>
            <div class="wrapper" style="width:100%">
                <content-card username="` + username + `" editable max-size="300px" type="inbox"></content-card>
            </div>
            <div class="wrapper clickable" onclick="sendMessage()">               
                <svg viewBox="0 0 16 16" height="20" width="20" class="crt8y2ji">
                    <path
                        d="M16,9.1c0-0.8-0.3-1.1-0.6-1.3c0.2-0.3,0.3-0.7,0.3-1.2c0-1-0.8-1.7-2.1-1.7h-3.1c0.1-0.5,0.2-1.3,0.2-1.8 c0-1.1-0.3-2.4-1.2-3C9.3,0.1,9,0,8.7,0C8.1,0,7.7,0.2,7.6,0.4C7.5,0.5,7.5,0.6,7.5,0.7L7.6,3c0,0.2,0,0.4-0.1,0.5L5.7,6.6 c0,0-0.1,0.1-0.1,0.1l0,0l0,0L5.3,6.8C5.1,7,5,7.2,5,7.4v6.1c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,1,1,2,1h5.2c0.9,0,1.4-0.3,1.8-0.9 c0.3-0.5,0.2-1,0.1-1.4c0.5-0.2,0.9-0.5,1.1-1.2c0.1-0.4,0-0.8-0.2-1C15.6,10.3,16,9.9,16,9.1z">
                    </path>
                    <path
                        d="M3.3,6H0.7C0.3,6,0,6.3,0,6.7v8.5C0,15.7,0.3,16,0.7,16h2.5C3.7,16,4,15.7,4,15.3V6.7C4,6.3,3.7,6,3.3,6z">
                    </path>
                </svg>
            </div>
        </div>
    </div>
    <script>
        console.log('open inbox card');
    </script>`
    }
})

window.customElements.define('user-card', class extends HTMLElement {
    constructor() {
        super();
        var username = this.getAttribute('username');
        username = ifNull(username, 'name');
        var avtURL = this.getAttribute('avt-url');
        var userId = ifNull(this.getAttribute('user-id'), '');

        var chatId = ifNull(this.getAttribute('chat-id'), '');
        var chatContents = ifNull(this.getAttribute('chat-contents'), '');
        var href = this.getAttribute('href');
        var link = (href == null) ? '' : `href="` + href + `" `;

        var onClick = (href == null) ? `onClick="userInboxOpen('` + username + `','` + avtURL + `','` + userId + `')" ` : '';
        this.innerHTML =
            `<div style="display: flex;" class="user-bar">
            <a class="color-change" ` + link + ` style="width: 100%" ` + onClick + `>
                <div class="flexable user-card-wrapper">
                    <user-avt username="` + username + `" avt-url="` + avtURL + `"></user-avt>
                    <div style="display: table; text-align: left;">
                        <span style="display: table-cell; height: 40px; vertical-align: middle">
                            ` + username + `
                        </span>
                    </div>
                </div>
            </a>
        </div>`;
    }
})

window.customElements.define('user-avt', class extends HTMLElement {
    constructor(username, avtURL, size, shadowable, clickable, pointer, onClick, marginDirect) {
        super();
        username = this.getAttribute('username');
        avtURL = this.getAttribute('avt-url');
        avtURL = ifNull(avtURL, '/image/avt.jpg');
        // var userID = document.getElementById('userid').value;
        var userId = this.getAttribute('user-id')
        if (this.getAttribute('self') == '') {
            avtURL = ifNull(document.getElementById('useravt').value)
        }
        avtURL = ifNull(avtURL, '/image/avt.jpg');
        size = this.getAttribute('size');
        size = ifNull(size, '40px');
        // var padding = (parseInt(size) - 20)/2 + 'px';
        shadowable = (this.getAttribute('shadowable') == '') ? `box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);` : '';
        clickable = this.getAttribute('clickable');
        pointer = (clickable == '') ? 'cursor: pointer;' : '';
        onClick = (clickable == '') ? `onClick="userInboxOpen('` + username + `','` + avtURL + `','` + userId + `')"` : '';
        marginDirect = (this.getAttribute('margin-direct') == 'left') ? 'left' : 'right';
        this.innerHTML = `
         <div class="avt-wrapper" style=" margin-` + marginDirect + `: 5px; 
            background-color: #f0f2f5; width:` + size + `; 
            height:` + size + `;
            margin-top: inherit; 
            border-radius: 50%;
            ` + pointer + shadowable + `
        "` + onClick + `>
            <i 
            style="background-image: url(` + avtURL + `); background-position: 0 0; background-size:` + size + `; width: ` + size + `; height: ` + size + `; background-repeat: no-repeat;display: inline-block; border-radius:inherit;">
            </i>
        </div>`;
    }
})

window.customElements.define('user-content', class extends HTMLElement {
    constructor() {
        super();
        var username = this.getAttribute('username');
        var avtURL = this.getAttribute('avt-url');
        var postedTime = this.getAttribute('posted-time');
        postedTime = ifTimeNull(postedTime, 'long time ago')
        avtURL = ifNull(avtURL, 'image/avt.jpg');
        this.innerHTML = `<div class="content-wrapper">
            <div class="flexable" style="align-items: flex-end;">
                <user-avt username="` + username + `" avt-url="` + avtURL + `" size="30px"></user-avt>      
                <div class="content-pane">
                    ` + this.innerHTML + `
                </div>
            </div>
            <div class="posted-time mid-text">`+ postedTime + `</div>
        </div>`;
    }
})

window.customElements.define('self-content', class extends HTMLElement {
    constructor() {
        super();
        var postedTime = this.getAttribute('posted-time');
        if (postedTime == 'undefined') postedTime = '2021-05-19T15:18:56.891Z'
        postedTime = ifTimeNull(postedTime, 'just now')
        this.innerHTML = `
        <div class="content-wrapper">
            <div class="flexable" style="align-items: flex-end;">
                <div class="content-pane">                   
                    ` + this.innerHTML + `                    
                </div>
                <user-avt self size="30px" margin-direct="left"></user-avt>         
            </div>
            <div class="posted-time mid-text" >
                ` + postedTime + `
            </div>
        </div>`;
    }
})

window.customElements.define('user-comment', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var username = this.getAttribute('username');
        username = ifNull(username, 'Name');
        var avtURL = this.getAttribute('avt-url');
        var userId = this.getAttribute('user-id');
        var postedTime = this.getAttribute('posted-time');
        postedTime = ifTimeNull(postedTime, 'long time ago');
        avtURL = ifNull(avtURL, 'image/avt.jpg');
        this.innerHTML =
            `<div class="content-wrapper">
            <div class="flexable" style="align-items: flex-start;">
                <user-avt avt-url="` + avtURL + `" size="40px" clickable></user-avt>      
                <div class="content-pane">
                    <content-card max-size="550px">
                        <a class="underlinable clickable" href="/users/`+ userId + `"><b>` + username + `</b></a>
                        <br>
                        ` + this.innerHTML + `
                    </content-card>
                    <div class="left-text" style="margin-top:0.5%">
                        <a class="underlinable clickable" >
                        <b>Like</b>
                        </a>.
                        <a class="underlinable clickable" >
                        <b>Reply</b>
                        </a>.
                        ` + postedTime + `
                    </div>
                </div>    
            </div>
        </div>`
    }
})

window.customElements.define('self-comment', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var username = document.getElementById('username').value;
        var postedTime = this.getAttribute('posted-time');
        postedTime = ifTimeNull(postedTime, 'just now');
        this.innerHTML =
            `<div class="content-wrapper">
            <div class="flexable" style="align-items: flex-start;">
                <user-avt self size="40px" clickable></user-avt>      
                <div class="content-pane">
                    <content-card max-size="550px">
                        <a class="underlinable clickable" ><b>` + username + `</b></a>
                        <br>
                        ` + this.innerHTML + `
                    </content-card>
                    <div class="left-text" style="margin-top:0.5%">
                        <a class="underlinable clickable" >
                        <b>Like</b>
                        </a>.
                        <a class="underlinable clickable" >
                        <b>Reply</b>
                        </a>.
                        ` + postedTime + `
                    </div>
                </div>    
            </div>
        </div>`
    }
})

window.customElements.define('content-card', class extends HTMLElement {
    constructor() {
        super();
        var text = this.innerHTML;
        var maxSize = this.getAttribute('max-size');
        var username = this.getAttribute('username');
        var boxId = ifNull(this.getAttribute('box-id'), '');
        var ibMaker = (username != null) ? (`id="ib-maker-` + username + `" `) : ``;
        maxSize = ifNull(maxSize, '200px');
        text = ifNull(text, '');
        var editable = (this.getAttribute('editable') == '') ? ' editable' : '';
        var postMaker = (username == null && editable != '') ? (`id="` + boxId + `"`) : ``;
        var contentEditable = (editable == '') ? ' ' : ' contenteditable="" ';
        this.innerHTML =
            `<div class="text-wrapper` + editable + `" style="max-width:` + maxSize + `">
                <span ` + ibMaker + postMaker + `class="text-holder" ` + contentEditable + ` placeholder="Write something ...">
                ` + text + `</span>
            </div>`;
    }
})

window.customElements.define('live-search', class extends HTMLElement {
    constructor() {
        super();
        this.innerHTML =
            `<div class="text-wrapper editable" style="width:100%">               
                <span class="text-holder" contenteditable="" placeholder="Search anything here" style="height:25px;width:100%;text-align:initial; font-size: medium" onkeyup="showResults(this.innerHTML)"></span>
            </div>`;
    }
})