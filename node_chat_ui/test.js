const crypto = require("crypto")


// ==================== Map testing =====================
// let mymap = new Map();
// mymap.set(roomuuid, servermessages);

// console.log(mymap);
// console.log(mymap.size);

//console.log("nb stored items", Array.of(mymap.get(roomuuid))[0].length)
// console.log("nb stored items", mymap.get(roomuuid).length)
// if(mymap.has(roomuuid)){
//     console.log("present")
// }

//update element inside 
//mymap.set(roomuuid, ["je te dis","hola"])

//for whatever purpose, to get the whole content of the map you iterate
// mymap.forEach((value, key)=>{
//     console.log(`for the key ${key}, the value is ${value.toString()}`);
// })

//particular search for an element inside the list of message and update it
// let m = messages.filter(m => m.sender == "Nata");
// console.log(messages.indexOf(m));
// console.log(messages[messages.indexOf(m)]);
// console.log("=========================")
// console.log(m);



// ========== client side operation 2/2 ✅ ==========
// data init
// let messages = [
//     {"sender":"Marlin","receiver":"Arturo","body":"Cras pellentesque volutpat dui.","tag":false,"date":"2024-05-04"},
//     {"sender":"Tisha","receiver":"Bev","body":"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.","tag":true,"date":"2024-03-04"},
// ];
// messages.map(m => {m.uuid = crypto.randomUUID() })
// console.log(messages);
// - insert new item 
// console.log("================= test insert ==========")
// let newmes = {"sender":"Bary","receiver":"Anitra","body":"Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque.","tag":false,"date":"2024-07-15"};
// messages.push(newmes);
// console.log(messages);
//update an item
// console.log("================= test update ==========")
// let tishamsguuid = "6de81e3d-7237-4536-8756-2bd503097b62";
// messages.filter(m => m.uuid == tishamsguuid).map(m => m.tag = true);
// console.log(messages);


// =========== server side operation 2/2 ✅ =================
// data init
let roomuuid = crypto.randomUUID();
let servermessages = [
    {"sender":"Marlin","receiver":"Arturo","body":"Cras pellentesque volutpat dui.","tag":false,"date":"2024-05-04"},
    {"sender":"Tisha","receiver":"Bev","body":"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.","tag":true,"date":"2024-03-04"},
];
servermessages.map(m =>{ m.uuid = crypto.randomUUID() })
let sessionstore = new Map();
sessionstore.set(roomuuid, servermessages);
console.log(sessionstore);
// console.log("================= test insert ==========")
let newmes = {"sender":"Bary","receiver":"Anitra","body":"Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque.","tag":false,"date":"2024-07-15"};
newmes.uuid = crypto.randomUUID();
console.log(newmes);
let conv = sessionstore.get(roomuuid);
conv.push(newmes);
sessionstore.set(roomuuid,conv);
console.log(sessionstore);
// console.log("================= test update ==========")
let conv1 = sessionstore.get(roomuuid);
conv1 = conv1.map((m) =>{
    if(conv1.indexOf(m) == 2){
        m.tag = true;
    }
    return m;
})
console.log(conv1);
let barryuud = "5856ce65-2c03-4218-8eb8-1abaf09f1ce3";
//conv1 = conv1.filter(m => m.uuid == barryuud).map(m => m.tag = 1);
sessionstore.set(roomuuid,conv1)
console.log(sessionstore);