const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Enumerators.
const intakeLevels = Object.freeze({
  None: "none",
  Low: "low",
  Medium: "medium",
  High: "high"
});

// Create Nutrition Schema.
const nutritionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: String,
    default: new Date().toDateString()
  },
  proteinIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  fruitIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  greenIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  sugarIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  junkIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  waterIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  tobaccoIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  alcoholIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  },
  potIntake: {
    type: String,
    required: true,
    enum: Object.values(intakeLevels),
    lowercase: true
  }
});

module.exports = Nutrition = mongoose.model("nutrition", nutritionSchema);
