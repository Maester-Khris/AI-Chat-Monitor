const jwt = require("jsonwebtoken");

let inMemoryDB = [
    { 'id': 1, 'first_name': 'Ginger', 'useruuid': '06aaba2b-482b-4a3a-bd07-beba45097ded' }, 
    { 'id': 2, 'first_name': 'Jack', 'useruuid': '8fa4fd97-3d5d-4407-929b-1ce16a8dac9c' }, 
    { 'id': 3, 'first_name': 'Kailey', 'useruuid': 'fe947a05-cf44-4571-9528-bf049aad854e' }, 
    { 'id': 4, 'first_name': 'Aleece', 'useruuid': '00d0ef87-1b14-4c6b-9444-b25354d8689c' }, 
    { 'id': 5, 'first_name': 'Rutledge', 'useruuid': '068bc316-afd1-4235-be51-831faedd6753' }, 
    { 'id': 6, 'first_name': 'Toddy', 'useruuid': 'b2d4bafa-2f67-47c7-b3a5-4200d7c52a48' }, 
    { 'id': 7, 'first_name': 'Collin', 'useruuid': 'dc00e9f4-fdac-4184-98ae-ac7052f3c733' }, 
    { 'id': 8, 'first_name': 'Elyssa', 'useruuid': 'd252bbd7-91b0-49d1-bf19-05e08e9ba2f0' }, 
    { 'id': 9, 'first_name': 'Pace', 'useruuid': '2ad8defc-1349-49af-a1e9-61d3c425565d' }, 
    { 'id': 10, 'first_name': 'Valry', 'useruuid': '8133e340-3cfb-450d-a779-a2ba782b387b' }
];

const decodeJwtToken = (token) => {
    let decoded = jwt.decode(token);
    // let decoded = {name:"sandjey", useruuid:"2ad8defc-1349-49af-a1e9-61d3c425565d"};
    return decoded;
}

module.exports = { inMemoryDB, decodeJwtToken }