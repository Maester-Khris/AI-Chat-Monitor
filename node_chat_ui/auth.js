const crypto = require("crypto")

function login(username){
    usertoken = "user-"+crypto.randomUUID();
    return usertoken
}

module.exports = {login}