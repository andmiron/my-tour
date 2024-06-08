const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const AppError = require('../utils/app.error');

const s3client = new S3Client({
   region: process.env.AWS_S3_REGION,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
   },
});

async function uploadToS3(buffer, fileName, contentType) {
   const uploadParams = {
      Key: fileName,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Body: buffer,
      ContentType: contentType,
   };
   const command = new PutObjectCommand(uploadParams);
   try {
      await s3client.send(command);
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
   } catch (err) {
      throw AppError.internal('S3 upload error!');
   }
}

async function deleteFromS3(fileName) {
   const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
   };
   const command = new DeleteObjectCommand(deleteParams);
   try {
      const response = await s3client.send(command);
      return response.DeleteMarker;
   } catch (err) {
      throw AppError.internal('S3 delete error!');
   }
}

module.exports = { s3client, uploadToS3, deleteFromS3 };
