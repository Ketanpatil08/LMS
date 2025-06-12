const db = require('../config/db');

exports.addUser = async ({ name, email, password, role }) => {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    return db.promise().execute(sql, [name, email, password, role]);
};