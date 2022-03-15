require('dotenv').config();
const express = require('express');
const app = express();
const dbConnection = require('./database/config');
const puertoEscucha = process.env.PUERTO_ESCUCHA || 9001;
const usuarioRoute = require('./routes/usuario');
const publicacionRoute = require('./routes/publicacion');
const comentarioRoute = require('./routes/comentario');
const authRoute = require('./routes/auth');

app.use(express.json());

app.use('/auth', authRoute);
app.use('/usuario', usuarioRoute);
app.use('/p', publicacionRoute);
app.use('/comentario', comentarioRoute);

dbConnection();

app.listen(puertoEscucha, () => console.log(`Servidor escuchando en el puerto ${puertoEscucha}`));