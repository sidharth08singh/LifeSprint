const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Task Schema
const taskSchema = new Schema({
  definition: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  redLine: {
    type: Date,
    required: true
  },
  effort: {
    type: Number,
    required: true
  },
  consequence: {
    type: Enumerator,
    required: true
  },
  category: {
    type: Enumerator,
    required: true
  }
});

module.exports = Task = mongoose.model("task", taskSchema);
