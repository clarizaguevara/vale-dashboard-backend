const express = require("express")
const morgan = require("morgan")
const path = require("path")
const fs = require("fs")
const recordsController = require("../controllers/recordsController")
const {validateToken} = require("../utils")

const router = express.Router()

if (process.env.AUTHENTICATION === true) {
    router.use(validateToken)
}

if (process.env.LOG === true) {
    router.use((request,response,next) => {
        var wStream = fs.createWriteStream(path.join(request.rootDirName, "log", "serverLog.txt"), {flags: "a"})
        morgan("short", {stream:wStream})
        wStream.close()
        next()
    })
}

router.get("/", recordsController.getRecord)
router.post("/", recordsController.addRecord)

module.exports = router