const request = require('../utils/openai');
const Tour = require('../models/tour.model');
const { faker } = require('@faker-js/faker');
const catchAsync = require('../utils/catch.async');

exports.createRandomTourHandler = catchAsync(async (req, res) => {
   const { input } = req.body;
   const tourData = await request(input);
   const randomTour = await Tour.create({
      imageCover: faker.image.urlLoremFlickr({ width: 1280, height: 720, category: `nature` }),
      ...tourData,
   });
   res.status(201).send({
      status: 'Random tour created',
      data: randomTour,
   });
});

exports.getTourHandler = catchAsync(async (req, res) => {
   const tour = await Tour.findOne({ slug: req.params.slug });
   res.status(200).send({
      status: 'success',
      data: tour,
   });
});

exports.createTourHandler = catchAsync(async (req, res) => {});
