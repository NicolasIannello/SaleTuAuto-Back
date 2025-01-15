const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { mailContacto } = require('../controllers/usuario');

const router=Router();

router.post('/mailContacto', [
    check('uuid','el campo es obligatorio').not().isEmpty(),
    validarCampos,
], mailContacto);

module.exports=router;