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

//admin route

router.post("/signup",joi.userRegister,regex.authValidation, userCtrl.createAdmin);
router.post("/createOperator",regex.authValidation, userCtrl.createOperator);
//bouncer protect from brutforce
router.post("/login",bouncer.block,joi.userLogin, userCtrl.login);
router.put("/update/:id",auth,userCtrl.modifyAdmin)

router.get("/:id",userCtrl.getOneAdmin)
router.get("/operator/:id",userCtrl.getOneOperator)
router.get("/user/:id",userCtrl.getOneUser)
router.get("/admin", userCtrl.getAllAdmin);
router.get("/operator", userCtrl.getAllOperator);
router.get("/user", userCtrl.getAllUser);
router.delete("/operator",userCtrl.deleteOperator)



module.exports = router;
