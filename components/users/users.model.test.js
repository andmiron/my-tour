const mongoose = require('mongoose');
const User = require('./users.model');
const Tour = require('../tours/tours.model');
const Review = require('../reviews/reviews.model');
const Booking = require('../bookings/bookings.model');
const config = require('../../config/config');

describe('User model', () => {
   let mongoServer;

   beforeAll(async () => {
      await mongoose.connect(config.get('mongo'));
      mongoServer = mongoose.connection;
   });

   afterEach(async () => {
      await User.deleteMany({});
   });

   afterAll(async () => {
      await mongoServer.destroy();
   });

   describe('Model field validation', () => {
      it('should create a new user successfully', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };
         const user = new User(userData);
         const newUser = await user.save();

         expect(newUser.id).toBeDefined();
         expect(newUser.email).toBe(userData.email);
         expect(newUser.provider).toBe('local');
         expect(newUser.role).toBe('user');
      });

      it('should throw if required parameter is missing', async () => {
         const userWithoutEmail = new User({ password: 'test123' });
         const userWithoutPassword = new User({ email: 'test@test.com' });

         await expect(userWithoutEmail.save()).rejects.toThrow();
         await expect(userWithoutPassword.save()).rejects.toThrow();
      });

      it('should validate email address', async () => {
         const userData = {
            email: 'invalid.com.com',
            password: 'test123',
         };
         const user = new User(userData);
         await expect(user.save()).rejects.toThrow();
      });

      it('should throw if email already exists', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };

         await User.create(userData);
         const duplicateUser = new User(userData);
         await expect(duplicateUser.save()).rejects.toThrow();
      });

      it('should validate password minimum length', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test',
         };

         const user = new User(userData);
         await expect(user.save()).rejects.toThrow();
      });
   });

   describe('Password hashing', () => {
      it('should hash the password before saving the user', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };

         const user = await User.create(userData);
         const savedUser = await User.findById(user.id).select('+password');
         expect(savedUser.password).not.toBe(userData.pasword);
      });

      it('should exclude password when querying a user', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };
         await User.create(userData);
         const user = await User.findOne({ email: 'test@test.com' });

         expect(user.password).not.toBeDefined();
      });

      it('should check if the password hash is valid', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };
         const user = await User.create(userData);
         const isPasswordValid = await user.isPasswordValid(userData.password);

         expect(isPasswordValid).toBe(true);
      });
   });

   describe('Password reset', () => {
      it('should create a password reset token along with expiry date', async () => {
         const userData = {
            email: 'test@test.com',
            password: 'test123',
         };

         const user = await User.create(userData);
         await user.createResetToken();
         expect(user.passwordResetToken).toBeDefined();
         expect(user.passwordResetExpires).toBeDefined();
      });
   });

   it('should delete user along with all related tours and reviews', async () => {
      const userData = {
         email: 'test@test.com',
         password: 'test123',
      };
      const user = await User.create(userData);
      const deletedUser = await User.deleteUser(user.id);
      const userNotFound = await User.findById(user.id);

      expect(deletedUser.email).toBe(userData.email);
      expect(userNotFound).toBeNull();
   });
});
