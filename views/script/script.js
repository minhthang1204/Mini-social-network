var clicked_set = new Set();
var blank_text = 'Please do not leave the box above blank!';
var invalid_text = new Map(
    [
        ['username', 'You have entered an invalid usename! Please try again!'],
        ['email', 'You have entered an invalid email! Please try again'],
        ['phonenumber', 'You have entered an invalid phone number! Please try again!'],
        ['password', 'Password should be 6-16 characters in length!'],
        ['confirm', 'The password must match the one above']
    ]
);

function warning_on(value1, value2, set) {
    var tag = document.getElementById(value1 + "-warning");
    if (blank(value1)) {
        tag.innerHTML = blank_text;
        tag.style.display = "flex";
    }
    else if(!valid(value1)){
        tag.innerHTML = invalid_text.get(value1);
        tag.style.display = "flex";
    }
    else {
        console.log("undone");
        tag.style.display = "none";
        console.log("done");
    }
}

function warning() {
    clicked_set.forEach(warning_on);
}
function blank(field) {
    if(document.getElementById(field).value === "") return true;
    return false;
}
function valid(fieldname) {
    var val = document.getElementById(fieldname).value;
    switch(fieldname){
        case "username":return usernameValidation(val);

        case "email": return emailValidation(val);

        case "phonenumber":return telephoneValidation(val);

        case "password":return passwordValidation(val);

        case "confirm":return confirmValidation(val);

        case "dob":return dateValidation();
    }
    return false;
}
function test() {
    alert(document.getElementById("month").value);
}
function formValidation() {
    if (usernameValidation(username)) {
        if (emailValidation(email)) {
            if (telephoneValidation(telephone)) {
                if (passwordValidation(password, confirm)) {
                    if (dateValidation(date_day, date_year, date_month))
                        return true;
                }
            }
        }
    }
    return false;
}
function usernameValidation(username) {
    var username_length = String(username).length;
    var usernameFormat = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;
    if (username_length != 0 && String(username).match(usernameFormat)) {
        return true;
    }
    return false;
}
function emailValidation(email) {
    re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
}
function telephoneValidation(telephone) {
    var tele_length = String(telephone).length;
    var phonenum1 = /^((09|03|07|08|05|\+849|\+843|\+847|\+848|\+845)+([0-9]{8}))$/g;// sdt di dong
    var phonenum2 = /^(((02|\+842)[0-9]{1,2})?([0-9]{8}))$/g;// sdt ban
    if ((phonenum1.test(String(telephone)) && tele_length <= 12) || (phonenum2.test(String(telephone)) && tele_length <= 14))
        return true;
    else return false;
}
function passwordValidation(password) {
    pass_length = String(password).length;
    if (pass_length < 6 || pass_length > 16) {
        return false;
    } else {
        return true;
    }
}
function confirmValidation(confirm){
    if (document.getElementById("password").value != confirm) return false;
    return true;
}
function dateValidation() {
    var daynum = parseInt(document.getElementById("day".value), 10);
    var yearnum = parseInt(document.getElementById("year").value, 10);
    var monthnum = parseInt(document.getElementById("month"), 10);
    if (daynum > 31 || daynum < 0) {
    } else if (daynum > 30 && (monthnum == 4 || monthnum == 6 || monthnum == 9 || monthnum == 11)) {
        return false;
    } else if (daynum > 29 && monthnum == 2) {
        return false;
    } else if (daynum == 29 && monthnum == 2 && (yearnum % 4 != 0)) {
        return false;
    } else if (yearnum < 1900 || yearnum > 2021) {
        return false;
    } else {
        return true;
    }
}
function c1() {
    clicked_set.add('username');
}

function c5() {
    clicked_set.add('email');
}
function c6() {
    clicked_set.add('phonenumber');
}
function c7() {
    clicked_set.add('password');
}
function c8() {
    clicked_set.add('confirm');
}
function c_dob() {
    clicked_set.add('dob');    
}

