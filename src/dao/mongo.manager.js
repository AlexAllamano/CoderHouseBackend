export class MongoManager {
  constructor(model) {
    this.model = model;
  }

  async getAllProducts(limite, page, sort, query) {
    try {

      console.log(limite);
      console.log(page);
      console.log(sort);
      console.log(query);

      const arreglo = [];

      if (limite != 0 && limite != undefined) {
        arreglo.push({
          $limit: limite,
        });
      }

      if (sort == "desc" && sort != undefined) {
        arreglo.push({
          $sort: {
            price: -1,
          },
        });
      } else if (sort == "asc" && sort != undefined) {
        arreglo.push({
          $sort: {
            price: 1,
          },
        });
      }

      let productos = [];

      if(arreglo.length == 0){
        productos = await this.model.find().lean();

      }else{
        productos = await this.model.aggregate(arreglo);
      }

      return productos;

    } catch (e) {
      throw e;
    }
  }

  async getAll() {
    try {
      const entidades = await this.model.find().lean();
      return entidades;
    } catch (e) {
      throw e;
    }
  }

  async findOneCart(id) {
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await this.model
          .findOne({ _id: id })
          .populate("products.product")
          .lean();
        return cart;
      } else {
        return { Error: "Id no encontrado" };
      }
    } catch (e) {
      throw e;
    }
  }

  async getById(id) {
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const newEntity = await this.model.findById({ _id: id });
        return newEntity;
      } else {
        return { Error: "Id no encontrado" };
      }
    } catch (error) {
      console.log(error);
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
      const newEntity = await this.model.updateOne({ _id: id }, entidad);
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
