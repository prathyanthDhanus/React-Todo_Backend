const todo = require("../model/todoSchema");
const user = require("../model/userSchema");
const bcrypt = require("bcrypt");
const categories = require("../model/categorySchema");

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
  const { title, description, category, createdAt } = req.body;
  const userId = req.params.id;

  // Check if the category exists
  let findCategory = await categories.findOne({ categories: category });

  // If the category doesn't exist, create it
  if (!findCategory) {
    findCategory = await categories.create({
      categories: category,
      userId: userId,
    });
  }

  console.log("findCategory", findCategory);

  // Check if the task already exists for the given date and category
  const findDetails = await todo.findOne({
    userId: userId,
    createdAt: createdAt,
    category: findCategory._id,
    title: title,
  });

  if (findDetails) {
    return res.status(403).json({
      message: "Task already exists for given date and category.",
    });
  }

  // Create a new instance of the 'todo' model with the provided title and description
  const newTodo = new todo({
    userId: userId,
    category: findCategory._id,
    title: title,
    description: description,
    createdAt: createdAt,
  });

  await newTodo.save();
  res.status(201).json({ message: "Todo saved successfully" });
};

//--------------------get task by datewise--------------------------

// const getTask = async (req, res) => {

//   const userId = req.params.id;
//   const { month, year } = req.query;
//   console.log(req.query);

//   // Ensure that month and year are provided in the request
//   // if (!month || !year) {
//   //   return res.status(400).json({
//   //     status: "failure",
//   //     message: "Month and year are required parameters.",
//   //   });
//   // }

//   // Construct a date range for the specified month and year
//   // const startDate = new Date(`${year}-${month}-01T00:00:00Z`);

//   const monthInt = parseInt(month, 10);

//   if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
//     return res.status(400).json({
//       status: "failure",
//       message: "Invalid month provided.",
//     });
//   }

//   const monthFormatted = monthInt.toString().padStart(2, '0');
//   const startDate = new Date(`${year}-${monthFormatted}-01T00:00:00Z`);
//   console.log("strt",startDate);
//   const endDate = new Date(
//     new Date(startDate).setMonth(startDate.getMonth() + 1)
//   );

//   console.log("end",endDate);
//   // Retrieve tasks for the particular user within the specified date range
//   const findTask = await todo.find({
//     userId: userId,
//     createdAt: {
//       $gte: startDate.toISOString(),
//       $lt: endDate.toISOString(),
//     },
//   }).populate("category");
//  if(findTask.length===0){
//   return res.status(404).json({
//     status: "failure",
//     message: "No task found",

//   });
//  }
//   // Send a success response with the list of tasks
//   return res.status(200).json({
//     status: "success",
//     message: "List of Tasks",
//     data: findTask,
//   });
// };

//-------------------------get task by datewise-------------------------

const getTask = async (req, res) => {
  const userId = req.params.id;
  const { month, year, categoryId } = req.query;

  // Ensure that either month and year or categoryId is provided in the request
  if ((!month || !year) && !categoryId) {
    return res.status(400).json({
      status: "failure",
      message: "Month and year OR categoryId is required.",
    });
  }

  // Construct a date range for the specified month and year
  const startDate = constructStartDate(month, year);

  // If categoryId is provided, query based on categoryId; otherwise, query based on userId
  const query = categoryId
    ? {
        category: categoryId,
        createdAt: {
          $gte: startDate.toISOString(),
          $lt: constructEndDate(startDate).toISOString(),
        },
      }
    : {
        userId: userId,
        createdAt: {
          $gte: startDate.toISOString(),
          $lt: constructEndDate(startDate).toISOString(),
        },
      };

 
    // Retrieve tasks based on the constructed query
    const findTask = await todo.find(query).populate("category");

    if (findTask.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No tasks found",
      });
    }

    // Send a success response with the list of tasks
    return res.status(200).json({
      status: "success",
      message: "List of Tasks",
      data: findTask,
    });
 
};

// Helper function to construct the start date for the specified month and year
const constructStartDate = (month, year) => {
  const monthInt = parseInt(month, 10);

  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    throw new Error("Invalid month provided.");
  }

  const monthFormatted = monthInt.toString().padStart(2, "0");
  return new Date(`${year}-${monthFormatted}-01T00:00:00Z`);
};

// Helper function to construct the end date for the specified start date
const constructEndDate = (startDate) => {
  return new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
};

//-----------------------------get task by id--------------------

const getTaskbyId = async (req, res) => {
  // Extract the task ID from the request parameters
  const { taskId } = req.query;
  // console.log(userId);
  //find the task using the id
  const findTask = await todo.findById({ _id: taskId }).populate("category");
  console.log(findTask);
  if (!findTask) {
    return res.status(404).json({
      status: "failure",
      message: "No task is found",
    });
  }

  res.status(200).json({
    status: "success",

    message: "Data fetched successfully",

    data: findTask,
  });
};

//-----------------------update-------------------------

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  
  const data = req.body;
  
  const updatedTask = await todo.findByIdAndUpdate(taskId, data, { new: true });
  
  if (!findTask) {
    return res.status(404).json({
      status: "failure",

      message: "No task found",
    });
  }

   res.status(200).json({
    status: "success",

    message: "Updated successfully",

    data: updatedTask,
  });
};

//---------------------------delete task-------------------------

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  const findTask = await todo.findByIdAndDelete(taskId);
  if (!findTask) {
    return res.status(404).json({
      status: "failure",

      message: "No task is found",
    });
  }
  res.status(200).json({
    status: "success",

    message: " Deleted successfully",
  });
};

//-----------------------get Categories by a Particular User---------------------

const getCategory = async (req, res) => {
  const userId = req.params.id;
  // Find categories for the specified user
  const findCategory = await categories.find({ userId: userId });

  if (findCategory.length === 0) {
    return res.status(404).json({
      status: "failure",

      message: "No category is found.Please create a category",
    });
  }

  res.status(200).json({
    status: "success",

    message: " Category fetched successfully",

    data: findCategory,
  });
};

//-----------------------update category name-------------------

const updateCategoryName = async (req, res) => {
  const categoryId = req.params.id;
  const { category } = req.body;
  console.log(category);

  const updatedCategory = await categories.findByIdAndUpdate(
    categoryId,
    { categories: category },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({
      status: "failure",
      message: "Something went wrong.",
    });
  }

  // Respond with success and the updated category
  res.status(200).json({
    status: "success",
    message: "Category name updated successfully",
    data: updatedCategory,
  });
};

module.exports = {
  userRegister,
  userLogin,
  addTask,
  getTask,
  getTaskbyId,
  updateTask,
  deleteTask,
  getCategory,
  updateCategoryName
};
