import { Faker, en, es, base } from "@faker-js/faker";

const faker = new Faker({
  locale: [en, es, base],
});
class MockingService {

   

  generarProducto() {

    const categories = ["Electrónica", "Ropa", "Hogar", "Deportes", "Juguetes"];
    try {
      const producto = {
        _id: faker.string.uuid(),
        titulo: faker.commerce.product(),
        descripcion: faker.commerce.productDescription(),
        precio: faker.commerce.price({ min: 100, max: 200 }),
        code: faker.string.alphanumeric(6),
        categoria: faker.helpers.arrayElement(categories),
        stock: faker.datatype.boolean(0.5)
          ? faker.number.int({ min: 1, max: 50 })
          : 0,
        estado: faker.datatype.boolean(0.5)
      };


      return producto;
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
}

export default MockingService;
