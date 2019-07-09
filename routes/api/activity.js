const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Load Activity Model
const Activity = require("../../models/Activity");

/**
 * Sanity Test Cases:
 * /1/ GET test route.
 * /2/ GET activities today.
 * /3/ GET activities by date.
 * /4/ GET activities by date range.
 * /5/ PATCH activities by id.
 * /6/ CREATE new activity.
 */

// @route   GET api/activities/test
// @desc    Tests activities route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Activities works" });
});

// @route   GET api/activities/today
// @desc    Get all activities for today
// @access  Private
router.get("/today", auth, async (req, res) => {
  try {
    const today = new Date().toDateString(); // current date in string format as: "Fri May 24 2019"
    // Find all activities belonging to the authenticated user for current date.
    let activities = await Activity.find({
      date: today,
      userId: req.user.id // req.user.id can be used here because of auth middleware.
    }).populate("exercise", [
      "name",
      "exercisetype",
      "pmg",
      "exerciseintensity"
    ]);
    // console.log("***" + activities);
    return res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/activities/date/{date}
// @desc    Get all activities from a specified date
// @access  Private
router.get("/date/:date", auth, async (req, res) => {
  /**
   * The caller should pass the date in string format as "Fri May 24 2019".
   * The date passed in URL would be URL encoded. It must be URL decoded first.
   */
  const givenDate = decodeURI(req.params.date);
  try {
    let activities = await Activity.find({
      date: givenDate,
      userId: req.user.id
    }).populate("exercise", [
      "name",
      "exercisetype",
      "pmg",
      "exerciseintensity"
    ]);
    return res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/activities/date/from/:from/to/:to
// @desc    Get all activities for a specified date range. (including from date and including to date)
// @access  Private
router.get("/date/from/:from/to/:to", auth, async (req, res) => {
  const fromDate = decodeURI(req.params.from);
  const toDate = decodeURI(req.params.to);
  try {
    let activities = await Activity.find({
      date: { $lte: toDate, $gte: fromDate },
      userId: req.user.id
    }).populate("exercise", [
      "name",
      "exercisetype",
      "pmg",
      "exerciseintensity"
    ]);
    return res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/activities/{activityID}
// @desc    Modify an activity based on activity ID
// @access  Private
router.patch("/id/:activityId", auth, async (req, res) => {
  let {
    exercise,
    duration,
    reps,
    weight,
    distance,
    laps,
    sets,
    date
  } = req.body;

  console.log(exercise);
  console.log(duration);
  console.log(reps);

  try {
    let activity = await Activity.findById({ _id: req.params.activityId });

    // Return 404 if activity doesn't exist.
    if (!activity) {
      return res.status(404).json({ errors: [{ msg: "Activity not found" }] });
    }

    if (exercise) {
      console.log("entered exercise");
      activity.exercise = exercise;
    }
    if (duration) {
      console.log("entered duration");
      activity.duration = duration;
    }
    if (reps) {
      console.log("entered reps");
      activity.reps = reps;
    }
    if (weight) {
      activity.weight = weight;
    }
    if (distance) {
      activity.distance = distance;
    }
    if (laps) {
      activity.laps = laps;
    }
    if (sets) {
      activity.sets = sets;
    }
    if (date) {
      activity.date = date;
    }

    console.log(activity);

    // await Activity.updateOne(activity);
    await Activity.findOneAndUpdate({ _id: req.params.activityId }, activity, {
      upsert: true
    });
    return res.status(200).json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/activities/{activityID}
// @desc    Delete an activity based on activity ID
// @access  Private
router.delete("/id/:activityId", auth, async (req, res) => {
  try {
    // Find the activity by ID.
    let activity = await Activity.findById({
      _id: req.params.activityId
    });

    if (!activity) {
      return res.status(404).json({ errors: [{ msg: "Activity not found" }] });
    }

    await Activity.deleteOne({
      _id: req.params.activityId
    });

    return res.status(200).json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/activities
// @desc    Creates a new activity
// @access  Private
router.post(
  "/",
  auth,
  [
    //@ToDo - add any input validations here.
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { exercise, duration, reps, weight, distance, laps, sets } = req.body;
    console.log("Before adding new activity");
    console.log(exercise);

    try {
      // See if the same activity (based on exercise) already exists for the day for the logged in user.
      let activity = await Activity.findOne({
        exercise: exercise,
        date: new Date().toDateString(),
        userId: req.user.id
      });

      if (activity) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "An activity with the same exercise has already been entered for the day. Please edit that activity."
            }
          ]
        });
      }

      // Create a new activity object. This autogenerates a new _id for the document to be added to the collection.
      const userId = req.user.id; // User ID of the user adding this activity.
      activity = new Activity({
        exercise,
        userId,
        duration,
        reps,
        weight,
        distance,
        laps,
        sets
      });

      console.log("Activity before being saved : " + activity);

      await activity.save();
      console.log("New activity successfully saved in DB...");
      return res.status(204).json(activity);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
