const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const router = require('../src/routes/routes.js');
const conn = require('./config/db.js');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
  secret: '1111111111',
  resave: false,
  saveUninitialized: false
}));

app.use('/', router);
app.set('view engine', 'ejs');



module.exports = app;