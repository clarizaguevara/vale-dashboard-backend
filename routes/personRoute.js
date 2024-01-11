const express = require("express")
const morgan = require("morgan")
const path = require("path")
const fs = require("fs")
const personController = require("../controllers/personController")
const {validateToken} = require("../utils")

const router = express.Router()

if (process.env.AUTHENTICATION) {
    router.use(validateToken)
}

router.use((request,response,next) => {
    var wStream = fs.createWriteStream(path.join(request.rootDirName, "log", "serverLog.txt"), {flags: "a"})
    morgan("short", {stream:wStream})
    wStream.close()
    next()
})

router.get("/", personController.getPerson)
router.post("/", personController.addPerson)
router.put("/", personController.updatePerson)
router.delete("/", personController.deletePerson)

module.exports = router