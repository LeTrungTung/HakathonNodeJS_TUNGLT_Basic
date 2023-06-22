const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.route");

// app.use(bodyParse());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(bodyParser.json());
// app.use(xpress.static("public"));

app.get("/", (req, res) => {
  res.status(200).send("Hello Basic Exercise");
});

//api router
app.use("/api/basic", userRouter);

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
