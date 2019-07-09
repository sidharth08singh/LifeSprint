const express = require("express");
const router = express.Router();

// @route   GET api/task/test
// @desc    Tests task route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Task works" }));

module.exports = router;
