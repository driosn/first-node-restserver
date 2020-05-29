const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ========================
// Obtener productos
// ========================
app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos 
    // populate: usuario, categoria
    // paginado

    let page = req.query.page || 0;

    Producto.find({})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .limit(5)
            .skip(page)
            .exec((err, productosDB) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({}, (err, cantidad) => {
                    return res.json({
                        ok: true,
                        productos: productosDB,
                        cantidad
                    });
                })
            });
});

// ========================
// Obtener un producto por id
// ========================
app.get('/producto/:id', verificaToken, (req, res) => {
    // Trae usuario por id 
    // populate: usuario, categoria
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario')
            .populate('categoria')
            .exec((err, productoDB) => {
                
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if(!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No existe el producto con ese id'
                        }
                    });
                }

                return res.json({
                    ok: true,
                    producto: productoDB
                });

            })
});

// ==========================
// Buscar producto por nombre
// ==========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    // Trae todos los productos 
    // populate: usuario, categoria
    // paginado

    let page = req.query.page || 0;
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .limit(5)
            .skip(page)
            .exec((err, productosDB) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({nombre: regex}, (err, cantidad) => {
                    return res.json({
                        ok: true,
                        productos: productosDB,
                        cantidad
                    });
                })
            });
});

// ========================
// Crear un nuevo producto
// ========================
app.post('/producto', verificaToken, (req, res) => {
    // Grabar el usuario 
    // grabar una categoria del listado
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Hubo un error al guardar el producto'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    })
});

// ========================
// Actualizar un nuevo producto
// ========================
app.put('/producto/:id', verificaToken, (req, res) => {
    // Grabar el usuario 
    // grabar una categoria del listado
    let id = req.params.id;
    
    let nuevoProducto = {
        nombre: req.body.nombre,
        // precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        // categoria: req.body.categoria,
    };

    Producto.findByIdAndUpdate(id, nuevoProducto, {new: true, runValidators: true}, (err, productoDB) => {

        if(err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// ========================
// Borrar un producto
// ========================
app.delete('/producto/:id', (req, res) => {
    // En vez de borrarlo físicamente, simplemente deshabilitar el producto 
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true}, (err, productoDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });

});

module.exports = app;