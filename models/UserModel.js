const db = require('../config/db');

const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Error finding user by email');
    }
}

const registerUser = async (user) => {
    try {
        const { firstName, lastName, email, password } = user;
        const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [firstName, lastName, email, password];
        const result = await db.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw new Error('Error registering user');
    }
}

module.exports = {
    registerUser, findUserByEmail
}