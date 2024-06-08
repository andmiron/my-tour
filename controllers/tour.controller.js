const request = require('../services/openai');
const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catch.async');
const sharp = require('sharp');

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
   const { startLocCoords, startLocDesc, ...rest } = req.body;
   const newTour = new Tour({ startLocation, ...rest, guide: req.user._id });
   req.file.filename = `tour-${newTour.id}.jpeg`;
   await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${req.file.filename}`);
   newTour.imageCover = `/img/${req.file.filename}`;
   await newTour.save();
   res.status(201).send({
      status: 'Tour created',
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
