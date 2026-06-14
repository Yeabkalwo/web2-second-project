const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/api/users/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: Number(decoded.userId),
            username: decoded.username
        };
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/api/users/login');
    }
};

module.exports = authMiddleware;