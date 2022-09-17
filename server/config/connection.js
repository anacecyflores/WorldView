const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI ||
    'mongodb+srv://FinalProject:northwestern@worldview.hf9necs.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
