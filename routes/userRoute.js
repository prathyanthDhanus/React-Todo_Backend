const express = require("express");
const router = express.Router();
const tryCatch = require("../middleware/tryCatch");
const todo = require("../controller/userController")


router

.post("/add/todo/tasks/:id",tryCatch(todo.addTask))
.post("/user/login",tryCatch(todo.userLogin))
.post("/user/register",tryCatch(todo.userRegister))

.get("/get/todo/tasks",tryCatch(todo.getTask))
.get("/get/todo/tasks/:id",tryCatch(todo.getTaskbyId))

.put("/edit/todo/tasks/:id",tryCatch(todo.updateTask))

.delete("/delete/todo/tasks/:id",tryCatch(todo.deleteTask))





module.exports = router;