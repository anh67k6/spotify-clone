const mongoose = require('mongoose');

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "MEMBER"],
    default: "MEMBER",
    uppercase: true,
},
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  likedSongs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Song',
    },
  ],
  likedPlaylists: {
    type: String,
    default: '',
  },
  subscribedArtists: {
    type: String,
    default: '',
  },
});

const UserModel = mongoose.model('User', User);

module.exports = UserModel;
