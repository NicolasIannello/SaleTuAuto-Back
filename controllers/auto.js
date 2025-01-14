const Auto = require("../models/auto");
const Imagen = require("../models/imagen");
const { response }=require('express');
const path=require('path');
const fs=require('fs');

const getAutos= async(req,res = response) =>{
    const desde= parseInt(req.query.desde) || 0;
    const limit= parseInt(req.query.limit) || 20;
    const orden= parseInt(req.query.orden) || 1;
    const order= req.query.order || '_id';
    var sortOperator = { "$sort": { } };
    sortOperator["$sort"][order] = orden;
    var matchMarca = { "$match": { } };
    matchMarca['$match']['marca'] = req.query.marca ? req.query.marca : { $exists: true }
    var matchModelo = { "$match": { } };
    matchModelo['$match']['modelo'] = req.query.modelo ? req.query.modelo : { $exists: true }
    var matchVersion = { "$match": { } };
    matchVersion['$match']['version'] = req.query.version ? req.query.version : { $exists: true }
    var matchAno = { "$match": { } };
    matchAno['$match']['ano'] = req.query.ano ? parseInt(req.query.ano) : { $exists: true }
    var matchKmMenorK = { "$match": { } };
    matchKmMenorK['$match']['kms'] = { $lte: req.query.mayorR!=undefined ? parseInt(req.query.mayorR) : { $exists: true }  }; 
    var matchKmMayorK = { "$match": { } };
    matchKmMayorK['$match']['kms'] = { $gte: req.query.menorR!=undefined ? parseInt(req.query.menorR) : { $exists: true } }; 
    if(!req.query.mayorR || !req.query.menorR){
        matchKmMenorK=matchMarca
        matchKmMayorK=matchMarca
    }
    var matchKmMenorP = { "$match": { } };
    matchKmMenorP['$match']['precio'] = { $lte: req.query.mayorRP!=undefined ? parseInt(req.query.mayorRP) : { $exists: true }  }; 
    var matchKmMayorP = { "$match": { } };
    matchKmMayorP['$match']['precio'] = { $gte: req.query.menorRP!=undefined ? parseInt(req.query.menorRP) : { $exists: true } }; 
    if(!req.query.mayorRP || !req.query.menorRP){
        matchKmMenorP=matchMarca
        matchKmMayorP=matchMarca 
    }
    var matchUbicacion = { "$match": { "ubicacion": { "$regex": { }, "$options": "i" } } }
    matchUbicacion["$match"]["ubicacion"]["$regex"] = req.query.ubicacion ? req.query.ubicacion : '';

    const [ autos, total ]= await Promise.all([
        Auto.aggregate([
            matchMarca,matchModelo,matchVersion,matchAno,matchKmMenorK,matchKmMayorK,matchKmMenorP,matchKmMayorP,matchUbicacion,
            { $project: {
                __v: 0,
            } },
            { $lookup: {
                from: "imagens",
                localField: "uuid",
                foreignField: "uuid_auto",
                "pipeline": [ { "$sort" : { "orden" : 1 } }, { "$limit" : 1 } ],
                as: "img"
            } },
            {$unwind: { path: "$img", preserveNullAndEmptyArrays: true }},
            { $project: { __v: 0, "img.__v": 0, "img._id": 0, "img.uuid_auto": 0, "img.orden": 0 } },
            sortOperator,
            { $skip: desde },
            { $limit: limit },
        ]).collation({locale: 'en'}),
        Auto.countDocuments()
    ]); 

    const mayor = await Auto.find().sort({kms:-1}).limit(1)
    const menor = await Auto.find().sort({kms:1}).limit(1)

    const mayorp = await Auto.find().sort({precio:-1}).limit(1)
    const menorp = await Auto.find().sort({precio:1}).limit(1)

    res.json({
        ok:true,
        autos,
        mayorkm: mayor[0].kms,
        menorkm: menor[0].kms,
        mayorp: mayorp[0].precio,
        menorp: menorp[0].precio,
        total
    });
};

const auto= async(req,res = response) =>{    
    const auto = await Auto.aggregate([
        { "$match": { uuid:req.body.uuid } },
        { $project: { __v: 0, '_id':0 } },
        { $lookup: {
            from: "imagens",
            localField: "uuid",
            foreignField: "uuid_auto",
            "pipeline": [ { "$sort" : { "orden" : 1 } } ],
            as: "img"
        } },
        { $project: { __v: 0, "img.__v": 0, "img._id": 0, "img.uuid_auto": 0, } },
    ]).collation({locale: 'en'})

    res.json({
        ok:true,
        auto
    });
};

const getArchivo= async(req,res = response) =>{
    const img=req.query.img;
    const tipo=req.query.tipo;
    let pathImg;
    if(tipo=='autos') {
        const imagenesDB= await Imagen.find({img});
        if(imagenesDB.length>0){
            pathImg=pathImg= path.join( __dirname, '../files/autos/'+imagenesDB[0].img);
        }else{
            pathImg=pathImg= path.join( __dirname, '../files/autos/'+imagenesDB.img);
        }
    }

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg= path.join( __dirname, '../files/no-img.jpg');
        res.sendFile(pathImg);
    }
};

const datos= async(req,res = response) =>{
    let datos;
    switch (req.body.dato) {
        case 'modelo':
            datos = await Auto.distinct("modelo", {"marca":req.body.marca});
            break;
        case 'version':
            datos = await Auto.distinct("version", {$and:[{"marca":req.body.marca}, {"modelo":req.body.modelo}]});
            break;
        default:
            datos = await Auto.distinct(req.body.dato);                
            break;
    }

    res.json({
        ok:true,
        datos
    });
};

module.exports={ getAutos, auto, getArchivo, datos }