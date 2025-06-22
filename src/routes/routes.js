const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ctrl.js"); // Adjust path if needed
const { requireUser } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/books/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get("/", ctrl.homePage);
router.get("/login", ctrl.loginPage);
router.get('/admin/dashboard', ctrl.adminDashboardPage);
router.post("/userLogin", ctrl.userLogin);
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
router.post('/admin/books/add', upload.single('image'), ctrl.addBook);
router.get('/admin/books', ctrl.viewBooks);
router.get('/admin/books/update/:id', ctrl.updateBookPage);
router.post('/admin/books/update/:id', upload.single('image'), ctrl.updateBook);
router.post('/admin/books/delete/:id', ctrl.deleteBook);

router.get('/logout', ctrl.logout); // Added logout route
router.get('/admin/issue-book', ctrl.issueBookPage);
router.post('/admin/issue-book', ctrl.issueBook);
router.get('/admin/issued-books', ctrl.issuedBooksPage);
router.get('/admin/returned-books', ctrl.returnedBooksPage);
router.post('/admin/return-book/:id', ctrl.returnBook);
router.get('/user/dashboard', requireUser, ctrl.userDashboardPage);
router.get("/user/profile", requireUser, ctrl.getUserProfile);
router.get('/user/books', requireUser, ctrl.getUserBooks);
router.get('/user/issued-books', requireUser, ctrl.getUserIssuedBooks);

module.exports = router;


