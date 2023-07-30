// import Assert from "assert";
// import productService from "../src/services/product.services.js";
// import mongoose from "mongoose";
// import data from "../src/data.js";

// const assert = Assert.strict;

// describe("Productos dao", function () {
//   before(async function () {
//     this.conection = await mongoose.connect(data.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     this.producto = new productService();
//   });

//   afterEach(async function () {
//   });

//   it("El DAO debe poder obtener todos los usuarios ", async function () {
//     const productos = await this.producto.paginate({}, {});
//     assert.equal(Array.isArray(productos.docs), true);
//   });
// });
