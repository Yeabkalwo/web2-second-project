const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs'); 

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    console.warn('WARNING: SESSION_SECRET is not set in .env. Use a strong secret for production session security.');
}

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(flash());
app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
    let currentUser = null;
    try {
        const token = req.cookies && req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currentUser = {
                id: Number(decoded.userId),
                username: decoded.username
            };
        }
    } catch (e) {
        currentUser = null;
    }

    res.locals.currentUser = currentUser;
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});