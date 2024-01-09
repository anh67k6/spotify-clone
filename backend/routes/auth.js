const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helpers');

router.delete(
  '/delete/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Kiểm tra xem người dùng có quyền xóa người dùng hay không
      // if (userId !== req.user._id.toString()) {
      //   return res.status(403).json({ err: 'You do not have permission to delete this user' });
      // }

      // Xóa người dùng
      await User.findByIdAndDelete(userId);

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: 'Server error' });
    }
  }
);

//get all song
router.get(
  '/get/all-users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const allUsers = await User.find();
      return res.status(200).json({ data: allUsers });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

// This POST route will help to register a user
router.post('/register', async (req, res) => {
  console.log(req);
  if (!req.body) {
    return res.status(403).json({ error: 'Bad request' });
  }
  const { email, password, firstName, lastName, username } = req.body;
  // Step 2 : Does a user with this email already exist? If yes, we throw an error.
  const user = await User.findOne({ email: email });
  if (user) {
    // status code by default is 200
    return res
      .status(403)
      .json({ error: 'A user with this email already exists' });
  }
  // Step 3: Create a new user in the DB
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
  };
  const newUser = await User.create(newUserData);
  console.log(newUserData);

  // Step 4: We want to create the token to return to the user
  const token = await getToken(email, newUser);

  // Step 5: Return the result to the user
  const userToReturn = { ...newUser.toJSON(), token };
  console.log(userToReturn);
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post('/login', async (req, res) => {
  // Step 1: Get email and password sent by user from req.body
  const { email, password } = req.body;

  // Step 2: Check if a user with the given email exists. If not, the credentials are invalid.
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ err: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: 'Invalid credentials' });
  }

  // Step 4: If the credentials are correct, return a token to the user.
  const token = await getToken(user.email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

module.exports = router;
