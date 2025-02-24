const passport = require('passport');
const config = require('../config/config');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../components/users/users.model');
const AppError = require('../common/AppError');

passport.use(
   new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
      },
      async function localVerify(email, password, done) {
         try {
            const user = await User.findOne({ email }).select('+password');
            if (!user) return done(AppError.unauthorized('Incorrect email or password!'));
            if (user.provider === 'google')
               return done(AppError.unauthorized('This email is already associated with google account!'));
            const isPasswordValid = await user.isPasswordValid(password);
            return isPasswordValid ? done(null, user.id) : done(AppError.unauthorized('Incorrect email or password!'));
         } catch (err) {
            done(err);
         }
      },
   ),
);

passport.use(
   new GoogleStrategy(
      {
         clientID: config.get('googleAuth.clientId'),
         clientSecret: config.get('googleAuth.clientSecret'),
         callbackURL: config.get('googleAuth.callbackURL'),
      },
      async function verifyGoogle(accessToken, refreshToken, profile, done) {
         const { value: email } = profile.emails.find((email) => email.verified === true);
         try {
            let user = await User.findOne({ email });
            if (!user) user = await User.create({ email, provider: profile.provider });
            return done(null, user.id);
         } catch (err) {
            done(err);
         }
      },
   ),
);

passport.serializeUser((userId, done) => {
   return done(null, userId);
});

passport.deserializeUser(async (userId, done) => {
   const user = await User.findById(userId);
   return user ? done(null, user) : done(null, false, AppError.unauthorized('Log in with valid user!'));
});

module.exports = passport;
