const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/",(req,res)=>{
    let cookies = req.headers.cookie;
    console.log(cookies);
    res.render("index",  { csrfToken: req.csrfToken()})
});

//============= Auth routes ==============================
router.post("/signup", async(req, res)=>{
    let {username, email, password} = req.body;
    console.log(username, email, password);
    let response = await axios.post("http://127.0.0.1:8000/api/auth/signup",{
        username:username,
        email: email,
        password: password,
        useruuid: crypto.randomUUID()
    });
    console.log(response.data);
    res.redirect("/rooms");
});

router.post("/login", async(req, res)=>{
    let {username, password} = req.body;
    var logingresponse;
    try {
        logingresponse = await axios.post("http://127.0.0.1:8000/api/auth/login",{
            username:username,
            password: password,
        });
    } catch (error) {
        console.error("Error authenticating user:", error.response ? error.response.data : error.message);
    }
    
    console.log(logingresponse.data);
    console.log(logingresponse.data.token.access);
   
    //check if userloggedID cookiee already exist and empty it
    let cookies = req.headers.cookie;
    console.log(cookies);
    let existingtokens = cookies.split(";").filter(c => c.includes("userloggedID="));
    if(existingtokens.length==1){
        res.cookie("userloggedID","");
    }

    let options = {
        maxAge: 30 * 60 * 1000, 
        httpOnly: true, 
        secure: true,
        sameSite: "None",
    };
    res.cookie("userloggedID", logingresponse.data.token.access, options); 
    res.redirect("/rooms");
});

module.exports = router;