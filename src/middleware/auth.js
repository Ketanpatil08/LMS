const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

exports.requireUser = (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};