const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categories:{
        type:String,
        required:true,
        unique:true
    },
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
})

const Category = mongoose.model('Category',categorySchema);
module.exports = Category;