const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ctrl.js"); // Adjust path if needed

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.get('/admin/dashboard', ctrl.adminDashboardPage);
router.post("/userLogin", ctrl.adminDashboardPage);
router.get("/adduser", ctrl.addUserPage);
router.post("/adduser", ctrl.addUser);
router.get("/viewUsers", ctrl.getAllUsers);
router.get("/updateUser/:id", ctrl.updateUserForm);     // to show form with pre-filled data
router.post("/updateUser/:id", ctrl.updateUser);        // to save updated data

router.post("/users/delete/:id", ctrl.deleteUser);
router.get("/addCategory", ctrl.addCategoryPage);
router.post("/addCategory", ctrl.addCategory);
router.get("/viewCategories", ctrl.getAllCategories);
router.get('/categories/update/:id', ctrl.updateCategoryPage);
router.post('/categories/update/:id', ctrl.updateCategory);
router.post('/categories/delete/:id', ctrl.deleteCategory);




router.get("/aboutUs", ctrl.aboutPage);
router.get('/addBook', ctrl.addBookPage);
router.post('/admin/books/add', ctrl.addBook);
router.get('/admin/books', ctrl.viewBooks);
router.get('/admin/books/update/:id', ctrl.updateBookPage);
router.post('/admin/books/update/:id', ctrl.updateBook);
router.post('/admin/books/delete/:id', ctrl.deleteBook);
<<<<<<< HEAD

module.exports = router;
=======
router.get('/logout', ctrl.logout); // Added logout route
router.get('/admin/issue-book', ctrl.issueBookPage);
router.post('/admin/issue-book', ctrl.issueBook);
router.get('/admin/issued-books', ctrl.issuedBooksPage);
router.get('/admin/returned-books', ctrl.returnedBooksPage);
router.post('/admin/return-book/:id', ctrl.returnBook);

module.exports = router;

>>>>>>> f862d852df984071e3c0f084bc5148e3e57c5590
