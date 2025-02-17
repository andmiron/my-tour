const crypto = require('node:crypto');
const mongoose = require('mongoose');
const argon = require('argon2');

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
         minLength: 6,
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
         default: 'https://my-tour-app.s3.eu-north-1.amazonaws.com/default_user.jpg',
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
      },
      bookings: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'Booking',
         },
      ],
      tours: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
         },
      ],
      reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
   },
   { timestamps: true },
);

userSchema.pre('save', async function (next) {
   if (this.isModified('password')) this.password = await argon.hash(this.password);
   next();
});

userSchema.methods.isPasswordValid = async function (password) {
   return argon.verify(this.password, password);
};

userSchema.methods.createResetToken = function () {
   const hashData = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken = crypto.createHash('sha256').update(hashData).digest('hex');
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   return hashData;
};

userSchema.statics.deleteUser = async function (userId) {
   const session = await mongoose.startSession();
   const ownerId = userId;
   session.startTransaction();
   try {
      await mongoose.model('Tour').deleteMany({ ownerId }, { session });
      await mongoose.model('Review').deleteMany({ ownerId }, { session });
      await mongoose.model('Booking').deleteMany({ ownerId }, { session });
      await this.findByIdAndDelete(userId, { session });
      await session.commitTransaction();
   } catch (err) {
      await session.abortTransaction();
   } finally {
      await session.endSession();
   }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
