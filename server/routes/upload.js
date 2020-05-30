const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const Usuario = require('../models/usuario');
const Producto = require(`../models/producto`);

const fs = require('fs');
const path = require('path');

// default Options
app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', function(req, res) {
    
    let tipo = req.params.tipo;
    let id = req.params.id;
    
    // Si no hay ningún archivo
    if(!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Validar tipo 
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(' ,')
            }
        })
    }

    // Si viene un archivo
    // Ej: El nombre del input es archivo (En postman sería el key)
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');    
    let extension = nombreCortado[nombreCortado.length - 1];
    
    console.log(extension);

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(' ,'),
                ext: extension
            }
        })
    }   

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    // Usamos mv() para mover el archivo al directorio con el nombre que querramos
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui, imagen cargada
        if(tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }

        if(tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });

    })

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        
        if(err) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        // Actualizamos la imagen
        usuarioDB.img = nombreArchivo;
        
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        });
    })

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if(err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        // Actualizamos la imagen
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        })


    })

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;   