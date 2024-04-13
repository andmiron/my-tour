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
require('./middlewares/passport');
const passport = require('passport');
const errorHandlerMiddleware = require('./controllers/error.controller');
const authRouter = require('./routes/auth.router');
const viewRouter = require('./routes/view.router');
const userRouter = require('./routes/user.router');
const tourRouter = require('./routes/tour.router');

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
   app.use('/', viewRouter);
   app.use('/api/v1/auth', authRouter);
   app.use('/api/v1/user', userRouter);
   app.use('/api/v1/tour', tourRouter);
   app.all('*', (req, res, next) => {
      next(AppError.notFound('Resource not found!'));
   });
   app.use(errorHandlerMiddleware);

   app.listen(parseInt(process.env.PORT), () => {
      pinoLogger.logger.info(`Express on port ${process.env.PORT}`);
   });
}

build();
