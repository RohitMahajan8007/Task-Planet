const Post = require('../models/Post');


const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};


const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!content && !image) {
      res.status(400);
      throw new Error('Please provide content or an image');
    }

    let post = await Post.create({
      user: req.user._id,
      content,
      image,
      likes: [],
      comments: [],
    });

    post = await post.populate('user', 'username');

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const likedIndex = post.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();
    
    await post.populate('user', 'username');
    await post.populate('comments.user', 'username');

    res.json(post);
  } catch (error) {
    next(error);
  }
};


const commentPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const newComment = {
      user: req.user._id,
      username: req.user.username,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    await post.populate('user', 'username');
    await post.populate('comments.user', 'username');

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  commentPost,
};
