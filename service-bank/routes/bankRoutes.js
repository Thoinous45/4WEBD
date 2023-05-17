const express = require('express');
const bankController = require("../controllers/bankController");
const router = express.Router();
const auth = require("../middleware/middleware")

router.post('/payment', auth, bankController.makePayment);

module.exports = router;
