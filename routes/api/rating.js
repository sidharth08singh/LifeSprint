const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const HashMap = require("hashmap");

// Load Models
const Activity = require("../../models/Activity");

// @route   GET api/ratings/test
// @desc    Tests ratings route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Rating works" });
});

// @route   GET api/rating/activity/today
// @desc    Get activity rating for today
// @access  Private
router.get("/activity/today", auth, async (req, res) => {
  let points = 0;
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

    /**
     Consideration 1: Number of activities performed on that day. (weightage: 40%)
        1)	if (#(activities) = 0) : You get 0 points.
        2)	if (1 <= #(activities) <=4) : You get 10 points.
        3)	if (5 <= #(activities) <=8) : You get 20 points.
        4)  if (9 <= #(activities) <=12) : You get 30 points.
        5)	if (#(activities) > 12) : You get 40 points.
     */
    const numberOfActivities = activities.length;
    console.log("Number of activities performed today :" + numberOfActivities);

    if (numberOfActivities == 0) {
      points = points + 0;
    } else if (numberOfActivities >= 1 && numberOfActivities <= 4) {
      points = points + 10;
    } else if (numberOfActivities >= 5 && numberOfActivities <= 8) {
      points = points + 20;
    } else if (numberOfActivities >= 9 && numberOfActivities <= 12) {
      points = points + 30;
    } else {
      points = points + 40;
    }

    console.log(
      "Number of points so far based on number of activities alone :" + points
    );

    /*
    Consideration 2: Intensity of activities. (weightage: 30%) 
        Pre-req: Only applies if you have atleast 5 activities for the day. Else, you get 0 points for this category. 
        1) if #HighIntensityExercises >= 10 : You get 30 points. 
        2) if #HighIntensityExercises + #mediumIntensityExercises >=10 : You get 20 points. 
        3) else - you get 10 points. 
    */

    if (numberOfActivities >= 5) {
      var intensityMap = new HashMap();
      intensityMap.set("low", 0);
      intensityMap.set("medium", 0);
      intensityMap.set("high", 0);

      activities.forEach(function(activity) {
        var exerciseIntensity = activity.exercise.exerciseintensity;
        console.log("Exercise Intensity found :" + exerciseIntensity);
        intensityMap.set(
          exerciseIntensity,
          intensityMap.get(exerciseIntensity) + 1
        );
      });

      if (intensityMap.get("high") >= 10) {
        points = points + 30;
      } else if (intensityMap.get("medium") + intensityMap.get("high") >= 10) {
        points = points + 20;
      } else {
        points = points + 10;
      }
      console.log(
        "Number of point so far after factoring in exercise intensity as well :" +
          points
      );
    } else {
      console.log(
        "Number of activities is less than 5. You get 0 points for exercise intensity category"
      );
    }

    /**
    Consideration 3: A varied range of activities. (weightage: 30%) 
        1.	if #uniqueExerciseTypes is 1: You get 5 points. 
        2.	if #uniqueExerciseTypes is 2 : You get 10 points. 
        3.	if #uniqueExerciseTypes is 3 : You get 20 points. 
        4.	If #uniqueExerciseTypes > 3 : You get 30 points. 
    */

    var exerciseTypeMap = new HashMap();
    exerciseTypeMap.set("weight", 0);
    exerciseTypeMap.set("cardio", 0);
    exerciseTypeMap.set("sport", 0);
    exerciseTypeMap.set("yoga", 0);
    exerciseTypeMap.set("body-weight", 0);

    var numberOfTypesOfActivities = 0;
    activities.forEach(function(activity) {
      var exerciseType = activity.exercise.exercisetype;
      if (exerciseTypeMap.get(exerciseType) == 0) {
        numberOfTypesOfActivities++;
        exerciseTypeMap.set(
          exerciseType,
          exerciseTypeMap.get(exerciseType) + 1
        );
      } else {
        // do nothing.
      }
    });

    console.log("Number of types of activities :" + numberOfTypesOfActivities);

    if (numberOfTypesOfActivities == 0) {
      // Do nothing.
    } else if (numberOfTypesOfActivities == 1) {
      points = points + 5;
    } else if (numberOfTypesOfActivities == 2) {
      points = points + 10;
    } else if (numberOfTypesOfActivities == 3) {
      points = points + 20;
    } else {
      points = points + 30;
    }

    console.log(
      "Total number of points after factoring in all 3 considerations :" +
        points
    );

    /**
    Compute Final Rating. 
    1.	Total points = 0, Rating = None
    2.	Total points is in [1, 30), Rating = Low
    3.	Total points is in [30, 75), Rating = Medium
    4.	Total points is equal to or above 75, Rating = High
    */

    var rating;
    if (points == 0) {
      rating = "none";
    } else if (points >= 1 && points < 30) {
      rating = "low";
    } else if (points >= 30 && points < 75) {
      rating = "medium";
    } else {
      rating = "high";
    }

    return res.json({ points: points, rating: rating });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
