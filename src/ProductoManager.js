const fs = require("fs");

class ProductManager {
  constructor(path) {
    try {
      this.arreglo = [];
      this.path = path;
      if (!fs.existsSync(path)) {
        this.escribirJson().then(() => {
          console.log("Archivo Creado", this.arreglo);
        });
      } else {
        this.leerArchivo().then(() => {
          console.log(this.arreglo);
        });
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

  addProducts = async (title, description, price, thumbnail, code, stock) => {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Debe ingresar todos los parámetros");
        return;
      }

      let producto = {
        title: title,
        description: description,
        price: parseInt(price),
        thumbnail: thumbnail,
        code: code,
        stock: parseInt(stock),
      };

      let existe = false;

      this.arreglo.forEach((pro) => {
        if (pro.code === producto.code) {
          console.log("El code ya está registrado");
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  getProducts = async (limite = 0) => {
    try {
      await this.leerArchivo();

      if (isNaN(parseInt(limite))) {
        console.log('Ingrese un número válido');
        return "Ingrese un número válido";
      } else if (parseInt(limite) > this.arreglo.length || parseInt(limite) === 0) {
        console.log(this.arreglo);

        return this.arreglo;
      } else {
        console.log(this.arreglo);

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
      }else{
        return({
          Error: 'El ID ingresado no existe o no es válido'
        })
      }
    } catch (e) {
      console.log(e);
    }
  };

  deleteProduct = async (id = "") => {
    try {
      if (this.existeId(id)) {
        this.arreglo = this.arreglo.filter((pro) => pro.id != id);
        await this.escribirJson();

        console.log(this.arreglo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateProduct = async (id, nuevoProducto) => {
    try {
      if (this.existeId(id)) {
        if (typeof nuevoProducto != "object") {
          console.log("ingrese un producto en forma de objeto");
          return;
        }

        let producto = this.arreglo.filter((pro) => pro.id === id);

        this.arreglo[this.arreglo.indexOf(producto[0])] = {
          title: nuevoProducto.title ?? producto[0].title,
          description: nuevoProducto.description ?? producto[0].description,
          price: nuevoProducto.price ?? producto[0].price,
          thumbnail: nuevoProducto.thumbnail ?? producto[0].thumbnail,
          code: nuevoProducto.code ?? producto[0].code,
          stock: nuevoProducto.stock ?? producto[0].stock,
          id: id,
        };

        await this.escribirJson();
      }
    } catch (e) {
      console.log(e);
    }
  };

  existeId = (id) => {
    if (id === "") {
      console.log("Ingrese un ID");
      return false;
    }

    id = parseInt(id);
    if (isNaN(id)) {
      console.log("Ingrese ID válido");
      return false;
    }

    let producto = this.arreglo.filter((pro) => pro.id === id);

    if (producto[0] === undefined) {
      console.log("Not found");
      return false;
    } else {
      return true;
    }
  };
}



module.exports.ProductManager = ProductManager;
