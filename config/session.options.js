const MongoStore = require('connect-mongo');

module.exports = {
   name: process.env.SESSION_NAME,
   secret: process.env.SESSION_SECRET,
   store: new MongoStore({ mongoUrl: process.env.MONGO_CONNECTION_STRING }),
   resave: true,
   saveUninitialized: true,
   rolling: true,
   cookie: {
      maxAge: 360000,
      secure: false,
      httpOnly: true,
   },
};
