require('dotenv').config();
const express = require('express');
const app = express();
const dbConnection = require('./database/config');
const puertoEscucha = process.env.PUERTO_ESCUCHA || 9001;
const usuarioRoute = require('./services/usuario');
const publicacionRoute = require('./services/publicacion');
const comentarioRoute = require('./services/comentario');


app.use(express.json());

app.use('',)

dbConnection();

app.listen(puertoEscucha, () => console.log(`Servidor escuchando en el puerto ${puertoEscucha}`));