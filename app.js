const spinner = document.getElementById("spinner")
const fs = require("fs");

const defualtConfig = `
{
    "username": "",
    "password": "",
    "autoLogin": false
}`
function logout() {
    spinner.style.display = "block"
    fs.writeFileSync('config.json', defualtConfig);
    setTimeout(() => {
        window.location.href = "login.html"
    }, 500);
    
}