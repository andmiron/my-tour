const nodemailer = require('nodemailer');
const config = require('../config/config');

const transport = nodemailer.createTransport({
   host: config.get('mailer.host'),
   port: config.get('mailer.port'),
   auth: {
      user: config.get('mailer.user'),
      pass: config.get('mailer.password'),
   },
});

exports.sendMail = async function (to, subject, text) {
   const info = transport.sendMail({
      from: config.get('mailer.host'),
      to,
      subject,
      text,
      html: text,
   });
   return info.messageId;
};
