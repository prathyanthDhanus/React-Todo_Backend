const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    status:{
        type:String,
        enum:['complete','incomplete'],
        default:"incomplete",
    },
})
const todo = mongoose.model("todo", todoSchema)
module.exports = todo