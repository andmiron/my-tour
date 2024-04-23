const fetch = require('node-fetch');
const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');

exports.renderPage = function (template, title) {
   return function (req, res) {
      res.render(template, { title });
   };
};

exports.getVerifiedEmail = catchAsync(async (req, res) => {
   const response = await fetch(`${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/users/email/verify`, {
      method: 'PUT',
      body: JSON.stringify({ token: req.params.token }),
      headers: { 'Content-Type': 'application/json' },
   });
   const { data } = await response.json();
   res.render('emailConfirm', { title: 'Email confirmation', email: data.email });
});
