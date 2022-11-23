// Connection a la BDD
var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect("monloginMongoose", options, function (err) {
  if (err) console.log(err);
  else console.log("Connection Etablished");
});
