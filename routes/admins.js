const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { login, renewToken, crearAdmin, getAdmins } = require('../controllers/admin');

const router=Router();

router.post('/login', [
    check('user','el campo es obligatorio').not().isEmpty(),
    check('pass','el campo es obligatorio').not().isEmpty(),
    validarCampos
],login);

router.post('/renew', validarJWT, renewToken);

router.post('/crearAdmin', [
    check('token','el campo es obligatorio').not().isEmpty(),
    check('usuario','el campo es obligatorio').not().isEmpty(),
    check('pass','el campo es obligatorio').not().isEmpty(),
    check('usuarios','el campo es obligatorio').not().isEmpty(),
    check('autos','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], crearAdmin);

router.post('/admins', [
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], getAdmins);

module.exports=router;