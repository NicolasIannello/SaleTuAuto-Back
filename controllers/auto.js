const Auto = require("../models/auto");
const { response }=require('express');

const getAutos= async(req,res = response) =>{
    const desde= parseInt(req.query.desde) || 0;
    const limit= parseInt(req.query.limit) || 20;
    const orden= parseInt(req.query.orden) || 1;
    const order= req.query.order || '_id';
    var sortOperator = { "$sort": { } };
    sortOperator["$sort"][order] = orden;

    const [ autos, total ]= await Promise.all([
        Auto.aggregate([
            { $project: {
                __v: 0,
            } },
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

module.exports={ getAutos }