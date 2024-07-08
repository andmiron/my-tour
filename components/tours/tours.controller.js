const request = require('../../services/openai');
const Tour = require('./tours.model');
const sharp = require('sharp');
const { uploadToS3 } = require('../../services/clientS3');

class ToursController {
   async createTour(req, res) {
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
   }

   async editTour(req, res) {
      const location = {
         description: req.body.locDesc,
         coordinates: req.body.locCoords.split(','),
      };
      const { locCoords, locDesc, ...rest } = req.body;
      const tour = await Tour.findById(req.params.tourId).exec();
      tour.set({ location, ...rest });
      if (req.file) {
         const resizedPhotoBuffer = await sharp(req.file.buffer).resize(2000, 1333).jpeg().toBuffer();
         tour.imageCover = await uploadToS3(resizedPhotoBuffer, `tour-${tour.id}.jpeg`, 'image/jpeg');
      }
      await tour.save();
      res.status(200).send({
         status: 'Changes saved',
         data: tour,
      });
   }

   async deleteTour(req, res) {
      await Tour.deleteTour(req.body.deleteId);
      res.status(200).send({
         status: 'Tour deleted',
         data: null,
      });
   }

   async getAllTours(req, res) {
      const tours = await Tour.find().populate({ path: 'reviews' }).exec();
      res.status(200).send({
         status: 'success',
         data: tours,
      });
   }

   async getTour(req, res) {
      const tour = await Tour.findOne({ slug: req.params.slug }).exec();
      res.status(200).send({
         status: 'success',
         data: tour,
      });
   }

   async generateRandomInfo(req, res) {
      const tourData = await request();
      res.status(200).send({
         status: 'Info generated',
         data: tourData,
      });
   }
}

module.exports = new ToursController();
