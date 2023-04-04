import { Router } from "express";
import manager from "../dao/carts.manager.js";
import productsManager from "../dao/productos.manager.js";

const route = Router();

//obtener un carrito con los productos desglosados
route.get("/:cid", async (req, res, next) => {
  try {
    let cid = req.params.cid;

    res.status(200).send({ carrito: await manager.getById(cid) });
  } catch (e) {
    next(e);
  }
});

//agregar un carrito con productos vacios
route.post("", async (req, res, next) => {
  try {
    res.status(200).send({ carritoNuevo: await manager.save() });
  } catch (e) {
    next(e);
  }
});

//cargar un producto a un carrito, solo 1. Agregar 1 si ya existe
route.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    //validaciones
    let bandera = true;
    let todoOk = true;
    let mensajeError = "";
    const cid = req.params.cid;
    const pid = req.params.pid;

    //busco produto y carrito por id
    const producto = await productsManager.getById(pid);
    let carrito = await manager.getById(cid);

    //valido que existan
    if (carrito.Error) {
      mensajeError += "Carrito no encontrado. ";
      todoOk = false;
    }
    if (producto.Error) {
      mensajeError += "Producto no encontrado. ";
      todoOk = false;
    }

    //si existen ambos....
    if (todoOk) {
      carrito.products.forEach((item) => {
        if (item.product._id.toString() == producto._id.toString()) {
          bandera = false;
          item.quantity++;
        }
      });

      if (bandera) {
        carrito.products.push({
          product: producto._id.toString(),
          quantity: 1,
        });
      }
      await manager.updateOne(cid, carrito);
      res
        .status(200)
        .send({ mensaje: "Carrito actualizado", carrito: carrito });
    } else {
      res.status(200).send({ Error: mensajeError });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//modificar los productos del carrito a partir de un array
//Formato:
// [{
//   product: String,
//   quantity: number
// }]
route.put("/:cid", async (req, res, next) => {
  try {
    let bandera = false;
    let mensaje = "";
    const productos = req.body;
    const cid = req.params.cid;

    //busco carrito por id
    let carrito = await manager.getById(cid);

    //valido que existan
    if (carrito.Error) {
      res.status(200).send({ Error: "Carrito no encontrado. " });
    }

    for (const item of productos) {
      let producto = await productsManager.getById(item.product);
      if (producto.Error) {
        mensaje += `, ${item.product}`;
        bandera = true;
      }
    }

    if (bandera) {
      res.status(200).send({
        Mensaje: `El producto(s) con el id(s)${mensaje} no existe(n), cancelando...`,
      });
    }

    carrito.products = productos;

    console.log(carrito);

    await manager.updateOne(cid, carrito);
    res.status(200).send({ mensaje: "Carrito actualizado", carrito: carrito });
  } catch (e) {
    next(e);
  }
});

//modificar la cantidad de un producto especificado
//Formato:
// {
//   quantity: number
// }
route.put("/:cid/product/:pid", async (req, res, next) => {
  try {
    //validaciones
    let bandera = true;
    let todoOk = true;
    let mensajeError = "";
    const cantidad = req.body;
    const cid = req.params.cid;
    const pid = req.params.pid;

    //busco produto y carrito por id
    const producto = await productsManager.getById(pid);
    let carrito = await manager.getById(cid);

    //valido que existan
    if (carrito.Error) {
      mensajeError += "Carrito no encontrado. ";
      todoOk = false;
    }
    if (producto.Error) {
      mensajeError += "Producto no encontrado. ";
      todoOk = false;
    }

    //si existen ambos....
    if (todoOk) {
      carrito.products.forEach((item) => {
        if (item.product._id.toString() == producto._id.toString()) {
          bandera = false;
          item.quantity = cantidad.quantity;
        }
      });

      if (bandera) {
        res.status(200).send({ Error: `El carrito no contiene el producto con id ${pid}` });
      } else {
        await manager.updateOne(cid, carrito);
        res.status(200).send({ mensaje: "Carrito actualizado", carrito: carrito });
      }
    } else {
      res.status(200).send({ Error: mensajeError });
    }
  } catch (e) {
    next(e);
  }
});

//borrar el producto seleccionado
route.delete("/:cid/product/:pid", async (req, res, next) => {
  try {
    //validaciones
    let todoOk = true;
    let mensajeError = "";
    const cid = req.params.cid;
    const pid = req.params.pid;

    //busco produto y carrito por id
    const producto = await productsManager.getById(pid);
    let carrito = await manager.getById(cid);

    //valido que existan
    if (carrito.Error) {
      mensajeError += "Carrito no encontrado. ";
      todoOk = false;
    }
    if (producto.Error) {
      mensajeError += "Producto no encontrado. ";
      todoOk = false;
    }

    //si existen ambos....
    if (todoOk) {
      carrito.products = carrito.products.filter(
        (item) => item.product._id.toString() != producto._id
      );
      await manager.updateOne(cid, carrito);
      res.status(200).send({ mensaje: "Producto eliminado", carrito: carrito });
    } else {
      res.status(200).send({ Error: mensajeError });
    }
  } catch (e) {
    next(e);
  }
});

//borrar todos los productos del carrito
route.delete("/:cid", async (req, res, next) => {
  try {
    const cid = req.params.cid;

    //busco carrito por id
    let carrito = await manager.getById(cid);

    //valido que existan
    if (carrito.Error) {
      res.status(200).send({ Error: "Carrito no encontrado. " });
    }

    carrito.products = [];

    await manager.updateOne(cid, carrito);
    res
      .status(200)
      .send({ mensaje: "Todos los producto eliminado", carrito: carrito });
  } catch (e) {
    next(e);
  }
});
export default route;
