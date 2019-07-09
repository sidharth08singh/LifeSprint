const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Load Exercise Model
const Exercise = require("../../models/Exercise");

/**
 * Run manual tests for APIs until integration tests are implemented.
 * Integration Tests - Best option to implement in Java using Rest Assured.
 * 1) Create new exercise - valid.
 * 2) Create new exercise - invalid.
 * 3) Get exercise by name.
 * 4) Get exercise by id.
 * 5) Get all exercises.
 * 6) Patch exercise by id.
 * 7) Get exercise by id.
 * 8) Delete exercise by id.
 */

// @route   GET api/exercises/test
// @desc    Tests exercises route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Exercises works" });
});

// @route   POST api/exercises
// @desc    Creates a new exercise.
// @access  Private.
router.post(
  "/",
  auth,
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("exercisetype", "Exercise type is required")
      .not()
      .isEmpty(),
    check("pmg", "Primary muscle group is required")
      .not()
      .isEmpty(),
    check("exerciseintensity", "Exercise intensity is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, exercisetype, pmg, exerciseintensity } = req.body;

    try {
      // See if exercise already exists.
      let exercise = await Exercise.findOne({ name });

      if (exercise) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Exercise already exists" }] });
      }

      // Create a new exercise object. This autogenerates a new _id for the document to be added to the collection.
      exercise = new Exercise({
        name,
        exercisetype,
        pmg,
        exerciseintensity
      });

      await exercise.save();
      console.log("New exercise successfully saved in DB.\n" + exercise);
      return res.status(200).json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/exercises
// @desc    Get all exercises.
// @access  Public.
router.get("/", async (req, res) => {
  try {
    let exercises = await Exercise.find();
    return res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/exercises/name/{name}
// @desc    Get an exercise based on name.
// @access  Public.
router.get("/name/:name", async (req, res) => {
  try {
    // Find the exercise by name
    let exercise = await Exercise.findOne({
      name: req.params.name
    });

    // Return 404 if exercise doesn't exist.
    if (!exercise) {
      return res.status(404).json({ errors: [{ msg: "Exercise not found" }] });
    }

    return res.status(200).json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/exercises/id/{id}
// @desc    Get an exercise based on id.
// @access  Public.
router.get("/id/:id", async (req, res) => {
  try {
    // Find the exercise by ID.
    let exercise = await Exercise.findById({
      _id: req.params.id
    });

    // Return 404 if exercise doesn't exist.
    if (!exercise) {
      return res.status(404).json({ errors: [{ msg: "Exercise not found" }] });
    }

    return res.status(200).json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/exercises/type/{exerciseType}
// @desc    Get an exercise based on exerciseType.
// @access  Public.
router.get("/type/:exerciseType", async (req, res) => {
  try {
    // const x = Exercise.exerciseTypes;
    // console.log(exerciseTypeEnum);
    // @ToDo - how to validate against enums here.
    let exercises = await Exercise.find({
      exercisetype: req.params.exerciseType
    });
    return res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/exercises/pmg/{pmg}
// @desc    Get an exercise based on pmg.
// @access  Public.
router.get("/pmg/:pmg", async (req, res) => {
  try {
    let exercises = await Exercise.find({
      pmg: req.params.pmg
    });
    return res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/exercises/intensity/{exerciseIntensity}
// @desc    Get an exercise based on exerciseIntensity.
// @access  Public.
router.get("/intensity/:exerciseIntensity", async (req, res) => {
  try {
    let exercises = await Exercise.find({
      exerciseintensity: req.params.exerciseIntensity
    });
    return res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/exercises/id/{id}
// @desc    Modify an exercise based on id.
// @access  Private.
router.patch("/id/:id", auth, async (req, res) => {
  let { name, exercisetype, pmg, exerciseintensity } = req.body;
  try {
    // Find the exercise by ID.
    let exercise = await Exercise.findById({
      _id: req.params.id
    });

    // Return 404 if exercise doesn't exist.
    if (!exercise) {
      return res.status(404).json({ errors: [{ msg: "Exercise not found" }] });
    }

    if (name) {
      console.log("Reached Here 1");
      exercise.name = name;
    }
    if (exercisetype) {
      console.log("Reached Here 2");
      exercise.exercisetype = exercisetype;
    }
    if (pmg) {
      console.log("Reached Here 3");
      exercise.pmg = pmg;
    }
    if (exerciseintensity) {
      console.log("Reached Here 4");
      exercise.exerciseintensity = exerciseintensity;
    }

    console.log(exercise);

    await Exercise.findOneAndUpdate({ _id: req.params.id }, exercise, {
      upsert: true
    });
    return res.status(200).json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/exercises/id/{id}
// @desc    Delete an exercise based on id.
// @access  Private.
router.delete("/id/:id", auth, async (req, res) => {
  try {
    // Find the exercise by ID.
    let exercise = await Exercise.findById({
      _id: req.params.id
    });

    if (!exercise) {
      return res.status(404).json({ errors: [{ msg: "Exercise not found" }] });
    }

    await Exercise.deleteOne({
      _id: req.params.id
    });

    return res.status(200).json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/exercises/all
// @desc    Delete all exercises. (!!!! EXPERIMENTAL - only for testing phase).
// @access  Private.
router.delete("/all", auth, async (req, res) => {
  try {
    //@ToDo.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
