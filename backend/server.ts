// Imports
import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Task from "./models/task";
import { request } from "node:http";

// Main Variables
const server: Express = express();
const port: number = 3000;
// const MONGO_URI = process.env.MONGO_URI;
// Deconstructed version below
const { MONGO_URI } = process.env;

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
// Cors is cross-browser security
server.use(cors());

// Connection
if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing from the .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to DB\nListening to port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

// Routes
// Index Route (/)
server.get("/", (request, response) => {
  response.send("Server is Live!");
});

// API Data Route
server.get("/data", async (request, response) => {
  try {
    const data = await Task.find(); // Grab all entries from the database
    response.status(200).send(data); // Send the okay response along with the data
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// POST Task Route
server.post("/data", async (request, response) => {
  // Grab the data sent from the frontend via request.body
  const { id, title, checked } = request.body;
  // Create a new task instance and add the id, title, and checked
  const newTask = new Task({
    id,
    title,
    checked,
  });
  try {
    // Wait for it to be saved on the database
    await newTask.save();
    response.status(200).send("Task has been added successfully");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//DELETE Task Route
server.delete("/data/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Task.findOneAndDelete({ id });
    response.status(200).send(`Task with id ${id} has been deleted`);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//PATCH Task Route
server.patch("/data/:id", async (request, response) => {
  const { id } = request.params;
  const { title, checked } = request.body;
  try {
    await Task.findOneAndUpdate({ id }, { title, checked });
    response.status(200).send(`Task with id ${id} has been modified`);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
