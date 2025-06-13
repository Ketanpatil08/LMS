const bcrypt = require('bcryptjs');
const User = require('../model/model');

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