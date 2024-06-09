const { randomUUID } = require('node:crypto');

module.exports = function (req, res, next) {
   req.id = randomUUID();
   next();
};
