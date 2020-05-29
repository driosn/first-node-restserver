const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .populate('usuario', 'nombre email') // Siempre se muestra el _id, eso no se puede controlar    
        .exec((err, categorias) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                Categoria.count({}, (err, cantidad) => {
                    res.json({
                        ok: true,
                        categorias,
                        cuantos: cantidad
                    });
                })
        
            });

})


// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById({_id: id}, (err, categoriaDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});


// ============================
// Crear nueva categoria
// ============================
// regresa la nueva categoria
app.post('/categoria', verificaToken, function(req, res) {

    console.log('entro');

    let body = req.body;
    let usuarioId = req.usuario._id;  // Es _id porque es el id de la db

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioId
    });

    categoria.save((err, categoriaDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } 
          
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});



// ============================
// Actualizar categoria por ID
// ============================
app.put('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, {descripcion: body.descripcion}, {new: true, runValidators: true}, (err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ============================
// Borrar categoria por ID
// ============================
// (Solo 1 administrador puede borrar categorias, pedir token)
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'EL id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });

});

module.exports = app;