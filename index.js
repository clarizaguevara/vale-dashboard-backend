require("dotenv").config()
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const fs = require("fs")
const cors = require('cors')

const employeesRouter = require("./routes/employees.routes")

const port = 3000

var wStream = fs.createWriteStream(path.join(__dirname,"log", "serverLog.txt"), {flags:"a"})

var app = express()

app.use(morgan("combined", {stream:wStream}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((request, response, next) => {
    request.rootDirName = __dirname
    next()
})

app.use(cors())

app.use("/employees", employeesRouter)

app.listen(port, () => {
    console.log(`Server started at port : ${port}`)
})

module.exports = app