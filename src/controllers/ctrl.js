const bcrypt = require('bcryptjs');
const User = require('../model/model');
const Category = require('../model/categoryModel');

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
    try {
        const users = await User.getAllUsers();
        res.render('viewUser.ejs', { users }); // Make sure 'users' is passed
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
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
    try {
        const categories = await Category.getAllCategories();
        res.render('viewCategories.ejs', { categories });
    } catch (err) {
        res.status(500).send('Error fetching categories');
    }
};