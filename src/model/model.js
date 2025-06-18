const db = require('../config/db');

exports.addUser = async ({ name, email, password, role }) => {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    return db.promise().execute(sql, [name, email, password, role]);
};

exports.getAllUsers = async () => {
    const [rows] = await db.promise().query('SELECT id, name, email, role, created_at FROM users');
    return rows;
};


// Get user by ID
exports.getUserById = async (id) => {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]); // ✅ FIXED
    return rows[0];
};


// Update user
exports.updateUser = async (id, updatedUser) => {
    const { name, email, role } = updatedUser;
    await db.promise().query("UPDATE users SET name=?, email=?, role=? WHERE id=?", [name, email, role, id]);
};

// Delete user by ID
exports.deleteUserById = async (id) => {
    await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
};

const deleteCategoryById = (id) => {
    return db.query("DELETE FROM category WHERE id = ?", [id]);
};

// Export it
module.exports = {
    deleteCategoryById,
    // other exported functions like getAllCategories, addCategory etc.
};




