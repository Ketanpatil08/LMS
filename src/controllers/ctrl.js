const bcrypt = require('bcryptjs');
const User = require('../model/model');
const Category = require('../model/categoryModel');
const Book = require('../model/bookModel'); // Add this at the top
const db = require('../config/db');

exports.homePage = (req, res) => {
    res.render("home");
};

exports.loginPage = (req, res) => {
    res.render("login.ejs");
};

exports.userLogin=(req,res)=>{
    let {username,password}=req.body;
    if(username==="admin" && password==="admin@123")
    {
        res.render('adminDashboard');
    }
    else
    {
        res.render('adminLogin',{error:"Invalid Credentials"});

    }
}


exports.adminDashboardPage = (req, res) => {
    res.render("adminDashboard.ejs");
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
  const [categories] = await db.promise().query('SELECT id, name FROM categories');
  res.render('addBook', { categories });
};

// POST: Handle Add Book form submission
exports.addBook = async (req, res) => {
  try {
    const { title, author, publisher, isbn, category, total_copies, available_copies, status, image } = req.body;
        // Basic validation
        if (!title || !author || !category) {
            const [categories] = await db.promise().query('SELECT id, name FROM categories order by id asc');
            return res.render('addBook', { categories, message: 'Title, author, and category are required.', messageType: 'error' });
        }
        await Book.addBook({ title, author, publisher, isbn, category, total_copies, available_copies, status, image });
        const [categories] = await db.promise().query('SELECT id, name FROM categories');
        res.render('addBook.ejs', { categories, message: 'Book added successfully!', messageType: 'success' });
  } catch (err) {
    const [categories] = await db.promise().query('SELECT id, name FROM categories');
    res.render('addBook', { categories, message: 'Internal server error', messageType: 'error' });
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
  const { title, author, publisher, isbn, category, total_copies, available_copies, status, image } = req.body;
  await db.promise().query(
    'UPDATE books SET title=?, author=?, publisher=?, isbn=?, category=?, total_copies=?, available_copies=?, status=?, image=? WHERE id=?',
    [title, author, publisher, isbn, category, total_copies, available_copies, status, image, req.params.id]
  );
  res.redirect('/admin/books');
};

exports.deleteBook = async (req, res) => {
  await db.promise().query('DELETE FROM books WHERE id = ?', [req.params.id]);
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

