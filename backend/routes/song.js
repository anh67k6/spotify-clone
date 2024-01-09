const express = require('express');
const passport = require('passport');
const router = express.Router();
const Song = require('../models/Song');
const User = require('../models/User');
const CategoryModel = require('../models/Category');

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { name, thumbnail, track, duration, singer, category } = req.body;
    if (!name || !thumbnail || !track || !duration || !singer || !category) {
      return res.status(301).json({ err: 'Not enough data to create song' });
    }
    const artist = req.user._id;
    const songDetails = {
      name,
      thumbnail,
      track,
      artist,
      duration,
      singer,
    };
    const createdSong = await Song.create(songDetails);
    await CategoryModel.findOneAndUpdate(
      {
        _id: category,
      },
      {
        $push: {
          songs: createdSong._id,
        },
      }
    );
    return res.status(200).json(createdSong);
  }
);

router.delete(
  '/delete/:songId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { songId } = req.params;

      // Kiểm tra xem người dùng có quyền xóa người dùng hay không
      // if (userId !== req.user._id.toString()) {
      //   return res.status(403).json({ err: 'You do not have permission to delete this user' });
      // }

      // Xóa người dùng
      await Song.findByIdAndDelete(songId);

      return res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: 'Server error' });
    }
  }
);
// Update song details by ID
router.put(
  '/update/:songId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { songId } = req.params;
      const { name, thumbnail, singer } = req.body;

      // Kiểm tra xem người dùng có quyền chỉnh sửa bài hát hay không
      // (bạn có thể thêm logic kiểm tra quyền ở đây nếu cần)
      
      // Tìm và cập nhật bài hát
      const updatedSong = await Song.findByIdAndUpdate(
        songId,
        { $set: { name, thumbnail, singer } },
        { new: true }
      );

      if (!updatedSong) {
        return res.status(404).json({ err: 'Song not found' });
      }

      return res.status(200).json({data: updatedSong});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: 'Server error' });
    }
  }
);


//get all song
router.get(
  '/get/all-songs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const allSongs = await Song.find().populate('artist');
      return res.status(200).json({ data: allSongs });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

//get route to all the songs a user has published
router.get(
  '/get/mysongs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // We need to get all songs where artist id == currentUser._id
    const songs = await Song.find({ artist: req.user._id }).populate('artist');
    return res.status(200).json({ data: songs });
  }
);

//get songs published by an artist
router.get(
  '/get/artist/:artistId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { artistId } = req.params;
    const artist = await User.findOne({ _id: artistId });
    if (!artist) return res.status(301).json({ err: 'Artist does not exist' });
    const songs = await Song.find({ artist: artistId });
    return res.status(200).json({ data: songs });
  }
);

// get songs by song name
router.get(
  '/get/songname/:songName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { songName } = req.params;
    const songs = await Song.find({
      name: { $regex: new RegExp(songName, 'i') },
    }).populate('artist');
    return res.status(200).json({ data: songs });
  }
);
router.get(
  '/likedSongs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = req.user.id; // Lấy userId từ thông tin được xác thực

    try {
      const user = await User.findById(userId).populate('likedSongs');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { likedSongs, firstName, lastName } = user;
      return res.status(200).json({ likedSongs, firstName, lastName });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
);
router.post(
  '/add-to-liked-songs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const currentUser = req.user;

      const { songId } = req.body;

      // Tìm người dùng
      const user = await User.findById(currentUser._id);
      console.log(user);
      if (!user) {
        return res.status(404).json({ err: 'User not found' });
      }

      // Tìm bài hát
      const song = await Song.findById(songId);
      if (!song) {
        return res.status(404).json({ err: 'Song not found' });
      }

      // Kiểm tra xem bài hát đã có trong danh sách Liked Songs chưa
      if (user.likedSongs.includes(songId)) {
        return res.status(400).json({ err: 'Song already in Liked Songs' });
      }

      // Thêm bài hát vào danh sách Liked Songs của người dùng
      user.likedSongs.push(songId);
      await user.save();

      return res.status(200).json({ message: 'Song added to Liked Songs' });
    } catch (error) {
      return res.status(500).json({ err: 'Server error' });
    }
  }
);
module.exports = router;
