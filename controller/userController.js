const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getRegisterPage = (req, res) => {
    res.render('register');
};

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body; 
        if (!username || !email || !password) {
            return res.status(400).send('Username, email, and password are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Invalid email format');
        }

        if (password.length < 8) {
            return res.status(400).send('Password must be at least 8 characters long');
        }

        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.registerUser({
            firstName: username,
            lastName: '',
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: newUser.uid, username: newUser.firstname }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/api/posts');
    } catch (error) {
        res.status(500).send('Error creating account');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        const user = await UserModel.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.uid, username: user.firstname }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/api/posts');
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/api/posts');
};