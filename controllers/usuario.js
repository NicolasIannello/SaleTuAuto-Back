const { response }=require('express');
const nodemailer = require("nodemailer");
const Form = require('../models/form');

const transporter = nodemailer.createTransport({
    maxConnections: 1,
    pool: true,
    host: process.env.MSERVICE,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL1+'@'+process.env.MAIL2,
        pass: process.env.MPASS
    },
    tls: {
    rejectUnauthorized: false
    },
    maxMessages: 100,
    //family: 4,
    rateDelta: 60 * 60 * 1000, // 1 hour
    rateLimit: 80         // max messages per delta
});

const mailContacto= async(req,res=response)=>{    
    const {nomapel,telefono,fecha,subject,auto,link,ubicacion} = req.body

    let msg,msgHTML;
    if(link==''){
        msg = "Matricula: "+nomapel+"\n"+"Telefono: "+telefono+"\n"+"Fecha: "+fecha+"\n"+"Descripcion: "+auto+"\n"+"Ubicacion: "+ubicacion
        msgHTML = "Matricula: "+nomapel+"<br><br>"+"Telefono: "+telefono+"<br><br>"+"Fecha: "+fecha+"<br><br>"+"Descripcion: "+auto+"<br><br>"+"Ubicacion: "+ubicacion;
    }else{
        msg = "Nombre y apellido: "+nomapel+"\n"+"Telefono: "+telefono+"\n"+"Fecha: "+fecha+"\n"+"Auto: "+auto+"\n"+"Link: "+link;
        msgHTML = "Nombre y apellido: "+nomapel+"<br><br>"+"Telefono: "+telefono+"<br><br>"+"Fecha: "+fecha+"<br><br>"+"Auto: "+auto+"<br><br>"+"link: "+link;
    }

    const form= new Form(req.body);
    await form.save();

    transporter.sendMail({
        from: '"SALE Tu Auto" <'+process.env.MAIL1+'@'+process.env.MAIL2+'>',
        to: process.env.MTO1+'@'+process.env.MTO2,
        subject: subject,
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