const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../database');
var piscina = 'EM01-E01';

//---------------------------------------------------------------------------------------Ruta inicial
router.get('/', async (req, res) => {
    let sacos = await pool.query('SELECT * FROM consumos WHERE piscina = ? AND fecha = CURDATE() ORDER BY timestamp DESC', [piscina]);
    let total = await pool.query('SELECT SUM(cantidad) AS total FROM consumos WHERE piscina = ? AND fecha = CURDATE()', [piscina]);
    total = total[0].total;
    console.log(sacos);
    res.render('layouts/index', { sacos, total });
});
router.post('/registro', async (req, res) => {
    const { codigoProducto } = req.body;
    let producto = await pool.query('SELECT * FROM productos WHERE codigo = ?', [codigoProducto]);
    if (producto.length > 0) {
        try {
            let newConsumo = {
                codigoProducto,
                descripcion: producto[0].descripcion,
                cantidad: producto[0].libras,
                piscina: piscina,
                fecha: new Date()
            };
            await pool.query('INSERT INTO consumos set ?', [newConsumo]);
            req.flash('message', 'Producto registrado');
            res.redirect('/');
        } catch (error) {
            console.log(error);
            req.flash('message', 'Error al registrar el producto');
            res.redirect('/');
        }
    } else {
        req.flash('message', 'Producto no encontrado');
        res.redirect('/');
    }
});
module.exports = router;