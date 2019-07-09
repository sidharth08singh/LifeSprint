const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Goal Schema
const goalSchema = new Schema({
  aspiration: {
    type: String,
    required: true
  },
  aspiredAt: {
    type: Date,
    required: true
  },
  milestones: {
    type: Date,
    required: true
  },
  redLine: {
    type: Date,
    required: true
  },
  category: {
    type: Enumerator,
    required: true
  }
});

module.exports = Goal = mongoose.model("goals", goalSchema);
