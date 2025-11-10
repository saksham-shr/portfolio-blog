const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('PortfolioItem', PortfolioItemSchema);
