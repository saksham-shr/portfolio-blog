const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categories: {
    type: [String],
    default: [],
  },
  photo: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
