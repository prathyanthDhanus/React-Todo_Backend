const todo = require("../model/todoSchema");

//------------------add task------------------------

const addTask = async (req, res) => {
  const { title, description } = req.body;

  const newTodo = new todo({
    title: title,
    description: description,
  });

  await newTodo.save();
  res.status(201).json({ message: "Todo saved successfully" });
};

//--------------------get task--------------------------

const getTask = async (req, res) => {
  const data = await todo.find();

  // if (data.length === 0) {
  //   return res.json({
  //     status: "failure",
  //     message: "No task is found",
  //   });
  // }

  return res.status(200).json({
    status: "success",

    message: "List of Tasks",

    data: data,
  });
};

//-------------------------------get task by id-------------------

const getTaskbyId = async (req, res) => {
  const id = req.params.id;
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

module.exports = { addTask, getTask, getTaskbyId, updateTask, deleteTask };
