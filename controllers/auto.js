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
    var matchOperator = { "$match": { } };
    matchOperator['$match']['marca'] = req.query.marca ? req.query.marca : { $exists: true }
    var matchOperator2 = { "$match": { } };
    matchOperator2['$match']['modelo'] = req.query.modelo ? req.query.modelo : { $exists: true }
    var matchOperator3 = { "$match": { } };
    matchOperator3['$match']['version'] = req.query.version ? req.query.version : { $exists: true }

    const [ autos, total ]= await Promise.all([
        Auto.aggregate([
            matchOperator,matchOperator2,matchOperator3,
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
    
    res.json({
        ok:true,
        autos,
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

const marcas= async(req,res = response) =>{    
    const marcas = await Auto.distinct("marca");    

    res.json({
        ok:true,
        marcas
    });
};

const modelos= async(req,res = response) =>{    
    const modelos = await Auto.distinct("modelo", {"marca":req.body.marca});
    
    res.json({
        ok:true,
        modelos
    });
};

const versiones= async(req,res = response) =>{    
    const versiones = await Auto.distinct("version", {$and:[{"marca":req.body.marca}, {"modelo":req.body.modelo}]});
    
    res.json({
        ok:true,
        versiones
    });
};

module.exports={ getAutos, auto, getArchivo, marcas, modelos, versiones }