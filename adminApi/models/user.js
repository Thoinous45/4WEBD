const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname : {type:String , required :true},
    lastname : {type:String , required :true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
  },
  { timestamps: true }
);


userSchema.plugin(uniqueValidator);

module.exports = userSchema
