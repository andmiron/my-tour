const mongoose = require('mongoose');
const argon = require('argon2');

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      unique: true,
      required: [true, 'Username is required!'],
      lowercase: true,
   },
   password: {
      type: String,
      required: [true, 'Password is required!'],
      select: false,
   },
   photo: {
      type: String,
      default: 'default.jpg',
   },
   role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
   },
});

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   this.password = await argon.hash(this.password);
   next();
});

userSchema.methods.isValidPassword = async function (userPassword, givenPassword) {
   return argon.verify(userPassword, givenPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
