const express = require("express")
const router = express.Router()
const utils = require('../utils')

router.get('/data',(req, res)=>{
    res.json(utils.inMemoryDB)
})
router.get("/post-data", (req,res)=>{
    res.render("form", { csrfToken: req.csrfToken()})
})
router.post("/post-data", async (req,res)=>{
    const {user_name, user_message} = req.body
    res.status(200).json({"result":"message well received"})
})

module.exports = router;