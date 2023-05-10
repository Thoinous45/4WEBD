const express = require("express");
const router = express.Router();
const bouncer = require("express-bouncer")(120000, 1.8e6, 5);

bouncer.blocked = function (req, res, next, remaining) {
  res.send(
    429,
    "Too many requests have been made, " +
      "please wait " +
      remaining / 1000 +
      " seconds"
  );
};

const userCtrl = require("../controllers/user");
const joi = require("../middleware/joi");
const regex = require("../middleware/regex");
const auth=require("../middleware/auth")

//user+admin route

router.post("/signup",joi.userRegister,regex.authValidation, userCtrl.signup);
//bouncer protect from brutforce
router.post("/login",bouncer.block,joi.userLogin, userCtrl.login);
router.delete("/delete/:id",auth,userCtrl.deleteUser)
router.get("/:id",userCtrl.getOne)
router.put("/modify/:id",auth,joi.userModify,regex.pseudoValidation,userCtrl.modifyUser)


//admin route
router.get("", userCtrl.getAll);



module.exports = router;
