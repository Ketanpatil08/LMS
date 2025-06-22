const bcrypt = require('bcryptjs');
const User = require('../model/model');
const Category = require('../model/categoryModel');
const Book = require('../model/bookModel'); // Add this at the top
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add this in your app.js
const userModel = require('../model/userModel');
const issuedBookModel = require('../model/issuedBookModel');

const JWT_SECRET = 'your_secret_key'; // Use env variable in production

exports.homePage = (req, res) => {
    res.render("home");
};

exports.loginPage = (req, res) => {
    res.render("login.ejs");
};

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    console.log('username:', username, 'password:', password);

    // Admin login check (use strict equality and correct password)
    if (username === "admin" && password === "admin@123") {
        // Optionally set admin JWT here if you want
        // const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
        // res.cookie('token', token, { httpOnly: true });
        return res.redirect('/admin/dashboard');
    } else {
        // User login check
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [username]);
        if (users.length === 0) {
            return res.render('login', { error: "Invalid Credentials" });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: "Invalid Credentials" });
        }
        // Create JWT for user
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/user/dashboard');
    }
};


exports.adminDashboardPage = async (req, res) => {
  const [[{ total_books }]] = await db.promise().query('SELECT COUNT(*) AS total_books FROM books');
  const [[{ issued_books }]] = await db.promise().query("SELECT COUNT(*) AS issued_books FROM issue_details WHERE status='issued'");
  const [[{ returned_books }]] = await db.promise().query("SELECT COUNT(*) AS returned_books FROM issue_details WHERE status='returned'");
  const [[{ overdue_books }]] = await db.promise().query("SELECT COUNT(*) AS overdue_books FROM issue_details WHERE status='overdue'");
  res.render('adminDashboard', { total_books, issued_books, returned_books, overdue_books });
};

exports.addUserPage = (req, res) => {
    res.render("addUser.ejs");
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.addUser({ name, email, password: hashedPassword, role });
        res.redirect('/viewUsers'); // or wherever you want to go after adding
    } catch (err) {
        res.status(500).send('Error adding user');
    }
};

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM users');
  const totalPages = Math.ceil(count / limit);

  const [users] = await db.promise().query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);

  res.render('viewUser', { users, page, totalPages });
};



// Show update form
exports.updateUserForm = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.getUserById(userId);
        res.render("updateUser", { user });  // Ensure "user" is defined
    } catch (err) {
        console.error("Error loading user:", err); // Add this line to debug
        res.status(500).send("Error loading user");
    }
};


// Handle update submission
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    try {
        await User.updateUser(userId, { name, email, role }); // Update user
        res.redirect("/viewUsers");
    } catch (err) {
        res.status(500).send("Error updating user");
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.deleteUserById(userId);
        res.redirect("/viewUsers");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user");
    }
};

exports.aboutPage = (req, res) => {
    res.render("aboutUs.ejs");
};


exports.addCategoryPage = (req, res) => {
    res.render('addCategory.ejs');
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await Category.addCategory(name);
        res.redirect('/viewCategories');
    } catch (err) {
        res.status(500).send('Error adding category');
    }
};

exports.getAllCategories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // or any number you want per page
  const offset = (page - 1) * limit;

  // Get total count
  const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM categories');
  const totalPages = Math.ceil(count / limit);

  // Get paginated categories
  const [categories] = await db.promise().query('SELECT * FROM categories order by id asc LIMIT ? OFFSET ? ' , [limit, offset]);

  res.render('viewCategories', { categories, page, totalPages });
};

// GET: Show Add Book form
exports.addBookPage = async (req, res) => {
  const [categories] = await db.promise().query('SELECT * FROM categories');
  res.render('addBook', { categories });
};

// POST: Handle Add Book form submission
exports.addBook = async (req, res) => {
  try {
    const { title, author, publisher, isbn, categories, total_copies, available_copies, status } = req.body;
    // If using multiple categories, handle accordingly; here, assume single category for simplicity
    const category = Array.isArray(categories) ? categories[0] : categories;

    // Multer puts the file info in req.file
    const image = req.file ? `/uploads/books/${req.file.filename}` : null;

    await db.promise().query(
      "INSERT INTO books (title, author, publisher, isbn, category, total_copies, available_copies, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, author, publisher, isbn, category, total_copies, available_copies, status, image]
    );
    res.redirect('/admin/books');
  } catch (err) {
    console.error(err);
    res.render('addBook', { message: 'Error adding book', messageType: 'error' });
  }
};

