const db = require('../config/db');

exports.addUser = async ({ name, email, password, role }) => {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    return db.promise().execute(sql, [name, email, password, role]);
};

exports.getAllUsers = async () => {
    const [rows] = await db.promise().query('SELECT id, name, email, role, created_at FROM users');
    return rows;
};

exports.getUserById = async (id) => {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
};

exports.updateUser = async (id, updatedUser) => {
    const { name, email, role } = updatedUser;
    await db.promise().query("UPDATE users SET name=?, email=?, role=? WHERE id=?", [name, email, role, id]);
};

exports.deleteUserById = async (id) => {
    await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
};




