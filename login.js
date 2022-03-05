const loginform = document.getElementById("login")
const username = document.getElementById("username")
const password = document.getElementById("password")
const spinner = document.getElementById("spinner")
const loginbtn = document.getElementById("loginbtn")
const contiunebtn = document.getElementById("contiunebtn")
const autoLogin = document.getElementById("autologin")
const passwordcontainer = document.getElementById("passwordcontainer")
const usernamecontainer = document.getElementById("usernamecontainer")
const snackbarContainer = document.getElementById('toast');
const fs = require("fs");
const config = require("./config.json")
let fetched
let contiuned = false
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
  
if (config.autoLogin == true) {
  username.value = config.username
  password.value = config.password
  loginform.style.display = "none"
  setTimeout(() => {
    contiune()
  }, 100);
  setTimeout(() => {
    loginbtn.click()
  }, 1500);
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
      const configFile = `
      {
        "username": "${username.value}",
        "password": "${password.value}",
        "autoLogin": ${autoLogin.checked}
      }
      `
      var data = {message: fetched.message};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      fs.writeFileSync('config.json', configFile);
      spinner.style.display = "none"
      setTimeout(() => {
        window.location.href = "app.html"
      }, 500);
      
      return
      
    }
  if (fetched.code == "2") {
    var data = {message: fetched.message};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    spinner.style.display = "none"
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