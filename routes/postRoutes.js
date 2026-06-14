const router = require('express').Router();
const controller = require('../controller/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', controller.getAllPosts);
router.get('/create', authMiddleware, controller.getCreatePostPage);

router.post('/', authMiddleware, controller.addPost);
router.get('/:id/edit', authMiddleware, controller.getEditPage);
router.post('/:id/edit', authMiddleware, controller.updatePost);
router.post('/:id/delete', authMiddleware, controller.deletePost);

module.exports = router;