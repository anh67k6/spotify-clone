const express = require('express');
const passport = require('passport');
const router = express.Router();
const Song = require('../models/Song');
const User = require('../models/User');

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { name, thumbnail, track, duration } = req.body;
    if (!name || !thumbnail || !track || !duration) {
      return res.status(301).json({ err: 'Not enough data to create song' });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist, duration };
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
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
    const songs = await Song.find({ name: songName }).populate('artist');
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
