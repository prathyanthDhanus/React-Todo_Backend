const express = require("express");
const router = express.Router();
const tryCatch = require("../middleware/tryCatch");
const todo = require("../controller/userController")


router

.post("/user/login",tryCatch(todo.userLogin))
.post("/user/register",tryCatch(todo.userRegister))
.post("/add/todo/tasks/:id",tryCatch(todo.addTask))

.get("/get/todo/tasks/:id",tryCatch(todo.getTask))
.get("/get/todo/tasks",tryCatch(todo.getTaskbyId))
.get("/get/todo/category/:id",tryCatch(todo.getCategory))

.put("/edit/todo/tasks/:id",tryCatch(todo.updateTask))
.put("/edit/todo/category/:id",tryCatch(todo.updateCategoryName))

.delete("/delete/todo/tasks/:id",tryCatch(todo.deleteTask))





module.exports = router;