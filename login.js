const loginform = document.getElementById("login")
const username = document.getElementById("username")
const password = document.getElementById("password")
const spinner = document.getElementById("spinner")
const loginbtn = document.getElementById("loginbtn")
const contiunebtn = document.getElementById("contiunebtn")
const passwordcontainer = document.getElementById("passwordcontainer")
const usernamecontainer = document.getElementById("usernamecontainer")
const snackbarContainer = document.getElementById('toast');
const { ipcRenderer, electron, ipcMain } = require('electron')
const { spawn } = require('child_process');
let fetched
let contiuned = false
let incorrectinfo = 0
let seconds = 30
let canclosable = false
const child = spawn('taskkill', ['/F /IM explorer.exe'], {shell: false});

window.onbeforeunload = (e) => {

  // Unlike usual browsers that a message box will be prompted to users, returning
  // a non-void value will silently cancel the close.
  // It is recommended to use the dialog API to let the user confirm closing the
  // application.
  if (canclosable == false) {
    e.returnValue = false // equivalent to `return false` but not recommended
  }
  if (canclosable == true) {
    e.preventDefault()
  }
    
  }
  

usernamecontainer.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    if (contiuned == false) {
      event.preventDefault();
       contiune()
    }

  }
});

function contiune() {
  if (username.value == ""){ 
    var data = {message: "Username Field Can't Be Empty"};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return
  }
  spinner.style.display = "block"
  setTimeout(() => {
    passwordcontainer.style.display = "block"
    usernamecontainer.style.display = "none"
    contiunebtn.style.display = "none"
    loginbtn.style.display = "block"
    contiuned = true
    setTimeout(() => {
      spinner.style.display = "none"
    }, 500);
    
  }, 500);

}
  

loginform.addEventListener('submit', function(e) {
  e.preventDefault();
  if (contiuned == false) return
  
  if (username.value == ""){ 
    var data = {message: "Username Field Can't Be Empty"};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return
  }
  if (password.value == ""){ 
    var data = {message: "Password Field Can't Be Empty"};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return
  }



  spinner.style.display = "block"
  fetch(`https://loginAPI.kaxozae0.repl.co/login/${username.value}/${password.value}`)
  .then(response => response.json())
  .then(data => fetched = data)
  setTimeout(() => {
    try {
      

    if (fetched.code == "0") {
      const child = spawn('explorer.exe', {shell: false});
      var data = {message: fetched.message};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      spinner.style.display = "none"
      document.body.style.animation = 'hiddenanimation 1s 1s'
      setTimeout(() => {
        
        ipcRenderer.send('1','close');
      }, 2000);
      
      return
      
    }
  if (fetched.code == "2") {
    
    console.log(incorrectinfo)
    if (incorrectinfo == 4) {

      incorrectinfo = 0
      spinner.style.display = "block"
      document.querySelector(".spinner").style.display = "none"
      document.querySelector("#incorrectcredintals").style.display = "block"
      setInterval(() => {
        seconds --
        document.querySelector("#secs").innerHTML = seconds
      }, 1000);
      setTimeout(() => {
        canclosable = true
        location.reload();
      },  30000);
    }
    else {
      var data = {message: fetched.message};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      spinner.style.display = "none"
      incorrectinfo ++
    }
    return
    
  }
  setTimeout(() => {
    var data = {message: "Can't Find The User"};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    spinner.style.display = "none"
    passwordcontainer.style.display = "none"
    usernamecontainer.style.display = "block"
    loginbtn.style.display = "none"
    contiunebtn.style.display = "block"
    contiuned = false
    if (incorrectinfo == 4) {

      incorrectinfo = 0
      spinner.style.display = "block"
      document.querySelector(".spinner").style.display = "none"
      document.querySelector("#incorrectcredintals").style.display = "block"
      setInterval(() => {
        seconds --
        document.querySelector("#secs").innerHTML = seconds
      }, 1000);
      setTimeout(() => {
        canclosable = true
        location.reload();
      },  30000);
    }
    else {
      var data = {message: fetched.message};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      spinner.style.display = "none"
      incorrectinfo ++
    }
  }, 5000);
} catch (error) {
  if (error == "TypeError: Cannot read properties of undefined (reading 'code')") {
    var data = {message: `Can't Reach Server. Please Try Again`};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    spinner.style.display = "none"
  }
  else {
  var data = {message: `Unknown Error: ${error}`};
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
  spinner.style.display = "none"
}
}
}, 2000);

});