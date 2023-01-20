const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./key');
const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('CONEXION CON LA BASE DE DATOS PERDIDA');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('LA BASE DE DATOS TIENE MUCHAS CONEXIONES');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('CONEXION CON LA BASE DE DATOS RECHAZADA');
        }
    }
    if (connection) connection.release();
    console.log('Conexión con la base de datos: OK');
    return;
});
pool.query = promisify(pool.query);
module.exports = pool;