const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Enumerators.
const exerciseTypes = Object.freeze({
  Weight: "weight", // weight lifting.
  Cardio: "cardio", // treadmill, jog outside, kickboxing, cycling, cross-trainer, swimming
  Sport: "sport", //badminton, soccer, cricket etc.
  Yoga: "yoga",
  BodyWeight: "body-weight", //push ups, pull ups etc.
  Trekking: "trekking"
});

const muscleGroups = Object.freeze({
  Bicep: "bicep",
  Tricep: "tricep",
  Shoulder: "shoulder",
  Chest: "chest",
  Forearm: "forearm",
  Quad: "quad",
  Calf: "calf",
  Hamstring: "hamstring",
  Back: "back",
  Core: "core",
  Glutes: "glutes",
  None: "none"
});

const exerciseIntensity = Object.freeze({
  Low: "low",
  Medium: "medium",
  High: "high"
});

// Create Exercise Schema.
const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  exercisetype: {
    type: String,
    required: true,
    enum: Object.values(exerciseTypes),
    lowercase: true
  },
  pmg: {
    type: String,
    required: true,
    enum: Object.values(muscleGroups),
    lowercase: true
  },
  exerciseintensity: {
    type: String,
    required: true,
    enum: Object.values(exerciseIntensity),
    lowercase: true
  }
});

module.exports = Exercise = mongoose.model("exercises", exerciseSchema);
