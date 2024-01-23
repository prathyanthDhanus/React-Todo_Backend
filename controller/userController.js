const todo = require("../model/todoSchema");
const user = require("../model/userSchema");
const bcrypt = require('bcrypt')

//------------------user register section------------------

const userRegister = async (req, res) => {
 
  const { userName, email, password } = req.body;
  
  const identifyUser = await user.findOne({ email: email });

  if (identifyUser) {
    return res.status(409).json({
      status: "failure",

      message: "User Already Exist",
    });
  }

  //hashing the password
  let hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new user({
    userName: userName,
    email: email,
    password: hashedPassword,
  });

  await newUser.save();
  return res.status(201).json({
    status: "success",

    message: "User Registered Successfully! Please Login",
  });
};

//----------------------------user login section-------------------------

const userLogin = async (req, res) => {
  const { email, password } = req.body;
console.log(req.body);
  const identifyUser = await user.findOne({ email: email });
  console.log(identifyUser);
   // Check if the user exists
   if (!identifyUser) {
    return res.status(404).json({
      status: "failure",
      message: "User not found",
    });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, identifyUser.password);

  if (!passwordMatch) {
    return res.status(401).json({
      status: "failure",
      message: "Wrong Password",
    });
  }

  // User and password are correct
  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
  });
};

//------------------add task------------------------

const addTask = async (req, res) => {
  // Destructure title and description from the request body
  const { title, description } = req.body;

  // Create a new instance of the 'todo' model with the provided title and description
  const newTodo = new todo({
    title: title,
    description: description,
  });

  await newTodo.save();
  res.status(201).json({ message: "Todo saved successfully" });
};

//--------------------get task--------------------------

const getTask = async (req, res) => {
  // Retrieve all tasks from the 'todo' collection in the database
  const data = await todo.find();

  // if (data.length === 0) {
  //   return res.json({
  //     status: "failure",
  //     message: "No task is found",
  //   });
  // }

  // Send a success response with the list of tasks
  return res.status(200).json({
    status: "success",

    message: "List of Tasks",

    data: data,
  });
};

//-------------------------------get task by id-------------------

const getTaskbyId = async (req, res) => {
  // Extract the task ID from the request parameters
  const id = req.params.id;

  //find the task using the id
  const findTask = await todo.findById({ _id: id });

  if (!findTask) {
    return res.json({
      status: "failure",
      
      message: "No task is found",
    });
  }

  res.json({
    status: "success",

    message: "Data fetched successfully",

    data: findTask,
  });
};

//----------------------update-------------------------

const updateTask = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const findTask = await todo.findByIdAndUpdate(id, data, { new: true });

  if (!findTask) {
    return res.json({
      status: "failure",

      message: "No task is found",
    });
  }

  res.json({
    status: "success",

    message: "Updated successfully",

    data: findTask,
  });
};

//---------------------------delete task-------------------------

const deleteTask = async (req, res) => {
  const id = req.params.id;

  const findTask = await todo.findByIdAndDelete(id);
  if (!findTask) {
    return res.json({
      status: "failure",

      message: "No task is found",
    });
  }
  res.json({
    status: "success",

    message: " Deleted successfully",
  });
};

module.exports = { userRegister,userLogin,addTask, getTask, getTaskbyId, updateTask, deleteTask };
