const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Load Interest Model
const Interest = require("../../models/Interest");

// @route   GET api/interest/test
// @desc    Tests Interest route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Interest works" });
});

// @route   POST api/interest
// @desc    Creates a interest report for today.
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

    const { write, video, read, cook, travel, social } = req.body;

    try {
      // See if interest details have already been added for the day.
      let interest = await Interest.findOne({
        user: req.user.id,
        date: new Date().toDateString()
      });

      if (interest) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Interest details have already been entered for the day. Please edit the same."
            }
          ]
        });
      }

      // Create a new interest object. This autogenerates a new _id for the document to be added to the collection.
      const user = req.user.id; // User ID of the user adding this interest.
      interest = new Interest({
        user,
        write,
        video,
        read,
        cook,
        travel,
        social
      });

      console.log("Interest before being saved : " + interest);

      await interest.save();
      console.log("New interest successfully saved in DB...");
      return res.status(204).json(interest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/interest/today
// @desc    Get interest details for today
// @access  Private
router.get("/today", auth, async (req, res) => {
  try {
    const today = new Date().toDateString(); // current date in string format as: "Fri May 24 2019"
    // Find interest details for authenticated user for current date.
    let interest = await Interest.findOne({
      date: today,
      user: req.user.id // req.user.id can be used here because of auth middleware.
    });
    return res.json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/interest/date/{date}
// @desc    Get interest details from a specified date
// @access  Private
router.get("/date/:date", auth, async (req, res) => {
  /**
   * The caller should pass the date in string format as "Fri May 24 2019".
   * The date passed in URL would be URL encoded. It must be URL decoded first.
   */
  const givenDate = decodeURI(req.params.date);
  try {
    let interest = await Interest.findOne({
      date: givenDate,
      user: req.user.id
    });
    return res.json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/interest/date/from/:from/to/:to
// @desc    Get interest details for a specified date range. (including from date and including to date)
// @access  Private
router.get("/date/from/:from/to/:to", auth, async (req, res) => {
  const fromDate = decodeURI(req.params.from);
  const toDate = decodeURI(req.params.to);
  try {
    let interest = await Interest.find({
      date: { $lte: toDate, $gte: fromDate },
      user: req.user.id
    });
    return res.json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/interest/id/:interestID
// @desc    Get interest details based on interest ID.
// @access  Private
router.get("/id/:interestID", auth, async (req, res) => {
  try {
    let interest = await Interest.findById({
      _id: req.params.interestID
    });
    return res.json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/interest/{interestID}
// @desc    Modify interest based on interest ID
// @access  Private
router.patch("/id/:interestID", auth, async (req, res) => {
  let { write, video, read, cook, travel, social } = req.body;

  try {
    let interest = await Interest.findById({ _id: req.params.interestID });

    // Return 404 if nutrition doesn't exist.
    if (!interest) {
      return res.status(404).json({ errors: [{ msg: "Interest not found" }] });
    }

    if (typeof write !== "undefined") {
      interest.write = write;
    }
    if (typeof video !== "undefined") {
      interest.video = video;
    }
    if (typeof read !== "undefined") {
      interest.read = read;
    }
    if (typeof cook !== "undefined") {
      interest.cook = cook;
    }
    if (typeof travel !== "undefined") {
      interest.travel = travel;
    }
    if (typeof social !== "undefined") {
      interest.social = social;
    }

    await Interest.findOneAndUpdate({ _id: req.params.interestID }, interest, {
      upsert: true
    });
    return res.status(200).json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/interest/{interestID}
// @desc    Delete a interest based on interest ID
// @access  Private
router.delete("/id/:interestID", auth, async (req, res) => {
  try {
    // Find the interest by ID.
    let interest = await Interest.findById({
      _id: req.params.interestID
    });

    if (!interest) {
      return res.status(404).json({ errors: [{ msg: "Interest not found" }] });
    }

    await Interest.deleteOne({
      _id: req.params.interestID
    });

    return res.status(200).json(interest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
