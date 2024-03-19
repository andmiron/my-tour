const pino = require('pino');
const { randomUUID } = require('node:crypto');

module.exports = {
   genReqId: function (req, res) {
      const existingID = req.id ?? req.headers['x-request-id'];
      if (existingID) return existingID;
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
   },
   transport: {
      target: 'pino-pretty',
      options: {
         sync: true,
         ignore: 'pid,hostname',
         colorize: true,
      },
   },
   timestamp: pino.stdTimeFunctions.isoTime,
   serializers: {
      req: (req) => ({
         method: req.method,
         url: req.url,
         user: req.user,
      }),
   },
};
