// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// VENCIMIENTO DEL TOKEN
// 60 segundos
// 60 minutos 
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticacion
process.env.SEED_TOKEN = process.env.SEED_TOKEN  || 'este-es-el-seed-desarrollo';

// Conexion - BASE DE DATOS
let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ===========================
// Google Client ID
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1032783109057-qaolh77l964fi0cvhh1a2r7d4jn8g5tf.apps.googleusercontent.com';
