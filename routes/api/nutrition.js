const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Load Nutrition Model
const Nutrition = require("../../models/Nutrition");

// @route   GET api/nutrition/test
// @desc    Tests Nutrition route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Nutrition works" });
});

// @route   POST api/nutrition
// @desc    Creates a nutrition report for today.
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

    const {
      proteinIntake,
      fruitIntake,
      greenIntake,
      sugarIntake,
      junkIntake,
      waterIntake,
      tobaccoIntake,
      alcoholIntake,
      potIntake
    } = req.body;

    try {
      // See if nutrition details have already been added for the day.
      let nutrition = await Nutrition.findOne({
        user: req.user.id,
        date: new Date().toDateString()
      });

      if (nutrition) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Nutrition details have already been entered for the day. Please edit the same."
            }
          ]
        });
      }

      // Create a new nutrition object. This autogenerates a new _id for the document to be added to the collection.
      const user = req.user.id; // User ID of the user adding this nutrition.
      nutrition = new Nutrition({
        user,
        proteinIntake,
        fruitIntake,
        greenIntake,
        sugarIntake,
        junkIntake,
        waterIntake,
        tobaccoIntake,
        alcoholIntake,
        potIntake
      });

      console.log("Nutrition before being saved : " + nutrition);

      await nutrition.save();
      console.log("New nutrition successfully saved in DB...");
      return res.status(204).json(nutrition);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/nutrition/today
// @desc    Get  nutrition details for today
// @access  Private
router.get("/today", auth, async (req, res) => {
  try {
    const today = new Date().toDateString(); // current date in string format as: "Fri May 24 2019"
    // Find nutrition details for authenticated user for current date.
    let nutrition = await Nutrition.findOne({
      date: today,
      user: req.user.id // req.user.id can be used here because of auth middleware.
    });
    return res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/nutrition/date/{date}
// @desc    Get nutrition details from a specified date
// @access  Private
router.get("/date/:date", auth, async (req, res) => {
  /**
   * The caller should pass the date in string format as "Fri May 24 2019".
   * The date passed in URL would be URL encoded. It must be URL decoded first.
   */
  const givenDate = decodeURI(req.params.date);
  try {
    let nutrition = await Nutrition.findOne({
      date: givenDate,
      user: req.user.id
    });
    return res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/nutrition/date/from/:from/to/:to
// @desc    Get nutrition details for a specified date range. (including from date and including to date)
// @access  Private
router.get("/date/from/:from/to/:to", auth, async (req, res) => {
  const fromDate = decodeURI(req.params.from);
  const toDate = decodeURI(req.params.to);
  try {
    let nutrition = await Nutrition.find({
      date: { $lte: toDate, $gte: fromDate },
      user: req.user.id
    });
    return res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/nutrition/id/:nutritionID
// @desc    Get nutrition details based on nutrition ID.
// @access  Private
router.get("/id/:nutritionID", auth, async (req, res) => {
  try {
    let nutrition = await Nutrition.findById({
      _id: req.params.nutritionID
    });
    return res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/nutrition/{nutritionID}
// @desc    Modify nutrition based on nutrition ID
// @access  Private
router.patch("/id/:nutritionID", auth, async (req, res) => {
  let {
    proteinIntake,
    fruitIntake,
    greenIntake,
    sugarIntake,
    junkIntake,
    waterIntake,
    tobaccoIntake,
    alcoholIntake,
    potIntake
  } = req.body;

  try {
    let nutrition = await Nutrition.findById({ _id: req.params.nutritionID });

    // Return 404 if nutrition doesn't exist.
    if (!nutrition) {
      return res.status(404).json({ errors: [{ msg: "Nutrition not found" }] });
    }

    if (proteinIntake) {
      nutrition.proteinIntake = proteinIntake;
    }
    if (fruitIntake) {
      nutrition.fruitIntake = fruitIntake;
    }
    if (greenIntake) {
      nutrition.greenIntake = greenIntake;
    }
    if (sugarIntake) {
      nutrition.sugarIntake = sugarIntake;
    }
    if (junkIntake) {
      nutrition.junkIntake = junkIntake;
    }
    if (waterIntake) {
      nutrition.waterIntake = waterIntake;
    }
    if (tobaccoIntake) {
      nutrition.tobaccoIntake = tobaccoIntake;
    }
    if (alcoholIntake) {
      nutrition.alcoholIntake = alcoholIntake;
    }
    if (potIntake) {
      nutrition.potIntake = potIntake;
    }

    await Nutrition.findOneAndUpdate(
      { _id: req.params.nutritionID },
      nutrition,
      {
        upsert: true
      }
    );
    return res.status(200).json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/nutrition/{nutritionID}
// @desc    Delete a nutrition based on nutrition ID
// @access  Private
router.delete("/id/:nutritionID", auth, async (req, res) => {
  try {
    // Find the activity by ID.
    let nutrition = await Nutrition.findById({
      _id: req.params.nutritionID
    });

    if (!nutrition) {
      return res.status(404).json({ errors: [{ msg: "Nutrition not found" }] });
    }

    await Nutrition.deleteOne({
      _id: req.params.nutritionID
    });

    return res.status(200).json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
