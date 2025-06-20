const db = require('../config/db');

exports.addCategory = async (name) => {
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    return db.promise().execute(sql, [name]);
};

exports.getAllCategories = async () => {
    const [rows] = await db.promise().query('SELECT id, name FROM categories ORDER BY id ASC');
    return rows;
};

