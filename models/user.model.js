const crypto = require('node:crypto');
const mongoose = require('mongoose');
const argon = require('argon2');
const { faker } = require('@faker-js/faker');

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         unique: true,
         required: [true, 'Email is required!'],
         lowercase: true,
      },
      password: {
         type: String,
         required: [() => this.provider === 'local', 'Password is required!'],
         select: false,
      },
      passwordResetToken: {
         type: String,
         select: false,
      },
      passwordResetExpires: {
         type: Number,
         select: false,
      },
      provider: {
         type: String,
         enum: ['local', 'google'],
         default: 'local',
      },
      photo: {
         type: String,
         default: () => faker.image.avatarLegacy({}),
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
      },
   },
   { timestamps: true },
);

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   this.password = await argon.hash(this.password);
   next();
});

userSchema.methods.isValidPassword = async function (validPassword, givenPassword) {
   return argon.verify(validPassword, givenPassword);
};

userSchema.methods.createResetToken = function () {
   const hashData = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken = crypto.createHash('sha256').update(hashData).digest('hex');
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   return hashData;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
