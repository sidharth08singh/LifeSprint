const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Enumerators.
const levels = Object.freeze({
  None: "none",
  Low: "low",
  Medium: "medium",
  High: "high"
});

// Create LifeParam Schema.
const lifeParamSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: String,
    default: new Date().toDateString()
  },
  sleep: {
    type: Number,
    required: true
  },
  officeproductivity: {
    type: String,
    required: true,
    enum: Object.values(levels),
    lowercase: true
  },
  stress: {
    type: String,
    required: true,
    enum: Object.values(levels),
    lowercase: true
  }
});

module.exports = LifeParam = mongoose.model("lifeparam", lifeParamSchema);
