require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('./services/passport');
const sessionOptions = require('./config/session.options');
const AppError = require('./utils/app.error');
const { connectMongo } = require('./services/mongo');
const handleError = require('./middlewares/errorHandler');
const generateRequestId = require('./middlewares/genReqId');
const morganConfig = require('./services/morgan');
const authRouter = require('./components/auth/auth.router');
const viewRouter = require('./components/views/views.router');
const userRouter = require('./components/users/users.router');
const tourRouter = require('./components/tours/tours.router');
const reviewRouter = require('./components/reviews/reviews.router');
const bookingRouter = require('./components/bookings/bookings.router');
const BookingsController = require('./components/bookings/bookings.controller');

function build() {
   const app = express();
   connectMongo(process.env.MONGO_CONNECTION_STRING);
   app.set('port', process.env.PORT || 3000);
   app.set('view engine', 'pug');
   app.set('views', path.join(__dirname, 'views'));
   app.use(express.static(path.join(__dirname, 'public')));
   app.post('/checkout-webhook', express.raw({ type: 'application/json' }), BookingsController.checkoutWebhook);
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(session(sessionOptions));
   app.use(generateRequestId);
   app.use(morgan(morganConfig));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use('/', viewRouter);
   app.use('/api/v1/auth', authRouter);
   app.use('/api/v1/users', userRouter);
   app.use('/api/v1/tours', tourRouter);
   app.use('/api/v1/reviews', reviewRouter);
   app.use('/api/v1/bookings', bookingRouter);
   app.all('*', (req, res, next) => {
      next(AppError.notFound(`Resource not found!: ${req.originalUrl}`));
   });
   app.use(handleError);
   app.listen(app.get('port'), () => {
      console.log(`Express on port ${app.get('port')}`);
   });
}

build();
