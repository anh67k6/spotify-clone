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
      const categories = await Category.find({})
        .sort('name')
        .populate({
          path: 'songs',
          options: { sort: { name: 1 }, limit: 5 },
        });
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
    console.log('categoryId', categoryId);
    try {
      const categories = await Category.findById(categoryId)
        .sort('name')
        .populate({
          path: 'songs',
          options: { sort: { name: 1 } },
        });

      if (!categories) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.status(200).json({ data: categories });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get('/getAll', async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      {
        name: 1,
        _id: 1,
      }
    );
    return res.status(200).json({ data: categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
