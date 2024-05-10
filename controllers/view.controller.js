const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catch.async');

exports.renderPage = function (template, title) {
   return function (req, res) {
      res.render(template, { title });
   };
};

exports.renderTours = catchAsync(async (req, res) => {
   const tours = await Tour.find();
   res.render('allTours', { title: 'All tours', tours });
});

exports.renderTour = catchAsync(async (req, res) => {
   const { tourSlug: slug } = req.params;
   const tour = await Tour.findOne({ slug });
   res.render('tour', { title: tour.name, tour });
});
