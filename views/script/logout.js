//HuongCTT
var logout = document.querySelector("user-card[href='../login'] a")

logout.addEventListener("click", (e) => {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/users/logout", true) 
    xhr.send()
})