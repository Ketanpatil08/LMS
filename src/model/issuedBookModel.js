const db = require('../config/db');

exports.getIssuedBooksByUserId = async (userId) => {
  const [rows] = await db.promise().query(
    `SELECT 
        b.title, b.author, b.image, 
        i.issue_date, i.return_date, i.status
     FROM issue_details i
     JOIN books b ON i.book_id = b.id
     WHERE i.issued_by = ?
     ORDER BY i.issue_date DESC`,
    [userId]
  );
  // Calculate due_date as 14 days after issue_date
  return rows.map(book => {
    const issueDate = new Date(book.issue_date);
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + 14); // 14 days loan period
    return {
      ...book,
      due_date: dueDate.toISOString().split('T')[0],
      isReturned: book.status === 'returned',
      isOverdue: book.status === 'overdue'
    };
  });
};