const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getAutos, auto, getArchivo, datos } = require('../controllers/auto');

const router=Router();

router.post('/autos', [], getAutos);

router.post('/auto', [
    check('uuid','el campo es obligatorio').not().isEmpty(),
    validarCampos,
], auto);

router.get('/img', getArchivo);

router.post('/datos', datos);

module.exports=router;