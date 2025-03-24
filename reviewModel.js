const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema({
  taskprovider: {
    type: String,
    required: true,
  },
  taskworker: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("review", reviewModel);
