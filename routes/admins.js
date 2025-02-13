const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { login, renewToken, crearAdmin, getAdmins, deleteUser, crearAuto, deleteAuto, actualizarAuto, actualizarTyC, getTyC, actualizarUser } = require('../controllers/admin');
const expressFileUpload =require('express-fileupload');

const router=Router();

router.use(expressFileUpload());

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

router.post('/deleteUser', [
    check('token','el campo es obligatorio').not().isEmpty(),
    check('id','el campo es obligatorio').isMongoId(),
    validarCampos,
    validarJWT
], deleteUser);

router.post('/crearAuto', [
    check('marca','el campo es obligatorio').not().isEmpty(),
    check('modelo','el campo es obligatorio').not().isEmpty(),
    check('version','el campo es obligatorio').not().isEmpty(),
    check('ano','el campo es obligatorio').not().isEmpty(),
    check('kms','el campo es obligatorio').not().isEmpty(),
    check('ubicacion','el campo es obligatorio').not().isEmpty(),
    check('transmision','el campo es obligatorio').not().isEmpty(),
    check('traccion','el campo es obligatorio').not().isEmpty(),
    check('precio','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], crearAuto);

router.post('/borrarAuto', [
    check('_id','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], deleteAuto);

router.post('/actualizarAuto', [
    check('auto','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], actualizarAuto);

router.post('/actualizarTyc', [
    check('tyc','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], actualizarTyC);

router.post('/tyc', getTyC);

router.post('/actualizarUser', [
    check('campos','el campo es obligatorio').not().isEmpty(),
    check('id','el campo es obligatorio').not().isEmpty(),
    check('token','el campo es obligatorio').not().isEmpty(),
    check('tipo','el campo es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], actualizarUser);

module.exports=router;