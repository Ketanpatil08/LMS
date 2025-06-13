const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ctrl.js"); // Adjust path if needed

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.post("/userLogin", ctrl.adminDashboardPage);
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUsers", ctrl.getAllUsers);

module.exports = router;

