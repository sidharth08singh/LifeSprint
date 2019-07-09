const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Activity Schema
const activitySchema = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "exercises",
    required: true
  },
  userId: {
    // @ToDo : Use Schema.Types.ObjectId here instead of string.
    type: String,
    required: true
  },
  duration: {
    //minutes.
    type: Number
  },
  reps: {
    //number of reps performed, typically under 30.
    type: Number
  },
  weight: {
    //in kilograms.
    type: Number
  },
  distance: {
    //in metres.
    type: Number
  },
  laps: {
    //number of laps, typically for swimming.
    type: Number
  },
  sets: {
    //number of seats when lifting weights.
    type: Number
  },
  date: {
    type: String,
    default: new Date().toDateString()
  }
});

module.exports = Activity = mongoose.model("activities", activitySchema);
