import mongoose from "mongoose";
const Schema = mongoose.Schema; // Create a new schema instance
const taskSchema = new Schema({
  // Create a custom schema for task
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Task", taskSchema, "task"); // Export the schema as a model
