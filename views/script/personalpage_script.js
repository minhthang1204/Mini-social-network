
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction2() {
  document.getElementById("myDropdown2").classList.toggle("show");
  
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown2");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction1() {
  document.getElementById("myDropdown1").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown1");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function (e) {
  e.preventDefault();
  console.log("co vao day");
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function (e) {
  e.preventDefault();
  modal.style.display = "none";

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  console.log("abc");
  event.preventDefault();
  if (event.target == modal) {

    modal.style.display = "none";
  }
}

