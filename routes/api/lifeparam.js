const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Load Lifeparam Model
const Lifeparam = require("../../models/Lifeparam");

// @route   GET api/lifeparam/test
// @desc    Tests Lifeparam route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Lifeparam works" });
});

// @route   POST api/lifeparam
// @desc    Creates a lifeparam report for today.
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

    const { sleep, officeproductivity, stress } = req.body;

    try {
      // See if lifeparam details have already been added for the day.
      let lifeparam = await Lifeparam.findOne({
        user: req.user.id,
        date: new Date().toDateString()
      });

      if (lifeparam) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Lifeparam details have already been entered for the day. Please edit the same."
            }
          ]
        });
      }

      // Create a new lifeparam object. This autogenerates a new _id for the document to be added to the collection.
      const user = req.user.id; // User ID of the user adding this lifeparam.
      lifeparam = new Lifeparam({
        user,
        sleep,
        officeproductivity,
        stress
      });

      console.log("Lifeparam before being saved : " + lifeparam);

      await lifeparam.save();
      console.log("New lifeparam successfully saved in DB...");
      return res.status(204).json(lifeparam);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/lifeparam/today
// @desc    Get lifeparam details for today
// @access  Private
router.get("/today", auth, async (req, res) => {
  try {
    const today = new Date().toDateString(); // current date in string format as: "Fri May 24 2019"
    // Find lifeparam details for authenticated user for current date.
    let lifeparam = await Lifeparam.find({
      date: today,
      user: req.user.id // req.user.id can be used here because of auth middleware.
    });
    return res.json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lifeparam/date/{date}
// @desc    Get lifeparam details from a specified date
// @access  Private
router.get("/date/:date", auth, async (req, res) => {
  /**
   * The caller should pass the date in string format as "Fri May 24 2019".
   * The date passed in URL would be URL encoded. It must be URL decoded first.
   */
  const givenDate = decodeURI(req.params.date);
  try {
    let lifeparam = await Lifeparam.find({
      date: givenDate,
      user: req.user.id
    });
    return res.json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lifeparam/date/from/:from/to/:to
// @desc    Get lifeparam details for a specified date range. (including from date and including to date)
// @access  Private
router.get("/date/from/:from/to/:to", auth, async (req, res) => {
  const fromDate = decodeURI(req.params.from);
  const toDate = decodeURI(req.params.to);
  try {
    let lifeparam = await Lifeparam.find({
      date: { $lte: toDate, $gte: fromDate },
      user: req.user.id
    });
    return res.json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lifeparam/id/:lifeparamID
// @desc    Get lifeparam details based on lifeparam ID.
// @access  Private
router.get("/id/:lifeparamID", auth, async (req, res) => {
  try {
    let lifeparam = await Lifeparam.findById({
      _id: req.params.lifeparamID
    });
    return res.json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/lifeparam/{lifeparamID}
// @desc    Modify lifeparam based on lifeparam ID
// @access  Private
router.patch("/id/:lifeparamID", auth, async (req, res) => {
  let { sleep, officeproductivity, stress } = req.body;

  try {
    let lifeparam = await Lifeparam.findById({ _id: req.params.lifeparamID });

    // Return 404 if nutrition doesn't exist.
    if (!lifeparam) {
      return res.status(404).json({ errors: [{ msg: "Lifeparam not found" }] });
    }

    if (stress) {
      lifeparam.stress = stress;
    }
    if (officeproductivity) {
      lifeparam.officeproductivity = officeproductivity;
    }
    if (sleep) {
      lifeparam.sleep = sleep;
    }

    await Lifeparam.findOneAndUpdate(
      { _id: req.params.lifeparamID },
      lifeparam,
      {
        upsert: true
      }
    );
    return res.status(200).json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/lifeparam/{lifeparamID}
// @desc    Delete a lifeparam based on lifeparam ID
// @access  Private
router.delete("/id/:lifeparamID", auth, async (req, res) => {
  try {
    // Find the lifeparam by ID.
    let lifeparam = await Lifeparam.findById({
      _id: req.params.lifeparamID
    });

    if (!lifeparam) {
      return res.status(404).json({ errors: [{ msg: "Lifeparam not found" }] });
    }

    await Lifeparam.deleteOne({
      _id: req.params.lifeparamID
    });

    return res.status(200).json(lifeparam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
