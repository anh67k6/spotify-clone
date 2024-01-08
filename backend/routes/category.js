const express = require('express');
const passport = require('passport');
const router = express.Router();
const Category = require('../models/Category');
const Song = require('../models/Song');

router.get(
  '/get/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const categories = await Category.find({}); // Tìm tất cả các categories
      return res.status(200).json({ data: categories }); // Trả về categories tìm thấy
    } catch (error) {
      return res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
    }
  }
);

router.get(
  '/get/:categoryId/songs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
      const category = await Category.findOne({ _id: categoryId });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const songs = category.songs;
      return res.status(200).json({ songs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
