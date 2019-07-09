const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const task = require("./routes/api/task");
const goal = require("./routes/api/goal");
const auth = require("./routes/api/auth");
const exercises = require("./routes/api/exercises");
const activities = require("./routes/api/activity");
const rating = require("./routes/api/rating");
const nutrition = require("./routes/api/nutrition");
const interest = require("./routes/api/interest");
const lifeparam = require("./routes/api/lifeparam");

const connectDB = require("./config/db");

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

// Connect DB
connectDB();

app.get("/", (req, res) => res.send("Hello!"));

// Use Routes
app.use("/api/users", users);
app.use("/api/exercises", exercises);
app.use("/api/activities", activities);
app.use("/api/rating", rating);
app.use("/api/nutrition", nutrition);
app.use("/api/lifeparam", lifeparam);
app.use("/api/interest", interest);
app.use("/api/task", task);
app.use("/api/goal", goal);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
