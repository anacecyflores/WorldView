const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedMoments` array in User.js
const momentSchema = new Schema({
  summary: {
    type: String,
    required: true,
  },
  // WAS saved book id from GoogleBooks
  momentId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  link: {
    type: String,
  },
  header: {
    type: String,
    required: true,
  },
});

module.exports = momentSchema;
