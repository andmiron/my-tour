const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

const verify = (username, password, done) => {
   User.findOne({ username })
      .select('+password')
      .then((user) => {
         if (!user) return done(null, false);
         user.isValidPassword(user.password, password).then((isValid) => {
            return isValid ? done(null, user) : done(null, false);
         });
      })
      .catch((err) => done(err));
};
const localStrategy = new LocalStrategy(verify);
passport.use(localStrategy);

passport.serializeUser((user, done) => {
   process.nextTick(() => {
      return done(null, user.id);
   });
});
passport.deserializeUser((userId, done) => {
   process.nextTick(() => {
      User.findById(userId)
         .then((user) => {
            return done(null, user);
         })
         .catch((err) => done(err));
   });
});

const googleAuthOptions = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const verifyGoogleUser = (accessToken, refreshToken, profile, done) => done(null, profile);

const googleStrategy = new GoogleStrategy(googleAuthOptions, verifyGoogleUser);

passport.use(googleStrategy);
