//create room uuid ✅
//create messages template (content, date, tag, uuid) ✅
//store local copie of chat session store ✅
//call axios method ✅
//extract person name from request and sent to server ✅

//define relation with websocket
//integrate redis session store
//local store has both parties message (to detext with websocket /session response)
//send method only gather logged user msg
//server will retrieve and add session id from req.header
//check on the server if exising chat present


//session store
// 1- on new message 
//    * axios post to the nodeserver - insert in session store
//    * websocket insert message
// 2- on data coming from python websocket: 
//    * case a (new data - other participant message): insert in session store
//    * case b (data update): search and update message in local session store 
//          sync session store: send updated data to nodeserver


function generateItemUUID(itemtype){
    return `${itemtype}-${crypto.randomUUID()}`
}
function axios_post(url, data){
    var data_to_send = {...data,  _csrf: document.querySelector("input[name='_csrf']").value};
    return axios({
        method: 'post', 
        url: url,
        data: data_to_send
    });
}
function websocketInit(url){
    const socket = new WebSocket(url);
    socket.onopen = function(event){
        console.log('WebSocket is connected.');
    }
    socket.onclose = function(event) {
        console.log('WebSocket is closed. Attempting to reconnect...');
        reconnectWebSocket(url);
    };
    return socket;
}
function reconnectWebSocket(url) {
    socketdjango = websocketInit(url);
}


document.addEventListener("DOMContentLoaded",function(){
    console.log(roomuuid, useruuid, participantuuid);
    // ============== init phase =============
    var local_chat_sessionstore = [];
    // var socketdjango = websocketInit("ws://127.0.0.1:8000/ws/chat-room/");
    var new_message_btn = document.querySelector("#message_send");

    /**
     * message received from socket
     * 2 scenario: update on message, reception of other person message
     * participant message: update local session store
     * update on message: update local session store and sync with server
    */
    socketdjango.onmessage = function(event){
        console.log(event.data);
        if(event.data.type="message-dispatch"){
            console.log("Message received from socket - dispatcher method ");
            let data = JSON.parse(event.data);
            local_chat_sessionstore.push(data.message);
        }else{
            local_chat_sessionstore.filter(m => m.uuid == data.message.uuid).map(m => m.tag = true);
            axios_post('/rooms/message-update',{
                room: room_uuid,
                message: data.message
            }).then(function(r){
                console.log(r);
            })
        }
        console.log("new state of local session store");
        console.log(local_chat_sessionstore);
    }

    /**
     * user sending new message operation
     * sync session store with server
     * send to websocket for dispatching
     * Note: new message in local session store has been moved to message dispatch reception
    */
    new_message_btn.addEventListener("click",function(){
        var message = {
            body: document.querySelector("textarea[name='user_message']").value,
            tag: null,
            created_at: null,
            room_uuid: roomuuid,
            sender:useruuid,
            receiver:participantuuid,
            message_uuid: generateItemUUID(""),
        };
        axios_post("/rooms/room-message",{room:room_uuid, message:message}).then(function(response){
            console.log(response);
        });
        //socketdjango.send(JSON.stringify({message: message}));
    });
})
