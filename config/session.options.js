const MongoStore = require('connect-mongo');
const config = require('./config');

module.exports = {
   name: config.get('session.name'),
   secret: config.get('session.secret'),
   store: new MongoStore({ mongoUrl: config.get('mongo') }),
   resave: true,
   saveUninitialized: true,
   rolling: true,
   cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true,
   },
};
