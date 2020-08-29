const express = require("express");
const bodyParser = require("body-parser");
const sessionRoute = require("./routes/session-route");
const statementRoute = require("./routes/statement-route");
const mongoose = require("mongoose");

const connectUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.slxab.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PATCH,DELETE");
  next();
});

app.use("/api/sessions", sessionRoute);
app.use("/api/statements", statementRoute);

app.use((error, req, res, next) => {
  // console.log(res.headerSent);
  // console.log(error);
  if (res.headerSent) {
    return next(error);
  } else {
    // console.log(error);
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured" });
    // res.status(500);
    // res.json({ message: "An unknown error occured" });
  }
  // return next(error);
});

mongoose
  .connect(connectUrl, connectConfig)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
