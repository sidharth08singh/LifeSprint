const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Interest Schema.
/**
 * Make a value judgement call while setting in these fields.
 * Writing: Typically intended for blogs/articles/scripts/stories.
 * Video: Typically intended for video editing, or learning about video editing.
 * Reading: Typically intended for reading books, not newspapers/magazines.
 * Cooking: Typically intended for preparing your own meals.
 * Traveling: Typically intended for planned/impromptu vacations/get-aways.
 * Social: Typically intended to guage levels of social interaction.
 */
const interestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: String,
    default: new Date().toDateString()
  },
  write: {
    type: Boolean
  },
  video: {
    type: Boolean
  },
  read: {
    type: Boolean
  },
  cook: {
    type: Boolean
  },
  travel: {
    type: Boolean
  },
  social: {
    type: Boolean
  }
});

module.exports = Interest = mongoose.model("interest", interestSchema);