exports.viewBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // items per page
  const offset = (page - 1) * limit;

  // Get total count
  const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM books');
  const totalPages = Math.ceil(count / limit);

  // Get paginated books
  const [books] = await db.promise().query('SELECT * FROM books LIMIT ? OFFSET ?', [limit, offset]);

  res.render('viewBooks', { books, page, totalPages });
};

// Show update form
exports.updateBookPage = async (req, res) => {
  const [rows] = await db.promise().query('SELECT * FROM books WHERE id = ?', [req.params.id]);
  const book = rows[0];
  // Fetch categories if needed for dropdown
  const [categories] = await db.promise().query('SELECT id, name FROM categories');
  res.render('updateBook', { book, categories });
};

// Handle update
exports.updateBook = async (req, res) => {
  try {
    const { title, author, publisher, isbn, categories, total_copies, available_copies, status } = req.body;
    const bookId = req.params.id;

    // Get current image path from DB
    const [rows] = await db.promise().query("SELECT image FROM books WHERE id = ?", [bookId]);
    const currentImage = rows[0]?.image || null;

    // If a new image is uploaded, use it; otherwise, keep the old one
    const image = req.file ? `/uploads/books/${req.file.filename}` : currentImage;

    await db.promise().query(
      "UPDATE books SET title=?, author=?, publisher=?, isbn=?, category=?, total_copies=?, available_copies=?, status=?, image=? WHERE id=?",
      [title, author, publisher, isbn, categories, total_copies, available_copies, status, image, bookId]
    );
    res.redirect('/admin/books');
  } catch (err) {
    console.error(err);
    res.render('updateBook', { message: 'Error updating book', messageType: 'error', book: req.body });
  }
};

exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;
  // Check for references in issue_details
  const [rows] = await db.promise().query('SELECT COUNT(*) AS cnt FROM issue_details WHERE book_id = ?', [bookId]);
  if (rows[0].cnt > 0) {
    // Book is referenced, cannot delete
    return res.status(400).send('Cannot delete: Book is issued or has history.');
  }
  await db.promise().query('DELETE FROM books WHERE id = ?', [bookId]);
  res.redirect('/admin/books');
};

// Show update form for category
exports.updateCategoryPage = async (req, res) => {
    const [rows] = await db.promise().query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    const category = rows[0];
    res.render('updateCategory', { category });
};

// Handle update category
exports.updateCategory = async (req, res) => {
    const { name } = req.body;
    await db.promise().query('UPDATE categories SET name=? WHERE id=?', [name, req.params.id]);
    res.redirect('/viewCategories');
};

// Handle delete category
exports.deleteCategory = async (req, res) => {
    await db.promise().query('DELETE FROM categories WHERE id=?', [req.params.id]);
    res.redirect('/viewCategories');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// exports.viewUsers = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5;
//   const offset = (page - 1) * limit;

//   const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM users');
//   const totalPages = Math.ceil(count / limit);

//   const [users] = await db.promise().query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);

//   res.render('viewUser', { users, page, totalPages });
// };

// exports.viewCategories = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5;
//   const offset = (page - 1) * limit;

//   const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM categories');
//   const totalPages = Math.ceil(count / limit);

//   const [categories] = await db.promise().query('SELECT * FROM categories LIMIT ? OFFSET ?', [limit, offset]);

//   res.render('viewCategories', { categories, page, totalPages });
// };
// };

// Show Issue Book form
exports.issueBookPage = async (req, res) => {
  const [books] = await db.promise().query('SELECT id, title FROM books');
  res.render('issueBook', { books, message: null });
};

// Handle Issue Book form submission
exports.issueBook = async (req, res) => {
  const { book_id, name, email, return_date } = req.body;
  const [books] = await db.promise().query('SELECT id, title FROM books');
  const [users] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.render('issueBook', { books, message: 'User not found with this email.' });
  }
  // Check available copies
  const [[book]] = await db.promise().query('SELECT available_copies FROM books WHERE id = ?', [book_id]);
  if (!book || book.available_copies <= 0) {
    return res.render('issueBook', { books, message: 'No available copies for this book.' });
  }
  const issued_by = users[0].id;
  const issue_date = new Date();
  const selectedReturnDate = new Date(return_date);
  const maxReturnDate = new Date(issue_date);
  maxReturnDate.setDate(issue_date.getDate() + 7);

  if (selectedReturnDate < issue_date || selectedReturnDate > maxReturnDate) {
    return res.render('issueBook', { books, message: 'Return date must be within 7 days from today.' });
  }

  await db.promise().query(
    'INSERT INTO issue_details (book_id, issued_by, issue_date, return_date, status) VALUES (?, ?, ?, ?, ?)',
    [book_id, issued_by, issue_date, selectedReturnDate, 'issued']
  );
  await db.promise().query(
    'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [book_id]
  );
  res.render('issueBook', { books, message: 'Book issued successfully!' });
};

