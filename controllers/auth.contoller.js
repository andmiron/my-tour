const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');

exports.signupHandler = catchAsync(async (req, res) => {
   const { username, password } = req.body;
   const newUser = await User.create({ username, password });
   res.status(201).send({
      status: 'signed up',
      user: newUser,
   });
});

exports.loginHandler = catchAsync(async (req, res) => {
   res.status(200).send({
      status: 'logged in',
      user: req.user,
   });
});

exports.logoutHandler = catchAsync(async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
      res.status(200).send({
         status: 'logged out',
         user: req.user,
      });
   });
});

exports.deleteHandler = catchAsync(async (req, res) => {
   const userToDelete = await User.findById(req.user.id);
   if (userToDelete) await User.findByIdAndDelete(req.user.id);
   res.status(200).send({
      status: 'deleted',
      user: userToDelete,
   });
});
