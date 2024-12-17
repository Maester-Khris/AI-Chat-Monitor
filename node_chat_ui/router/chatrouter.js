const express = require("express")
const router = express.Router()
const axios = require("axios")
const crypto = require("crypto")
const auth = require("../auth")
const authMiddleware = require('../middlewares/auth')
const dotenv = require("dotenv")
const utils = require("../utils")
const jwt = require("jsonwebtoken");
dotenv.config("../")


module.exports = (myKafkaProducer, redisClient) =>{
    /**
     * ======================== Rooms routes ============================
     * 1- Home with list of users
     * 2- Enter Discussion rooms
     * 3- to retrieve the list of users from the db imply the user have to be logged
    */


    // if authentication cookie not present redirect to home page
    // if present fetch list of user from database and display the view with it
    router.get('/',async(req, res)=>{
        console.log("try a way to access payload");
        console.log(req.cookies.userloggedID);
       let cookies = req.headers.cookie;
       let tokens = cookies.split(";").filter(c => c.includes("userloggedID="));
       if(tokens.length==0){
        console.log("not logged");
        res.redirect('http://127.0.0.1:3000');
       }else{
        let token_payload = utils.decodeJwtToken(req.cookies.userloggedID);
        let useruuid=token_payload.uuid;
        let accesstoken = tokens[0].split("=")[1];
        var userresponse;
         try{
            userresponse = await axios.get("http://127.0.0.1:8000/api/users/list", {headers: {
                'Authorization': `Bearer ${accesstoken}` 
            }});
         }catch(error){
            console.error("Error fetching users:", error.response ? error.response.data : error.message);
         }
        let users = userresponse.data.data.filter(user => user.useruuid != useruuid ).map(u =>{return {uuid: u.useruuid, username:u.username}});
        console.log(users);
        res.render("user_list", { csrfToken: req.csrfToken(), users:users});
       }
    });
    
    /**
     * ============ Loading conversation or starting new one ===============================
     * extract participant! user from session, participant from url
     * load existing messages if possible from redis session store or distant database
     * if not possible create a new room with empty messages
    */
    router.get("/:participant", authMiddleware.is_logged, async (req,res)=>{
        let cookies = req.headers.cookie;
        let tokens = cookies.split(";").filter(c => c.includes("userloggedID="));
        if(tokens.length==0){
         console.log("not logged");
         res.redirect('http://127.0.0.1:3000');
        }else{
            let roomuuid;
            var chat_messages, db_messages;
            let participantuuid = req.params.participant;

            let token_payload = utils.decodeJwtToken(req.cookies.userloggedID);
            let useruuid=token_payload.uuid
            let redisdatakey = "sess:"+req.sessionID;
            let redischatstore = await redisClient.get(redisdatakey);
            let chatstoredata = JSON.parse(redischatstore);
            if(typeof(chatstoredata.chat_session_store)!="undefined"){
                console.log("using redis data store");
                let room = Object.entries(chatstoredata.chat_session_store).map(([key, value])=>{
                    if(Array.of(value).filter(m => m.receiver ==participantuuid && m.sender==useruuid)){
                        return key;
                    }
                });
                roomuuid = room[0];
                chat_messages = chatstoredata.chat_session_store[room[0]];
                console.log("messages from redis store");
                console.log(chat_messages);
            }else{
              console.log("trying with data from distant db");
              db_messages = [];
              var messagesresponse;
              try{
                let cookies = req.headers.cookie;
                let temp = cookies.split(";");
                let token = temp.filter(c => c.includes("userloggedID="))[0]
                let accesstoken = token.split("=")[1];
                
                let retrievemsgurl = `http://127.0.0.1:8000/api/messages/participants/${useruuid}/${participantuuid}`;
                messagesresponse = await axios.get(retrievemsgurl, {headers: {
                    'Authorization': `Bearer ${accesstoken}` 
                }});
              }catch(error){
                  console.error("Error fetching users:", error.response ? error.response.data : error.message);
              }
    
              console.log("displaying message from database");
              console.log(messagesresponse.data);
              db_messages = messagesresponse.data.data;
              if(db_messages.length > 0){
                chat_messages = db_messages;
              }else{
                console.log("finlally starting a new conv");
                chat_messages = [];
                roomuuid = crypto.randomUUID();
              }
            }
            res.render("form", { csrfToken: req.csrfToken(), roomuuid:roomuuid, messages:chat_messages, useruuid:useruuid})
        }
    });


   
    /**
     * ================== Async Discussion room routes =========================
     * 1- send new messages
     * 2- Updates message reception
    */
    router.post("/room-message", async(req,res)=>{
        const {room, message} = req.body;
        // Initialize chat_session_store if it doesn't exist
        if (typeof req.session.chat_session_store === "undefined") {
            console.log("total empty session");
            req.session.chat_session_store = {}; // Use a plain object
        }
        // Ensure the room exists in the session store
        if (!req.session.chat_session_store[room]) {
            req.session.chat_session_store[room] = []; // Initialize as an array
        }
        
        // Add the new message to the session
        req.session.chat_session_store[room].push(message);
        console.log("Updated session store:", req.session.chat_session_store);

        // push to the kafka queue:
        let to_queue_message = [{value: JSON.stringify({message:message})}];
        myKafkaProducer.send({topic: process.env.KAFKA_BROKER_TOPIC_NAME, messages:to_queue_message});
        res.status(200).json({"result":"message well received"})
    });
    router.post("/message-update", async(req,res)=>{
        // update message tag in the session store
        const {room, message} = req.body;
        chat_session_store = req.session.chat_session_store;
        let messages = chat_session_store.get(room);
        messages = messages.filter(m => m.uuid == message.uuid).map(m => m.tag = message.tag);
        chat_session_store.set(room, messages);
        req.session.chat_session_store = chat_session_store;
        res.status(200).json({"result":"message well updated"})
    });
   
    return router;
}
