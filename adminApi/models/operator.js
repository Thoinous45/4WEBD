const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const operatorSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
  },
  { timestamps: true }
);


operatorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Operator", operatorSchema);