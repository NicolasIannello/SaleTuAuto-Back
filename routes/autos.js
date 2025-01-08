const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getAutos, auto, getArchivo } = require('../controllers/auto');

const router=Router();

router.post('/autos', [], getAutos);

router.post('/auto', [
    check('uuid','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], auto);

router.get('/img', getArchivo);

module.exports=router;