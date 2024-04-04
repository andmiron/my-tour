require('dotenv').config();
const express = require('express');
const path = require('path');
const loggerOptions = require('./config/logger.options');
const pinoLogger = require('pino-http')(loggerOptions);
module.exports.pinoLogger = pinoLogger;
const connectDatabase = require('./database/connection');
const session = require('express-session');
const sessionOptions = require('./config/session.options');
const AppError = require('./utils/app.error');
const {
   signupHandler,
   loginHandler,
   logoutHandler,
   forgetPasswordHandler,
   resetPasswordHandler,
   deleteUserHandler,
} = require('./controllers/auth.contoller');
require('./middlewares/passport');
const {
   validate,
   signupValidator,
   loginValidator,
   forgetPasswordValidator,
   resetPasswordValidator,
} = require('./middlewares/validate');
const passport = require('passport');
const { isAuthenticated } = require('./middlewares/authenticated');
const errorHandlerMiddleware = require('./controllers/error.controller');

const app = express();

function build() {
   app.set('x-powered-by', false);
   app.set('view engine', 'pug');
   app.set('views', path.join(__dirname, 'views'));
   connectDatabase(process.env.MONGO_CONNECTION_STRING);
   app.use(express.static(path.join(__dirname, 'public')));
   app.use(pinoLogger);
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(session(sessionOptions));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use((req, res, next) => {
      if (req.user) res.locals.user = req.user;
      next();
   });

   app.get('/', (req, res) => res.render('home', { title: 'Home' }));
   app.get('/signup', (req, res) => res.render('signup', { title: 'Sign up' }));
   app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
   app.get('/forget', (req, res) => res.render('forgetPassword', { title: 'Forget password' }));
   app.get('/reset/:token', (req, res) => res.render('resetPassword', { title: 'Reset password' }));
   app.get('/protected', isAuthenticated, (req, res) => res.send('protected'));

   app.post('/signup', signupValidator(), validate, signupHandler);
   app.post('/login', loginValidator(), validate, passport.authenticate('local'), loginHandler);
   app.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
   app.get(
      '/auth/google/callback',
      passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
   );
   app.post('/logout', isAuthenticated, logoutHandler);
   app.post('/forget', forgetPasswordValidator(), validate, forgetPasswordHandler);
   app.post('/reset/:token', resetPasswordValidator(), validate, resetPasswordHandler);
   app.delete('/profile', isAuthenticated, deleteUserHandler);

   app.all('*', (req, res, next) => {
      next(AppError.notFound('Resource not found!'));
   });

   app.use(errorHandlerMiddleware);

   app.listen(parseInt(process.env.PORT), () => {
      pinoLogger.logger.info(`Express on port ${process.env.PORT}`);
   });
}

build();
