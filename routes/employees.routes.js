var express = require("express")
const morgan = require("morgan")
const path = require("path")
const fs = require("fs")
var empController = require("../controllers/empController")
const {validateToken} = require("../utils")

var router = express.Router()

router.use(validateToken)

router.use((request,response,next) => {
    var wStream = fs.createWriteStream(path.join(request.rootDirName, "log", "serverLog.txt"), {flags: "a"})
    morgan("short", {stream:wStream})
    wStream.close()
    next()
})

// /employees
router.get("/", empController.getAll)
router.get("/:empId", empController.getEmployee)
router.post("/", empController.addEmployee)
router.put("/:empId", empController.updateEmployee)
router.delete("/:empId", empController.deleteEmployee)

module.exports = router