exports.returnBook = async (req, res) => {
  const id = req.params.id;
  // Get the issue details
  const [[issue]] = await db.promise().query('SELECT return_date FROM issue_details WHERE id = ?', [id]);
  if (!issue) return res.redirect('/admin/returned-books');
  const today = new Date();
  const returnDate = new Date(issue.return_date);
  let status = 'returned';
  if (today > returnDate) status = 'overdue';

  // Update status
  await db.promise().query('UPDATE issue_details SET status = ? WHERE id = ?', [status, id]);

  // Increment available copies
  await db.promise().query(`
    UPDATE books 
    SET available_copies = available_copies + 1 
    WHERE id = (SELECT book_id FROM issue_details WHERE id = ?)
  `, [id]);

  res.redirect('/admin/returned-books');
};

exports.issuedBooksPage = async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT 
      issue_details.id,
      books.title AS book_title,
      users.name AS user_name,
      users.email AS user_email,
      issue_details.issue_date,
      issue_details.return_date,
      issue_details.status
    FROM issue_details
    JOIN books ON books.id = issue_details.book_id
    JOIN users ON users.id = issue_details.issued_by
    ORDER BY issue_details.issue_date DESC
  `);
  res.render('issuedBooks', { issues: rows });
};

exports.returnedBooksPage = async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT 
      issue_details.id,
      books.title AS book_title,
      users.name AS user_name,
      users.email AS user_email,
      issue_details.issue_date,
      issue_details.return_date,
      issue_details.status
    FROM issue_details
    JOIN books ON books.id = issue_details.book_id
    JOIN users ON users.id = issue_details.issued_by
    WHERE issue_details.status = 'issued' OR issue_details.status = 'overdue'
    ORDER BY issue_details.issue_date DESC
  `);
  res.render('returnedBooks', { issues: rows });
};

exports.userDashboardPage = async (req, res) => {
    const userId = req.user.id;
    const userName = req.user.name;
    // Get stats for this user
    const [[{ issued }]] = await db.promise().query(
        "SELECT COUNT(*) AS issued FROM issue_details WHERE issued_by=? AND status='issued'", [userId]
    );
    const [[{ returned }]] = await db.promise().query(
        "SELECT COUNT(*) AS returned FROM issue_details WHERE issued_by=? AND status='returned'", [userId]
    );
    const [[{ overdue }]] = await db.promise().query(
        "SELECT COUNT(*) AS overdue FROM issue_details WHERE issued_by=? AND status='overdue'", [userId]
    );
    res.render('userDashboard', {
        userName,
        issued,
        returned,
        overdue
    });
};

exports.getUserProfile = async (req, res) => {
  console.log('req.user:', req.user); // <--- Place it here
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).render("error", { message: "User not found" });
    }
    res.render("userProfile", { user });
  } catch (err) {
    console.error(err); // Add this line
    res.status(500).render("error", { message: "Server error" });
  }
};

exports.getUserBooks = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT title, author, category, available_copies, status, image FROM books"
    );
    const books = rows.map(book => ({
      title: book.title,
      author: book.author,
      category: book.category || 'Unknown',
      available: book.status === 'available' && book.available_copies > 0,
      image: book.image // Make sure this is included!
    }));
    res.render('userBooks', { books });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: "Server error" });
  }
};

exports.getUserIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const issuedBooks = await issuedBookModel.getIssuedBooksByUserId(userId);
    res.render('userIssuedBooks', { issuedBooks });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: "Server error" });
  }
};



