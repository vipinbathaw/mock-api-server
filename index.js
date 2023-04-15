const express = require("express");
const cors = require("cors");

const app = express();
const port = 5050;

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("It works!");
});

app.listen(port, () => {
  console.log(`mock-api listening on port ${port}`);
});
