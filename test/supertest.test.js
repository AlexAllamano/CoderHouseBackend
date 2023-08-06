import supertest from "supertest";
import { expect } from "chai";

describe("Test de supertest", function () {
  const requester = supertest("");

  describe("Test de Productos", () => {
    let productoId = "";

    after(async () => {
      if (productoId !== "") {
        await requester.delete(`/api/product/${productoId}`);
      }
    });

    it("POST /api/product debe crear un nuevo producto", async () => {
      const mockProductos = {
        tittle: "Producto de Test",
        description: "Descripcion de Test",
        price: 100,
        code: "1234",
        stock: 100,
      };

      const { ok, _body } = await requester
        .post("/api/product")
        .send(mockProductos);
      expect(ok).to.be.true;
      productoId = _body.producto._id;
      expect(_body).to.have.property("producto");
    }),
      it("GET /api/product traer una lista de productos", async () => {
        const { ok, _body } = await requester.get("/api/product");
        expect(ok).to.be.true;
        let product = _body.payload[0];

        expect(_body).to.have.property("totalPages").that.is.a("number");
        expect(product).to.have.property("_id").that.is.a("string");
        expect(product).to.have.property("tittle").that.is.a("string");
        expect(product).to.have.property("price").that.is.a("number");
      });
  });

  describe("Test de Carrito", () => {
    let carritoId = "";

    after(async () => {
      if (carritoId !== "") {
        await requester.delete(`/api/cart/${carritoId}`);
      }
    });

    it("POST /api/cart debe crear un nuevo carrito", async () => {
      const { ok, _body } = await requester.post("/api/cart");
      expect(ok).to.be.true;

      expect(_body).to.have.property("carritoNuevo");
      expect(_body.carritoNuevo).to.have.property("_id").that.is.a("string");
    }),
    it("GET /api/cart traer una lista de carritos", async () => {
    const { ok, _body } = await requester.get(
        "/api/cart/64a77aaef4a1b63a7dc881d2"
    );
    expect(ok).to.be.true;
    
    expect(_body).to.have.property("carrito");
    expect(_body.carrito).to.have.property("_id").that.is.a("string");
    expect(_body.carrito).to.have.property("products").that.is.a("array");
    
    });
  });
});
