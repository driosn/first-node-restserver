const jwt = require('jsonwebtoken');

// ====================
// Verificar Token
// ====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario =  decoded.usuario;
        next();
    });
};  

// ====================
// Verifica ADMIN_ROLE
// ====================
let verificaAdminRole = (req, res, next) => {

    //Como se ejecutara despues de verificaToken entonces podemos acceder al usuario
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "Solo ADMIN_ROLE puede realizar cambios en la base de datos"
            }
        })
    }

};

// ========================
// Verifica token en imagen
// ========================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;     

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario =  decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};