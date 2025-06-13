const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ctrl.js");

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.post("/userLogin", ctrl.userLogin); // handles admin login with credentials
router.get("/userLogin", ctrl.adminDashboardPage); // renders dashboard after login
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUser", ctrl.viewUserPage); // you must define this in ctrl.js

module.exports = router;
