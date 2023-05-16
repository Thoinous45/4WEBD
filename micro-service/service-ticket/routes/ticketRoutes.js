const express = require('express');
const ticketController = require("../controllers/ticketController");
const router = express.Router();
const auth = require("../middleware/middleware")

router.post('/tickets', auth, ticketController.createTicket);
router.get('/tickets', auth, ticketController.getAllTickets);
router.get('/tickets/:id', auth, ticketController.getTicketByIdUser);
router.get('/tickets/check/:token', ticketController.checkTicket);

module.exports = router;
