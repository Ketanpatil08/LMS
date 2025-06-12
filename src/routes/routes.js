const express = require("express");
const router = express.Router();
const ctrl = require("../controller/ctrl.js"); // Adjust path if needed

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.get("/userLogin", ctrl.adminDashboardPage);
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);

module.exports = router;

