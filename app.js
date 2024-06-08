require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const loggerOptions = require('./config/logger.options');
const pinoLogger = require('pino-http')(loggerOptions);
// const morgan = require('morgan');
module.exports.pinoLogger = pinoLogger;
const session = require('express-session');
const sessionOptions = require('./config/session.options');
const AppError = require('./utils/app.error');
require('./services/passport');
const passport = require('passport');
const errorHandlerMiddleware = require('./controllers/error.controller');
const authRouter = require('./routes/auth.router');
const viewRouter = require('./routes/view.router');
const userRouter = require('./routes/user.router');
const tourRouter = require('./routes/tour.router');
const reviewRouter = require('./routes/review.router');

const app = express();

function build() {
   app.set('port', process.env.PORT);
   app.set('view engine', 'pug');
   app.set('views', path.join(__dirname, 'views'));
   mongoose.set({ strictQuery: true });
   mongoose
      .connect(process.env.MONGO_CONNECTION_STRING)
      .then(() => pinoLogger.logger.info('Mongo connected'))
      .catch((err) => pinoLogger.logger.error('Mongo connection error'));
   app.use(express.static(path.join(__dirname, 'public')));
   app.use(pinoLogger);
   // app.use(morgan('dev'));
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(session(sessionOptions));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use('/api/v1/auth', authRouter);
   app.use('/api/v1/users', userRouter);
   app.use('/api/v1/tours', tourRouter);
   app.use('/api/v1/reviews', reviewRouter);
   app.use('/', viewRouter);
   app.all('*', (req, res, next) => {
      next(AppError.notFound('Resource not found!'));
   });
   app.use(errorHandlerMiddleware);
   app.listen(app.get('port'), () => {
      pinoLogger.logger.info(`Express on port ${app.get('port')}`);
   });
}

build();
