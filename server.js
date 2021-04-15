// import modules
require("dotenv").config()
const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cors = require("cors")
const events = require("events")

// init
const app = express()
// const server = http.createServer(app)
const port = process.env.PORT

// schedule
const delFiles = require("./scheduleDel")

// connect DB
mongoose.connect(process.env.MONGOOSE__URL, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

// event emitter
const eventEmitter = new events()

// static
app.use(express.static("public"))

// set
app.set("eventEmitter", eventEmitter)

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use("/api", require("./routes/file"))

// -----------------
delFiles()

// listen
app.listen(port, () => {
    console.log("Server is running on PORT:" + port)
})




