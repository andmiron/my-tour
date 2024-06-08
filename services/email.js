const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
   port: process.env.MAIL_PORT,
   auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
   },
});

exports.sendMail = async function (to, subject, text) {
   const info = transport.sendMail({
      from: process.env.MAIL_HOST,
      to,
      subject,
      text,
      html: text,
   });
   return info.messageId;
};
