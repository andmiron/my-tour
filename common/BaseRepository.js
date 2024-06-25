class BaseRepository {
   constructor(model) {
      this.model = model;
   }

   async create(fields) {
      return new this.model(fields);
   }

   async createAndSave(fields) {
      return this.model.create(fields);
   }

   async getOne(filter) {
      return this.model.findOne(filter);
   }

   async getOneById(id) {
      return this.model.findById(id);
   }

   async getMany(fields) {
      return this.model.find(fields);
   }

   async getOneAndUpdate(filter, update) {
      return this.model.findOneAndUpdate(filter, update);
   }

   async getOneByIdAndUpdate(id, update) {
      return this.model.findByIdAndUpdate(id, update);
   }

   async deleteOne(filter) {
      return this.model.deleteOne(filter);
   }

   async deleteMany(filter) {
      return this.model.deleteMany(filter);
   }
}

module.exports = BaseRepository;
