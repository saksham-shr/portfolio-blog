const router = require('express').Router();
const PortfolioItem = require('../models/PortfolioItem');
const { auth, admin } = require('../middleware/auth');

// CREATE Portfolio Item (Admin only)
router.post('/', auth, admin, async (req, res) => {
  const newItem = new PortfolioItem(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE Portfolio Item (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatedItem = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE Portfolio Item (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await PortfolioItem.findByIdAndDelete(req.params.id);
    res.status(200).json('Portfolio item has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET Portfolio Item
router.get('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL Portfolio Items
router.get('/', async (req, res) => {
  try {
    const items = await PortfolioItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
