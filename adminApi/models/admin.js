const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var schema = mongoose.Schema;
const adminSchema = new schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
    
  },
  { timestamps: true }
);


module.exports = adminSchema
