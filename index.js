const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 2023;
const mongoDB =
 "mongodb+srv://user:user@weatherstream.1fsrsij.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(cors());

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/history", require("./api/Route"));

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
 const db = async () => {
  try {
   await mongoose.connect(mongoDB, { useNewUrlParser: true });
   console.log("Connected to MongoDB");
  } catch (error) {
   console.log(error);
  }
 };
 db();
});
