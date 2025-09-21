import express from "express";
import mongoose, { mongo } from "mongoose";

const app = express();
const PORT = 7000;

//task schema
const taskSchema = new mongoose.Schema({
  task: String,
  hour: Number,
  type: String,
});

//task model
const Task1 = mongoose.model("Task1", taskSchema);

//generate unique id function

const generateUniqueId = () => {
  let stringGenerator = "abcsefhsfueiu01236585";

  let stringLength = 4;
  let stringValue = "";

  for (let i = 0; i < stringLength; i++) {
    let randomIndex = Math.floor(Math.random() * stringGenerator.length);

    stringValue += stringGenerator[randomIndex];
  }
  return stringValue;
};

//use middleware
//parse the request body
app.use(express.json());

//GET base url
app.get("/", (req, res) => {
  res.send("Hi! this is not to do list API call");
});

//create
app.post("/api/v2/tasks", async (req, res) => {
  //get the data from the client
  let taskObject = req.body;
  const newTask = new Task1(taskObject);
  await newTask.save();

  res.status(201).send({
    status: "Success",
    message: "Task created",
  });
});

//read the data
app.get("/api/v2/tasks", async (req, res) => {
  let query = {};
  if (req.query?.type) {
    query.type = req.query.type;
  }

  let tasks = await Task1.find(query);

  res.status(200).send({
    status: "success",
    message: "Tasks found",
    tasks,
  });
});

//read particular task with id
app.get("/api/v2/tasks/:id", async (req, res) => {
  let taskId = req.params.id;
  let task = await Task1.findOne({ _id: taskId });

  res.status(200).send({
    status: "success",
    message: "Tasks found",
    task,
  });
});

//update
app.patch("/api/v2/tasks/:id", async (req, res) => {
  try {
    let id = req.params.id;

    //type, hour or task
    let updatedObject = req.body;

    let task = await Task1.findByIdAndUpdate(id, updatedObject, { new: true });

    //return response
    res.send({
      status: "success",
      message: "Task Updated",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
});

//Delete functionality
app.delete("/api/v2/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //Delete the task from the database
    let deletedTask = await Task1.findByIdAndDelete(id);

    //return response
    res.status(200).send({
      status: "success",
      message: "Task with id deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Error",
      message: "Server Error",
    });
  }
});
//mongo db connection
mongoose.connect("mongodb://localhost:27017/API").then(() => {
  console.log("connected");
  app.listen(PORT, (error) => {
    if (error) {
      console.log("error before starting");
    } else {
      console.log("Server started at port number:", PORT);
    }
  });
});
