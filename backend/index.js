const express = require('express');
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const authRoutes = require('./routes/auth');
const songRoute = require('./routes/song');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/User');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
// Connect to mongodb
mongoose
  .connect(process.env.MONGO_URI_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log('Connected to Mongo!');
  })
  .catch((err) => {
    console.log('Error while connecting to Mongo', err);
  });

// setup passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'thisKeyIsSupposedToBeSecret';
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });
      if (user) return done(null, user);
      else done(null, false);
    } catch (err) {
      console.log(err);
    }
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);
app.use('/song', songRoute);

app.listen(port, () => {
  console.log('App is running on port ' + port);
});
