const db = require('../config/db.js');

exports.getUserById = async (id) => {
  const [rows] = await db.promise().query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};