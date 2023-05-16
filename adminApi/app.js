const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const connectionDB = require("./dbAccess");

require("dotenv").config();
  
const app = express();
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/admin", userRoutes);

module.exports = app;
