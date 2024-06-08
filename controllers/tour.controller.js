const request = require('../services/openai');
const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catch.async');
const sharp = require('sharp');
const { uploadToS3 } = require('../services/clientS3');

exports.generateRandomInfoHandler = catchAsync(async (req, res) => {
   const tourData = await request();
   res.status(200).send({
      status: 'Info generated',
      data: tourData,
   });
});

exports.createTourHandler = catchAsync(async (req, res) => {
   const location = {
      description: req.body.locDesc,
      coordinates: req.body.locCoords.split(','),
   };
   const { locCoords, locDesc, ...rest } = req.body;
   const newTour = new Tour({ location, ...rest, ownerId: req.user._id });
   const resizedPhotoBuffer = await sharp(req.file.buffer).resize(2000, 1333).jpeg().toBuffer();
   newTour.imageCover = await uploadToS3(resizedPhotoBuffer, `tour-${newTour.id}.jpeg`, 'image/jpeg');
   await newTour.save();
   res.status(201).send({
      status: 'Tour created',
      data: newTour,
   });
});

exports.getTourHandler = catchAsync(async (req, res) => {
   const tour = await Tour.findOne({ slug: req.params.slug }).exec();
   res.status(200).send({
      status: 'success',
      data: tour,
   });
});

exports.getAllTours = catchAsync(async (req, res) => {
   const tours = await Tour.find().populate({ path: 'reviews' }).exec();
   res.status(200).send({
      status: 'success',
      data: tours,
   });
});
