const fetch = require('node-fetch');
const AppError = require('../common/AppError');

async function getRandomPhotoBuffer() {
   const randomNumber = Math.floor(Math.random() * 1249) + 1;
   const randomPhotoUrl = `${process.env.RANDOM_PHOTO_URL}${randomNumber}.jpg`;
   try {
      const response = await fetch(randomPhotoUrl);
      if (!response.ok) throw AppError.internal(`Failed to fetch random image: ${response.statusText}`);
      return response.buffer();
   } catch (err) {
      throw AppError.internal('Failed to fetch random image!');
   }
}

module.exports = getRandomPhotoBuffer;
