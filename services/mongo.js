const mongoose = require('mongoose');
const config = require('../config/config');

exports.connectMongo = function (conStr) {
   mongoose.set({ strictQuery: true });
   mongoose
      .connect(conStr)
      .then(() => console.log(`Mongo connected: ${config.get('env')} environment`))
      .catch(() => {
         console.log('Mongo connection error');
      });
};
