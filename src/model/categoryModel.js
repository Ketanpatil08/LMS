const db = require('../config/db');

exports.addCategory = async (name) => {
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    return db.promise().execute(sql, [name]);
};

exports.getAllCategories = async () => {
    const [rows] = await db.promise().query('SELECT id, name FROM categories ORDER BY id ASC');
    return rows;
};

exports.getCategoryById = async (id) => {
    const [rows] = await db.promise().query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0]; // ✅ Only one row
};



exports.updateCategory = async (id, updatedCategory) => {
    const { name, description } = updatedCategory;
   await db.promise().query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);

};


const deleteCategoryById = (id) => {
    return db.query("DELETE FROM category WHERE id = ?", [id]);
};

module.exports = {
    deleteCategoryById
    // add other functions like createCategory, updateCategory if needed
};
