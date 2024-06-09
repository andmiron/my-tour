const morgan = require('morgan');

module.exports = function (tokens, req, res) {
   morgan.token('id', (req) => req.id);
   morgan.token('reqBody', (req) => {
      return JSON.stringify(req.body).split(',').join('\n    ');
   });
   morgan.token('user', (req) => {
      if (req.user) return JSON.stringify(req.user).split(',').join('\n    ');
   });
   morgan.token('locals', (req, res) => {
      return JSON.stringify(res.locals).split(',').join('\n    ');
   });

   return [
      '----------',
      `Request ID: ${tokens.id(req)}`,
      `URL: ${tokens.url(req, res)}`,
      `Method: ${tokens.method(req, res)}`,
      `Status: ${tokens.status(req, res)}`,
      `Response-time: ${tokens['response-time'](req, res)}ms`,
      `Request Body: \n   ${tokens.reqBody(req)}`,
      `Locals: \n   ${tokens.locals(req, res)}`,
      `User: \n   ${tokens.user(req)}`,
      '----------',
   ].join('\n');
};
