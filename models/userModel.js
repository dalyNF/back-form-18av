var mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  lastName: String,
  email: String,
  phoneNumber: Number,
  userResearch: {
    transactionType: String,
    location: {
      area1: String,
      area2: String,
      area3: String,
      area4: String,
      area5: String,
      area6: String,
    },
    numberOfRoom: String,
    surface: String,
    maxBudget: Number,
    sellForecast: String,
  },
  creationDate: { type: Date, default: Date.now },
});

var userModel = mongoose.model("users", userSchema);

module.exports = userModel;
