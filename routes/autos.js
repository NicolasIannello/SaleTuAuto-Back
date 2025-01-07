const { Router }=require('express');
const { getAutos } = require('../controllers/auto');

const router=Router();

router.post('/autos', [], getAutos);

module.exports=router;