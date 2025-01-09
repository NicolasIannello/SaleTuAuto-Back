const { response }=require('express');
const { generarJWT } = require('../helpers/jwt');
const bcrypt=require('bcryptjs');
const Admin = require('../models/admin');
const { v4: uuidv4 }=require('uuid');
const Auto = require('../models/auto');
const { subirImagen, borrarImagen } = require('../helpers/imagenes');
const Imagen = require('../models/imagen');
const fs=require('fs');

const login=async(req,res=response)=>{
    const { user, pass }= req.body;
    try {        
        const adminDB= await Admin.findOne({usuario:user});    
        if(!adminDB){
            return res.status(404).json({
                ok:false,
                msg:'Datos incorrectos'
            })
        }

        const validPassword=bcrypt.compareSync(pass,adminDB.pass);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Datos incorrectos'
            })
        }

        const token= await generarJWT(adminDB.id,1);
        
        res.json({
            ok:true,
            token,
            user: adminDB.usuario
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error login'
        });
    }
}

const renewToken= async(req,res=response)=>{    
    const _id=req.uid;
    const token= await generarJWT(_id,1);
    const adminDB= await Admin.findById(_id)

    if(!adminDB){
        res.json({
            ok:false
        })
    }else{
        res.json({
            ok:true,
            token,
            user: adminDB.usuario,
        })
    }
}


