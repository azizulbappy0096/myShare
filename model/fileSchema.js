const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    fileName: {type: String, required: true},
    filePath: {type: String, required: true},
    fileSize: {type: Number, required: true},
    uuid: {type: String, required: true},
    sender: {type: String, required: false},
    reciever: {type: String, required: false},
}, {timestamps: true} )

module.exports = mongoose.model("file", fileSchema)