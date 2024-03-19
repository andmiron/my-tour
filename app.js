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
const { signupHandler, loginHandler, deleteHandler, logoutHandler } = require('./controllers/auth.contoller');
require('./auth/passport');
const passport = require('passport');
const { isAuthenticated } = require('./auth/middleware');

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

   app.post('/signup', signupHandler);
   app.post('/login', passport.authenticate('local'), loginHandler);
   app.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
   app.post('/logout', isAuthenticated, logoutHandler);
   app.delete('/me', isAuthenticated, deleteHandler);

   app.get('/', (req, res) => {
      res.status(200).send('hello');
   });

   app.get('/protected', isAuthenticated, (req, res) => {
      res.send('protected');
   });

   app.all('*', (req, res, next) => {
      next(new AppError(`Resource not found!`, 404));
   });

   app.listen(parseInt(process.env.PORT), () => {
      pinoLogger.logger.info(`Express on port ${process.env.PORT}`);
   });
}

build();
