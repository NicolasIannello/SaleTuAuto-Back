const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getAutos, auto, getArchivo, marcas, modelos, versiones } = require('../controllers/auto');

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

router.post('/marcas', marcas);

router.post('/modelos', [
    check('marca','el campo es obligatorio').not().isEmpty(),
    validarCampos,
], modelos);

router.post('/versiones', [
    check('marca','el campo es obligatorio').not().isEmpty(),
    check('modelo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
], versiones);

module.exports=router;