const route = require("express").Router();
const History = require("./History");

route.get("/", (req, res) => {
 History.find()
  .then((history) => {
   res.status(200).json(history);
  })
  .catch((err) => {
   console.log(e);
   res.status(500).send("Error Occured");
  });
});

route.post("/", (req, res) => {
 let history = new History(req.body);
 history
  .save()
  .then(() => History.find())
  .then((history) => {
   res.status(200).json(history);
  })
  .catch((err) => {
   console.log(e);
   res.status(500).send("Error Occured");
  });
});

module.exports = route;
