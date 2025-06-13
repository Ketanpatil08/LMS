const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ctrl.js"); // Adjust path if needed

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.post("/userLogin", ctrl.adminDashboardPage);
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUsers", ctrl.getAllUsers);
router.get("/addCategory", ctrl.addCategoryPage);
router.post("/addCategory", ctrl.addCategory);
router.get("/viewCategories", ctrl.getAllCategories);


router.get("/updateUser/:id", ctrl.updateUserForm);     // to show form with pre-filled data
router.post("/updateUser/:id", ctrl.updateUser);        // to save updated data

router.post("/users/delete/:id", ctrl.deleteUser);

router.get("/aboutUs", ctrl.aboutPage);

module.exports = router;

