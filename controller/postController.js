const PostModel = require('../models/PostModel');
require('dotenv').config();

exports.getAllPosts = async (req, res) => {
    try {
        const sortBy = req.query.sortBy === 'creator' ? 'creator' : 'recent';
        const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
        const posts = await PostModel.getAllPosts(sortBy, sortOrder);
        res.render('index', { posts, sortBy, sortOrder });
    } catch (error) {
        res.status(500).send('Error retrieving posts feed');
    }
};

exports.getCreatePostPage = (req, res) => {
    res.render('create-post');
};

exports.addPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required');
        }

        await PostModel.addPost({
            title,
            content,
            creator: req.user.id
        });
        req.flash('success', 'Post published successfully.');
        res.redirect('/api/posts');
    } catch (error) {
        res.status(500).send('Error saving post');
    }
};

exports.getEditPage = async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        // Ownership check: only creator can access edit page
        if (Number(post.creator) !== req.user.id) {
            req.flash('error', 'You are not authorized to edit that post.');
            return res.redirect('/api/posts');
        }

        res.render('edit-post', { post });
    } catch (error) {
        res.status(500).send('Error loading edit interface');
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        // Critical ownership check before updating
        if (Number(post.creator) !== req.user.id) {
            req.flash('error', 'You are not authorized to update that post.');
            return res.redirect('/api/posts');
        }

        await PostModel.updatePost(req.params.id, req.body.title, req.body.content);
        req.flash('success', 'Post updated successfully.');
        res.redirect('/api/posts');
    } catch (error) {
        res.status(500).send('Error updating post record');
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        if (Number(post.creator) !== req.user.id) {
            req.flash('error', 'You are not authorized to delete that post.');
            return res.redirect('/api/posts');
        }

        await PostModel.deletePost(req.params.id);
        req.flash('success', 'Post deleted successfully.');
        res.redirect('/api/posts');
    } catch (error) {
        res.status(500).send('Error eliminating post record');
    }
};