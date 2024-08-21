const router = require("express").Router()

router.get("/", (req, res)=>{
    res.send("todos")
})

module.exports = router