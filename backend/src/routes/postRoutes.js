const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  likePost,
  commentPost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getPosts)
  .post(protect, upload.single('image'), createPost);

router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

module.exports = router;
