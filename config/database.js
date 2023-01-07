const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(
 "mongodb+srv://rafaelreis100:<rafaelwsd>@javascriptnotes.tg2mep6.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Succesful");
  })
  .catch((err) => console.error(err));
