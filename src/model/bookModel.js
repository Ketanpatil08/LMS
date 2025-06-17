const db = require('../config/db');

exports.addBook = async (book) => {
    const sql = `INSERT INTO books 
        (title, author, publisher, isbn, category, total_copies, available_copies, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return db.promise().execute(sql, [
        book.title,
        book.author,
        book.publisher,
        book.isbn,
        book.category,
        book.total_copies,
        book.available_copies,
        book.status,
        book.image
    ]);
};