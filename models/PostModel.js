const db = require('../config/db');

const getAllPosts = async (sortBy = 'recent', sortOrder = 'desc') => {
    try {
        const sortFields = {
            creator: 'creator',
            recent: 'created_when'
        };
        const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
        const field = sortFields[sortBy] || sortFields.recent;
        const query = `SELECT p.*, u.firstname AS creator_name FROM posts p JOIN users u ON u.uid = p.creator ORDER BY ${field} ${order}`;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Error fetching posts');
    }
}

const addPost = async (post) => {
    try {
        const { title, content, creator } = post;

        const query = 'INSERT INTO posts (title, description, creator) VALUES ($1, $2, $3) RETURNING *';
        const values = [title, content, creator];
        const result = await db.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.error('Error adding post:', error);
        throw new Error('Error adding post');
    }
}
const getPostById = async (id) => {
    const result = await db.query('SELECT * FROM posts WHERE pid = $1', [id]);
    return result.rows[0];
};

const updatePost = async (id, title, content) => {
    const query = 'UPDATE posts SET title = $1, description = $2, updated_when = now() WHERE pid = $3 RETURNING *';
    const result = await db.query(query, [title, content, id]);
    return result.rows[0];
};

const deletePost = async (id) => {
    await db.query('DELETE FROM posts WHERE pid = $1', [id]);
};


module.exports = { getAllPosts, addPost, getPostById, updatePost, deletePost };
