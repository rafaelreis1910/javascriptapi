const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose
// // .connect("mongodb://localhost/javascriptnote", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   // useCreateIndex: true, THIS IS NO LONGER SUPPORTED - it's automatically set to true
  // })
  //DEPLOY - change the adress of the database to the actual adress on the cloud   .connect(MONGO_URL, {
  .connect("mongodb://localhost/javascriptnote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Succesful");
  })
  .catch((err) => console.error(err));
