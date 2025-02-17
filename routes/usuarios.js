const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { mailContacto } = require('../controllers/usuario');

const router=Router();

router.post('/mailContacto', [
    check('nomapel','el campo es obligatorio').not().isEmpty(),
    check('telefono','Telefono invalido').isMobilePhone(),
    validarCampos,
], mailContacto);

module.exports=router;