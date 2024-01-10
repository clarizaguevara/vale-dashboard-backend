require("dotenv").config()
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const fs = require("fs")
const cors = require('cors')

const recordsRouter = require("./routes/recordsRoute")
const personRouter = require("./routes/personRoute")
const locationRouter = require("./routes/locationRoute")
const {generateAccessToken} = require("./utils")

const port = process.env.PORT || 3000

const wStream = fs.createWriteStream(path.join(__dirname,"log", "serverLog.txt"), {flags:"a"})

const app = express()

app.use(morgan("combined", {stream:wStream}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((request, response, next) => {
    request.rootDirName = __dirname
    next()
})

app.use(cors())

app.use("/records", recordsRouter)
app.use("/person", personRouter)
app.use("/location", locationRouter)
app.get("/token", generateAccessToken)

app.listen(port, () => {
    console.log(`Server started at port : ${port}`)
})

module.exports = app