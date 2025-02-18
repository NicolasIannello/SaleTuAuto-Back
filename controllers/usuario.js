const { response }=require('express');
const nodemailer = require("nodemailer");
const Form = require('../models/form');

const mailContacto= async(req,res=response)=>{    
    const {nomapel,telefono,fecha} = req.body
    const transporter = nodemailer.createTransport({
        maxConnections: 1,
        pool: true,
        host: process.env.MSERVICE,
        port: 465,
        secure: true,
        auth: {
            user: 'contacto@gruppodf.com.ar',
            pass: process.env.MPASS
        }
    });

    let msg = "Nombre y apellido: "+nomapel+"\n"+"Telefono: "+telefono+"\n"+"Fecha: "+fecha;
    let msgHTML = "Nombre y apellido: "+nomapel+"<br><br>"+"Telefono: "+telefono+"<br><br>"+"Fecha: "+fecha;

    const form= new Form(req.body);
    await form.save();

    transporter.sendMail({
        from: '"SALE Tu Auto" <contacto@gruppodf.com.ar>',
        to: 'dfelippelli@gruppodf.com.ar',
        subject: "SALE Tu Auto Formulario de contacto",
        text: msg,
        html: msgHTML,
    }, function(error, info){
        if (error) {
            console.log(error);
            return res.status(400).json({
                ok:false,
                msg:'error'
            });        
        }else{
            res.json({
                ok:true,
            })
        }
    });
};

module.exports={ mailContacto }