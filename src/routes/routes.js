const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const ctrl = require("../controllers/ctrl.js");

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.post("/userLogin", ctrl.userLogin); // handles admin login with credentials
router.get("/userLogin", ctrl.adminDashboardPage); // renders dashboard after login
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUser", ctrl.viewUserPage); // you must define this in ctrl.js
=======
const ctrl = require("../controllers/ctrl.js"); // Adjust path if needed

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.post("/userLogin", ctrl.adminDashboardPage);
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUsers", ctrl.getAllUsers);
>>>>>>> 759df191594a7d2b3df5f425eddf07adcec6d49b

module.exports = router;
