const express = require("express");
const router = express.Router();

// @route   GET api/goal/test
// @desc    Tests goal route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Goal works" }));

module.exports = router;
