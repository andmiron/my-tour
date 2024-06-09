const mongoose = require('mongoose');

exports.connectMongo = function (conStr) {
   mongoose.set({ strictQuery: true });
   mongoose
      .connect(conStr)
      .then(() => console.log('Mongo connected'))
      .catch(() => {
         console.log('Mongo connection error');
      });
};
