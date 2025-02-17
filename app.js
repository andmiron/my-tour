require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const passport = require('./services/passport');
const sessionOptions = require('./config/session.options');
const AppError = require('./common/AppError');
const { connectMongo } = require('./services/mongo');
const handleError = require('./middlewares/errorHandler');
const authRouter = require('./components/auth/auth.router');
const viewRouter = require('./components/views/views.router');
const userRouter = require('./components/users/users.router');
const tourRouter = require('./components/tours/tours.router');
const reviewRouter = require('./components/reviews/reviews.router');
const bookingRouter = require('./components/bookings/bookings.router');
const BookingsController = require('./components/bookings/bookings.controller');
const config = require('./config/config');

function bootstrap() {
   connectMongo(config.get('mongo'));
   return express()
      .disable('x-powered-by')
      .use(morgan('dev'))
      .use(
         helmet({
            contentSecurityPolicy: false,
         }),
      )
      .use(
         rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
         }),
      )
      .use(express.static(path.join(__dirname, 'public')))
      .set('view engine', 'pug')
      .set('views', path.join(__dirname, 'views'))
      .post('/checkout-webhook', express.raw({ type: 'application/json' }), BookingsController.checkoutWebhook)
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(session(sessionOptions))
      .use(mongoSanitize())
      .use(passport.initialize())
      .use(passport.session())
      .use('/', viewRouter)
      .use('/api/v1/auth', authRouter)
      .use('/api/v1/users', userRouter)
      .use('/api/v1/tours', tourRouter)
      .use('/api/v1/reviews', reviewRouter)
      .use('/api/v1/bookings', bookingRouter)
      .all(/(.*)/, (req, res, next) => {
         next(AppError.notFound(`Resource not found!: ${req.originalUrl}`));
      })
      .use(handleError);
}

module.exports = bootstrap();
