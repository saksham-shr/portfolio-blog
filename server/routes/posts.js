const router = require('express').Router();
const Post = require('../models/Post');
const { auth, admin } = require('../middleware/auth');

// CREATE Post (Admin only)
router.post('/', auth, admin, async (req, res) => {
  const newPost = new Post({
    ...req.body,
    author: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE Post (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE Post (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json('Post has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET Post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL Posts
router.get('/', async (req, res) => {
  const categoryName = req.query.cat;
  try {
    let posts;
    if (categoryName) {
      posts = await Post.find({ categories: { $in: [categoryName] } }).populate('author', 'username');
    } else {
      posts = await Post.find().populate('author', 'username');
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
