class BaseRepository {
   constructor(model) {
      this.model = model;
   }

   create(fields) {
      return new this.model(fields);
   }

   createAndSave(fields) {
      return this.model.create(fields);
   }

   getOne(filter) {
      return this.model.findOne(filter);
   }

   getOneById(id) {
      return this.model.findById(id);
   }

   getMany(filter) {
      return this.model.find(filter);
   }

   getOneAndUpdate(filter, update) {
      return this.model.findOneAndUpdate(filter, update);
   }

   getOneByIdAndUpdate(id, update) {
      return this.model.findByIdAndUpdate(id, update);
   }

   deleteOne(filter) {
      return this.model.deleteOne(filter);
   }

   deleteMany(filter) {
      return this.model.deleteMany(filter);
   }
}

module.exports = BaseRepository;
