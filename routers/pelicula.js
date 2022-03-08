const express = require('express');
const router = express.Router();
const {validarCampos, laPeliculaExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
const validarJWT = require('../helpers/validarJWT');

const { crearPelicula, modificarPelicula, borrarPelicula, buscarPelicula } = require('../services/pelicula')

// TODO: CREAR PELICULA
router.post("/pelicula", [
    check("titulo", "El nombre es obligatorio").notEmpty(),
    check("imagen", "El path de la imagen es obligatorio").notEmpty(),
    check("calificacion", "La calificacion es obligatoria").notEmpty(),
    validarCampos,
    crearPelicula]);

// TODO: BUSCAR PELICULAS
router.get("/pelicula", buscarPelicula);

// TODO: MODIFICAR PELICULA
router.put("/pelicula", [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(laPeliculaExiste),
    validarCampos,
    modificarPelicula]);

// TODO: BORRAR PELICULA
router.delete("/serie", [
    validarJWT,
    borrarPelicula]);

module.exports = router;