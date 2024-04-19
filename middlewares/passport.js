const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppError = require('../utils/app.error');

const localOpts = {
   usernameField: 'email',
   passwordField: 'password',
};
const localVerify = (email, password, done) => {
   User.findOne({ email })
      .select('+password -__v')
      .then((user) => {
         if (user.provider === 'google') return done(AppError.unauthorized('Try log in with google!'));
         if (!user) return done(AppError.unauthorized('There is no such user!'));
         user.isValidPassword(user.password, password).then((isValid) => {
            const plainUserObject = user.toObject();
            const { password, ...userToSend } = plainUserObject;
            return isValid ? done(null, userToSend) : done(AppError.unauthorized('Try another password!'));
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
   process.nextTick(() => done(null, user._id));
});
passport.deserializeUser((userId, done) => {
   process.nextTick(() => {
      User.findById(userId).then((user) => {
         if (!user) return done(AppError.badRequest('Log in with valid user!'));
         return done(null, user.toObject());
      });
   });
});
