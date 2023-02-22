const express = require('express');
const modulo = require('./ProductoManager');
let PM = new modulo.ProductManager('./data/prueba.json');


const app = express();
const port = 8080;
app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) =>{

    limite = req.query.limit;

    res.send( await PM.getProducts(limite));
})

app.get('/products/:pid', async (req, res) =>{
    console.log(parseInt(req.params.pid), 'ID QUE ME LLEGA')
    res.send(await PM.getProductsById(parseInt(req.params.pid)))
})

app.listen(port, () =>{
    console.log('Escuchando server')
})