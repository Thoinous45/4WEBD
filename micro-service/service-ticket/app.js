const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const database = require('./database/db');
const port = 3505;

require("dotenv").config()

const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

database

app.use('/api', ticketRoutes);
console.log("Informations :")
app.listen(port, () => console.log("Listening on port " + port));
module.exports = app;
