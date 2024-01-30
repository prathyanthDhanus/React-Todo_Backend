const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["complete", "incomplete"],
    default: "incomplete",
    required: true,
  },

  createdAt: {
    type: String,
    required: true,
    index: true,
  },
});

const todo = mongoose.model("todo", todoSchema);
module.exports = todo;
