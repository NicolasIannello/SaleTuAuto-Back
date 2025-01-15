const { response }=require('express');
const nodemailer = require("nodemailer");

const mailContacto= async(req,res=response)=>{    
    const {mensaje,mensaje2,asunto,nombre_apellido,mail} = req.body
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

    let msg = "Nombre y apellido: "+nombre_apellido+"\n"+"E-Mail: "+mail+"\n"+"Mensaje:\n"+mensaje
    let msgHTML = "Nombre y apellido: "+nombre_apellido+"<br><br>"+"E-Mail: "+mail+"<br><br>"+"Mensaje:<br>"+mensaje2

    transporter.sendMail({
        from: '"Gruppo DF Subastas" <contacto@gruppodf.com.ar>',
        to: 'contacto@gruppodf.com.ar',
        subject: "SALE TU AUTO Formulario contacto: "+asunto,
        text: msg,
        html: msgHTML,
    }, function(error, info){
        if (error) {
            console.log(error);
            return res.status(400).json({
                ok:false,
                msg:'error'
            });        
        }
    });
    
    res.json({
        ok:true,
    })
};

module.exports={ mailContacto }