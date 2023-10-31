const express = require('express');
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const authRoutes = require("./routes/auth");
require('dotenv').config();
const cors = require("cors");
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
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
      // done(error, doesTheUserExist)
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log('App is running on port ' + port);
});