const crearAdmin= async(req,res = response) =>{
    const {pass,usuario}=req.body;

    try {
        const adminDB= await Admin.findById(req.uid)
        if(!adminDB){
            res.json({
                ok:false
            })
        }else if(!adminDB.usuarios){
            res.json({
                ok:false
            })
        }

        const existeAdmin= await Admin.findOne({usuario});
        if(existeAdmin){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe una cuenta con usuario'
            });
        }

        const admin= new Admin(req.body);

        const salt=bcrypt.genSaltSync();
        admin.pass=bcrypt.hashSync(pass,salt);
        admin.uuid=uuidv4();
        await admin.save();

        res.json({
            ok:true,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const getAdmins= async(req,res = response) =>{
    try {
        const adminDB= await Admin.findById(req.uid)
        if(!adminDB){
            res.json({
                ok:false
            })
        }

        const [ admins, total ]= await Promise.all([
            Admin.aggregate([
                { $project: {
                    __v: 0,
                    "__v": 0,
                    "pass": 0,
                } },
            ]),
            Admin.countDocuments()
        ]); 

        res.json({
            ok:true,
            admins,
            total
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const deleteUser=async(req,res=response) =>{
    const id=req.body.id;
    const tipo=req.body.user;
    try {        
        const adminDB= await Admin.findById(req.uid)

        if(!adminDB){
            res.json({
                ok:false
            })
        }else if(!adminDB.usuarios){
            res.json({
                ok:false
            })
        }
        
        // if(tipo=="user"){
        //     const user= await Usuario.findById(id);
        //     if(user.tipo=='emp'){
        //         await Empresa.deleteMany({'mail': { $eq: user.mail}})
        //     }
        //     await Usuario.findByIdAndDelete(id);
        // }else{
            await Admin.findByIdAndDelete(id);
        // }
        
        
        res.json({
            ok:true,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error borrar'
        });
    }
}

const crearAuto= async(req,res = response) =>{
    try {
        const adminDB= await Admin.findById(req.uid)
        if(!adminDB){
            res.json({
                ok:false
            })
        }else if(!adminDB.autos){
            res.json({
                ok:false
            })
        }

        const auto= new Auto(req.body);
        auto.uuid=uuidv4();
        await auto.save();

        if(req.files['img'].length==undefined){
            subirImagen(req.files['img'],auto.uuid,1,res)
        }else{
            for (let i = 0; i < req.files['img'].length; i++) {
                for (let j = 0; j < req.body.imgOrden.length; j++) {
                    if(req.body.imgOrden[j]==req.files['img'][i].name){
                        subirImagen(req.files['img'][i],auto.uuid,(j+1),res)
                    }
                }
            };
        }

        res.json({
            ok:true,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const deleteAuto=async(req,res=response) =>{
    const _id=req.body._id;
    try {     
        const adminDB= await Admin.findById(req.uid)
        if(!adminDB){
            res.json({
                ok:false
            })
        }else if(!adminDB.autos){
            res.json({
                ok:false
            })
        }
        
        const autoDB = await Auto.findById(_id)
        const imgDB = await Imagen.find({uuid_auto:autoDB.uuid})
        
        if(imgDB.length!=0){
            for (let i = 0; i < imgDB.length; i++) {
                let pathImg='./files/autos/'+imgDB[i].img
                if(fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                await Imagen.findByIdAndDelete(imgDB[i]._id);
            }
        }
        await Auto.findByIdAndDelete(autoDB._id);

        res.json({
            ok:true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error borrar'
        });
    }
};

const actualizarAuto= async(req,res=response)=>{    
    const adminDB= await Admin.findById(req.uid)
    if(!adminDB){
        res.json({
            ok:false
        })
    }else if(!adminDB.autos){
        res.json({
            ok:false
        })
    }
    
    const autoDB= await Auto.find({uuid:req.body.auto});
    if(!autoDB){
        res.json({
            ok:false
        })
    }

    let {...camposL}=autoDB;            
    camposL=req.body;

    if(req.body.imgElim){
        const imagenesElim = await Imagen.find({uuid_auto:autoDB[0].uuid}).sort({ orden: 1 }) 
        let flagElim=0;       
        for (let i = 0; i < imagenesElim.length; i++) {                
            if(flagElim>0){
                let {...campos}=imagenesElim[i];
                campos._doc.orden=campos._doc.orden-flagElim;    
                await Imagen.findByIdAndUpdate(imagenesElim[i]._id, campos._doc,{new:true}); 
            }
            if(Array.isArray(req.body.imgElim)){
                for (let j = 0; j < req.body.imgElim.length; j++) {
                    if(imagenesElim[i].img==req.body.imgElim[j]){
                        flagElim++;
                        let pathImg='./files/autos/'+imagenesElim[i].img
                        if(fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                        await Imagen.findByIdAndDelete(imagenesElim[i]._id);
                    }
                }
            }else{                    
                if(imagenesElim[i].img==req.body.imgElim){
                    flagElim++;
                    let pathImg='./files/autos/'+imagenesElim[i].img
                    if(fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                    await Imagen.findByIdAndDelete(imagenesElim[i]._id);
                }
            }
        }

    }else if(req.files && req.files['img']) {
        borrarImagen(req.body.auto,'autos');
        if(req.files['img'].length==undefined){
            subirImagen(req.files['img'],req.body.auto,1,res)
        }else{
            for (let i = 0; i < req.files['img'].length; i++) {
                for (let j = 0; j < req.body.imgOrden.length; j++) {
                    if(req.body.imgOrden[j]==req.files['img'][i].name){                            
                        subirImagen(req.files['img'][i],req.body.auto,(j+1),res)
                    }
                }
            };
        }
    }
    
    await Auto.findByIdAndUpdate(autoDB[0]._id, camposL, {new:true});   
        
    if(Array.isArray(req.body.unset)){
        var unset = { "$unset": { } }
        for (let i = 0; i < req.body.unset.length; i++) {
            unset["$unset"][req.body.unset[i]] = "";
        }
        await Auto.findByIdAndUpdate(autoDB[0]._id, unset, {new:true});   
    }else{
        var unset = { "$unset": { } }
        unset["$unset"][req.body.unset] = "";
        await Auto.findByIdAndUpdate(autoDB[0]._id, unset, {new:true});
    }

    res.json({
        ok:true,
    })
}

module.exports={ login, renewToken, crearAdmin, getAdmins, deleteUser, crearAuto, deleteAuto, actualizarAuto }