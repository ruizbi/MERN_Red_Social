require('dotenv').config();
const express = require('express');
const app = express();
const personajeRoutes = require('./routers/personaje');
const peliculaRoutes = require('./routers/pelicula');
const serieRoutes = require('./routers/serie');
const generoRoutes = require('./routers/genero');
const authRoutes = require('./routers/login');
const dbConnection = require('./database/config');
const puertoEscucha = process.env.PUERTO_ESCUCHA || 9001;

app.use(express.json());
app.use("/api", personajeRoutes);
app.use("/api", peliculaRoutes);
app.use("/api", serieRoutes);
app.use("/api", generoRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send({message:'Api catalogo entretenimiento'});
});

dbConnection();

app.listen(puertoEscucha, () => console.log(`Servidor escuchando en el puerto ${puertoEscucha}`));