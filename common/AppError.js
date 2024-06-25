class AppError extends Error {
   constructor(code, message) {
      super(message);
      this.code = code;
   }

   static badRequest(message) {
      return new AppError(400, message);
   }

   static unauthorized(message) {
      return new AppError(401, message);
   }

   static forbidden(message) {
      return new AppError(403, message);
   }

   static notFound(message) {
      return new AppError(404, message);
   }

   static internal(message) {
      return new AppError(500, message);
   }
}

module.exports = AppError;
