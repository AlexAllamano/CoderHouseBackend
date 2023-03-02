import fs from "fs";
import ProductManager from "./ProductoManager.js";

export default class CartManager {
  constructor(path) {
    try {
      this.prodManag = new ProductManager("src/database/productos.json");

      this.carritos = [];
      this.path = path;
      if (!fs.existsSync(path)) {
        this.escribirJson().then(() => {});
      } else {
        this.leerArchivo().then(() => {});
      }
    } catch (e) {
      console.log(e);
    }
  }

  addCart = async () => {
    try {
      const carrito = {
        id: this.carritos.length + 1,
        products: [],
      };

      this.carritos.push(carrito);

      await this.escribirJson();
      return('Carrito creado con ID ' + carrito.id );
    } catch (e) {
      console.log(e);
    }
  };

  getCartById = async (id = "") => {
    try {
      await this.leerArchivo();
      if (this.existeId(id)) {
        const cart = this.carritos.filter(
          (pro) => pro.id.toString() === id.toString()
        );
        return cart;
      } else {
        return {
          Error: "El CID ingresado no existe o no es válido",
        };
      }
    } catch (e) {
      console.log(e);
    }
  };

  postProductPorCart = async (cId = "", pId = "") => {
    try {
      const producto = await this.prodManag.getProductsById(pId);

      if (producto == undefined) {
        return({
          Error: 'Producto no encotrado'
        });
      }

      if (this.existeId(cId)) {
        let bandera = true;
        const cart = this.carritos.filter((cart) => cart.id === cId);


        cart[0].products.forEach((item) => {
          if (item.product === producto[0].id) {
            bandera = false;
            item.quantity++;
          }
        });

        if (bandera) {
          cart[0].products.push({
            product: producto[0].id,
            quantity: 1,
          });
        }

        await this.escribirJson();

        return({
          Mensaje: 'Producto agregado',
          ProductosDelCarrito: cart[0].products
        })
      } else {
        return {
          Error: "El CID ingresado no existe o no es válido",
        };
      }
    } catch (e) {
      console.log(e);
    }
  };

  leerArchivo = async () => {
    this.carritos = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  };

  escribirJson = async () => {
    await fs.promises.writeFile(this.path, JSON.stringify(this.carritos));
  };

  existeId = (id) => {
    if (id === "") {
      return false;
    }

    id = parseInt(id);
    if (isNaN(id)) {
      return false;
    }

    const cart = this.carritos.filter((cart) => cart.id === id);

    if (cart[0] === undefined) {
      return false;
    } else {
      return true;
    }
  };
}
