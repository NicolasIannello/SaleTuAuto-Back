const express =require('express');
require('dotenv').config();
const cors=require('cors');
const { dbConnection } = require('./database/config');

const app=express();

app.use(cors());

app.use( express.json() );

dbConnection();

app.use('/sta/admin', require('./routes/admins'));
app.use('/sta/auto', require('./routes/autos'));
app.use('/sta/usuarios', require('./routes/usuarios'));

app.listen( process.env.PORT, () =>{
    console.log('Iniciando');
});