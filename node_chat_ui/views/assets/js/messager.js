
/**
 *  use when loading exiting chat context
 *  each message has the type (send or receive)
*/
function insertBulk(messages, templatesend, templatereceiv, msgContainer){
    var clonesend = templatesend.content.cloneNode(true);
    var clonereceiv = templatereceiv.content.cloneNode(true);
    messages.forEach(m =>{
        var msgelement = m.type == "send" ? clonesend.querySelector(".msg-box") : clonereceiv.querySelector(".msg-box.msg-partner");
        msgelement.innerText = "";
        msgelement.innerText = m.message;
        msgContainer.appendChild(msgelement);
    });
}
function insertMsg(messagetype, content, template, msgContainer){
    var clonecontent,msgelement;
    clonecontent = template.content.cloneNode(true);
    msgelement = messagetype == "send" ? clonecontent.querySelector(".msg-box") : clonecontent.querySelector(".msg-box.msg-partner") ;
    msgelement.innerText = content
    msgContainer.appendChild(msgelement);
}

document.addEventListener("DOMContentLoaded",function(){
    var textinput = document.querySelector("#message-area");
    var templatenewmsg = document.querySelector("#send-message");
    var templaterecmsg = document.querySelector("#received-message");
    var messageList = document.querySelector(".messages-section");
    var sendbutton = document.querySelector("#message-area-send");
    var cancelbutton = document.querySelector("#message-area-cancel");
    messages = [
        {message:"Hola mamacita",type:"send"},
        {message:"Hola papi",type:"received"},
    ];

    sendbutton.addEventListener("click",function(){
        console.log(textinput.value);
        insertMsg("send",textinput.value,templatenewmsg, messageList);
        // insertBulk(messages, templatenewmsg, templaterecmsg, messageList);
    });
    cancelbutton.addEventListener("click",function(){
        console.log("try to delete content");
    });
});