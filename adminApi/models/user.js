const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    pseudo : {type:String , required :true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
    
  },
  { timestamps: true }
);


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
