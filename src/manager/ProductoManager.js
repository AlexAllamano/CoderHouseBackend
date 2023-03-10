import fs from "fs";

export default class ProductManager {
  constructor(path) {
    try {
      this.arreglo = [];
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

  leerArchivo = async () => {
    this.arreglo = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  };

  escribirJson = async () => {
    await fs.promises.writeFile(this.path, JSON.stringify(this.arreglo));
  };

  addProducts = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true
  ) => {
    try {
      if (!title || !description || !price || !code || !stock) {
        return;
      }

      let producto = {
        title: title,
        description: description,
        price: parseInt(price),
        thumbnail: thumbnail,
        code: code,
        stock: parseInt(stock),
        status: true,
      };

      let existe = false;

      this.arreglo.forEach((pro) => {
        if (pro.code === producto.code) {
          existe = true;
        }
      });

      if (!existe) {
        producto.id = this.arreglo.length + 1;

        this.arreglo.forEach((item) => {
          while (item.id === producto.id) {
            producto.id++;
          }
        });

        this.arreglo.push(producto);
        await this.escribirJson();
        return { Mensaje: "Producto agregado", Producto: producto };
      }
    } catch (e) {
      console.log(e);
    }
  };

  getProducts = async (limite = 0) => {
    try {
      await this.leerArchivo();

      if (isNaN(parseInt(limite))) {
        return { Error: "Ingrese un número válido" };
      } else if (
        parseInt(limite) > this.arreglo.length ||
        parseInt(limite) === 0
      ) {
        return  this.arreglo ;
      } else {
        return this.arreglo.splice(0, limite);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getProductsById = async (id = "") => {
    try {
      await this.leerArchivo();
      if (this.existeId(id)) {
        return this.arreglo.filter((pro) => pro.id === id);
      } else {
        return undefined;
      }
    } catch (e) {
      console.log(e);
    }
  };

  deleteProduct = async (id = "") => {
    try {
      if (this.existeId(id)) {
        this.arreglo = this.arreglo.filter((pro) => pro.id !== id);
        await this.escribirJson();
        return { Mensaje: "Producto borrado" };
      } else {
        return { Error: "Producto no encontrado" };
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateProduct = async (id, nuevoProducto) => {
    try {


      if (this.existeId(id)) {
        if (typeof nuevoProducto != "object") {
          return;
        }

        let producto = this.arreglo.filter((pro) => pro.id.toString() === id.toString());
        console.log(producto, 'PRODUCTO')

        this.arreglo[this.arreglo.indexOf(producto[0])] = {
          title: nuevoProducto.title ?? producto[0].title,
          description: nuevoProducto.description ?? producto[0].description,
          price: nuevoProducto.price ?? producto[0].price,
          thumbnail: nuevoProducto.thumbnail ?? producto[0].thumbnail,
          code: nuevoProducto.code ?? producto[0].code,
          stock: nuevoProducto.stock ?? producto[0].stock,
          status: nuevoProducto.status ?? producto[0].status,
          id: id,
        };

        await this.escribirJson();
        return { Mensaje: "Producto actualizado" };
      } else {
        return { Error: "Producto no encontrado" };
      }
    } catch (e) {
      console.log(e);
    }
  };

  existeId = (id) => {
    if (id === "") {
      return false;
    }

    id = parseInt(id);
    if (isNaN(id)) {
      return false;
    }

    let producto = this.arreglo.filter(
      (pro) => pro.id.toString() === id.toString()
    );

    if (producto[0] === undefined) {
      return false;
    } else {
      return true;
    }
  };
}
