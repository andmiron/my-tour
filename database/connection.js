const mongoose = require('mongoose');
const { pinoLogger } = require('../app');
const { logger } = pinoLogger;

module.exports = (uri, options = {}) => {
   mongoose.set({ strictQuery: true });
   mongoose
      .connect(uri, options)
      .then(() => {
         logger.info(`Mongo connected`);
      })
      .catch((err) => {
         logger.error(`Mongo connection fail: ${err.message}`);
      });
};
