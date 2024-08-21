const router = require("express").Router()

router.get("/", (req, res)=>{
    res.send("refersh tokens")
})

module.exports = router