const { Schema } = require("mongoose");

const eventsSchema = new Schema({
  date: [
    {
      type: String,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  // saved id
  eventId: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  link: {
    type: String,
  },
  header: {
    type: String,
    required: true,
  },
});

module.exports = eventsSchema;
