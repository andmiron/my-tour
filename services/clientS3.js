const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const AppError = require('../common/AppError');
const config = require('../config/config');

const s3client = new S3Client({
   region: config.get('S3.region'),
   credentials: {
      accessKeyId: config.get('S3.accessKey'),
      secretAccessKey: config.get('S3.secretKey'),
   },
});

async function uploadToS3(buffer, fileName, contentType) {
   const uploadParams = {
      Key: fileName,
      Bucket: config.get('S3.bucketName'),
      Body: buffer,
      ContentType: contentType,
   };
   const command = new PutObjectCommand(uploadParams);
   try {
      await s3client.send(command);
      return `https://${config.get('S3.bucketName')}.s3.${config.get('S3.region')}.amazonaws.com/${fileName}`;
   } catch (err) {
      throw AppError.internal('S3 upload error!');
   }
}

async function deleteFromS3(fileName) {
   const deleteParams = {
      Bucket: config.get('S3.bucketName'),
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
