const mongoose = require('mongoose');

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Song',
    },
  ],
});

const CategoryModel = mongoose.model('Category', Category);

module.exports = CategoryModel;
