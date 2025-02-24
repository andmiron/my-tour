require('dotenv').config();
const convict = require('convict');

const config = convict({
   env: {
      format: ['production', 'development', 'test'],
      default: 'development',
      env: 'NODE_ENV',
   },
   port: {
      doc: 'Port to bind',
      default: 3000,
      env: 'PORT',
   },
   mongo: {
      doc: 'Full mongodb connection string',
      env: 'MONGO_CONNECTION_STRING',
      default: '',
   },
   session: {
      name: {
         doc: 'Express session name',
         env: 'SESSION_NAME',
         default: 'session',
      },
      secret: {
         doc: 'Express session secret',
         env: 'SESSION_SECRET',
         default: '',
      },
   },
   S3: {
      region: {
         doc: 'AWS region',
         env: 'AWS_S3_REGION',
         default: '',
      },
      accessKey: {
         doc: 'AWS access key',
         env: 'AWS_S3_ACCESS_KEY',
         default: '',
      },
      secretKey: {
         doc: 'AWS secret access key',
         env: 'AWS_S3_SECRET_ACCESS_KEY',
         default: '',
      },
      bucketName: {
         doc: 'S3 bucket name',
         env: 'AWS_S3_BUCKET_NAME',
         default: '',
      },
   },
   mailer: {
      host: {
         doc: 'Email sender host',
         env: 'MAIL_HOST',
         default: '',
      },
      port: {
         doc: 'Email sender port',
         env: 'MAIL_PORT',
         default: '',
      },
      user: { doc: 'Email sender user', env: 'MAIL_USER', default: '' },
      password: { doc: 'Email sender password', env: 'MAIL_PASS', default: '' },
   },
   googleAuth: {
      clientId: {
         doc: 'Google Client ID',
         env: 'GOOGLE_CLIENT_ID',
         default: '',
      },
      clientSecret: {
         doc: 'Google Client Secret',
         env: 'GOOGLE_CLIENT_SECRET',
         default: '',
      },
      callbackURL: {
         doc: 'Google callback URL',
         env: 'GOOGLE_CALLBACK_URL',
         default: '',
      },
   },
   stripe: {
      apiKey: {
         doc: 'Stripe payment system api key',
         env: 'STRIPE_API_KEY',
         default: '',
      },
      webhookSecret: {
         doc: 'Stripe payment system webhook secret',
         env: 'STRIPE_WEBHOOK_SECRET',
         default: '',
      },
   },
});

config.getMongoURI = function () {
   const isEnvTest = this.get('env') === 'test';
   const testMongoURI = config.get('mongo').replace('mytour', 'mytour_test');
   return isEnvTest ? testMongoURI : this.get('mongo');
};

config.validate({ allowed: 'strict' });

module.exports = config;
