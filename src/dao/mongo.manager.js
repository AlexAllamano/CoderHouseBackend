export class MongoManager {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
      const entidades = await this.model.find().lean();
      return entidades;
    } catch (e) {
      throw e;
    }
  }

  async getById(id) {
    try {
      const newEntity = await this.model.findById({ _id: id });
      return newEntity;
    } catch (error) {
      throw error;
    }
  }

  async create(entity) {
    try {
      const newEntity = await this.model.create(entity);
      return newEntity;
    } catch (error) {
      throw error;
      
    }
  }

  async updateOne(id, entidad) {
    try {
      const newEntity = await this.model.updateOne({_id:id}, entidad);
      return newEntity;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id) {
    try {
      const newEntity = await this.model.deleteOne({ _id: id });
      return newEntity;
    } catch (error) {
      throw error;
    }
  }
}
