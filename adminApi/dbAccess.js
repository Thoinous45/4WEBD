const mongoose = require("mongoose");
require("dotenv").config();

const adminDB = mongoose
  .createConnection(process.env.DB_ACCESSAdmin, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((adminConnection) => {
    console.log("Connecté à MongoDB User! 🌿");
    const adminmodel=adminConnection.model('admins', require("./models/admin"));
    module.exports.Admin = adminmodel;
  })
  .catch((err) => console.log(err));


const operatorDB = mongoose
  .createConnection(process.env.DB_ACCESSOperator, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((operatorConnection) => {
    console.log("Connecté à MongoDB Admin! 🌿");
    operatorConnection.model("Operator", require("./models/operator"));
    module.exports.operator = operatorConnection;
  })
  .catch((err) => console.log(err));

const userDB = mongoose
  .createConnection(process.env.DB_ACCESSUser, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((userConnection) => {
    console.log("Connecté à MongoDB Operator! 🌿");
    userConnection.model("User", require("./models/user"));
    module.exports.user = userConnection;
  })
  .catch((err) => console.log(err));
