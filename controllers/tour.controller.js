const request = require('../utils/openai');
const Tour = require('../models/tour.model');
const { faker } = require('@faker-js/faker');
const catchAsync = require('../utils/catch.async');

exports.generateRandomInfoHandler = catchAsync(async (req, res) => {
   const tourData = await request();
   res.status(200).send({
      status: 'Info generated',
      data: tourData,
   });
});

exports.createTourHandler = catchAsync(async (req, res) => {
   const startLocation = {
      description: req.body.startLocDesc,
      coordinates: req.body.startLocCoords.split(','),
   };
   // TODO add image upload startLocImg > imageCover
   const { startLocCoords, startLocDesc, ...rest } = req.body;
   const newTour = await Tour.create({ startLocation, ...rest, guides: req.user._id });
   res.status(201).send({
      status: 'Tour has been created',
      data: newTour,
   });
});

exports.getTourHandler = catchAsync(async (req, res) => {
   const tour = await Tour.findOne({ slug: req.params.slug });
   res.status(200).send({
      status: 'success',
      data: tour,
   });
});
