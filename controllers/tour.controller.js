const request = require('../utils/openai');
const Tour = require('../models/tour.model');
const { faker } = require('@faker-js/faker');

exports.createRandomTourHandler = async (req, res) => {
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
};
