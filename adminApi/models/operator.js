const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;

const operatorSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
    
  },
  { timestamps: true }
);


operatorSchema.plugin(uniqueValidator);

module.exports = operatorSchema
