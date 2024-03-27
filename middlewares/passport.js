const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const localOpts = {
   usernameField: 'email',
   passwordField: 'password',
};
const localVerify = (email, password, done) => {
   User.findOne({ email })
      .select('+password')
      .then((user) => {
         if (!user) return done(null, false);
         user.isValidPassword(user.password, password).then((isValid) => {
            return isValid ? done(null, user) : done(null, false);
         });
      })
      .catch((err) => done(err));
};
const localStrategy = new LocalStrategy(localOpts, localVerify);
passport.use(localStrategy);

const googleOpts = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
const verifyGoogle = (accessToken, refreshToken, profile, done) => {
   const { value: email } = profile.emails.find((email) => email.verified === true);
   User.findOneAndUpdate({ email }, { provider: profile.provider, email }, { new: true, upsert: true })
      .then((user) => {
         return done(null, user);
      })
      .catch((err) => done(err));
};
const googleStrategy = new GoogleStrategy(googleOpts, verifyGoogle);
passport.use(googleStrategy);

passport.serializeUser((user, done) => {
   process.nextTick(() => done(null, user));
});
passport.deserializeUser((user, done) => {
   process.nextTick(() => done(null, user));
});
