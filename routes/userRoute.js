const express = require("express");
const router = express.Router();
const tryCatch = require("../middleware/tryCatch");
const todo = require("../controller/userController")


router.post("/add/todo/tasks",tryCatch(todo.addTask));
router.post("/user/login",tryCatch(todo.userLogin));
router.post("/user/register",tryCatch(todo.userRegister));

router.get("/get/todo/tasks",tryCatch(todo.getTask));
router.get("/get/todo/tasks/:id",tryCatch(todo.getTaskbyId));

router.put("/edit/todo/tasks/:id",tryCatch(todo.updateTask));

router.delete("/delete/todo/tasks/:id",tryCatch(todo.deleteTask));





module.exports = router;