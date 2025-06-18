const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const router = require('../src/routes/routes.js');
const conn = require('./config/db.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: 'yourSecretKey', // use a strong secret in production
  resave: false,
  saveUninitialized: false
}));

app.use('/', router);
app.set('view engine', 'ejs');



module.exports = app;