const cookieParser = require('cookie-parser');

const is_logged = (req, res, next)=>{
    const authHeader = req.headers["cookie"];
    const sessionid = req.cookies["userloggedID"];
    console.log(sessionid);
    if(!authHeader ){    
        console.log("not logged");
        res.redirect("http://127.0.0.1:3000");
    }
    if(typeof sessionid == 'undefined'){
        console.log("not logged");
        res.redirect("http://127.0.0.1:3000");
    }
    // console.log("the header");
    // console.log(authHeader);
    next();
}

module.exports = {is_logged}