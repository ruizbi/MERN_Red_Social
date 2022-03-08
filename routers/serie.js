const express = require('express');
const router = express.Router();
const {validarCampos, laSerieExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
const validarJWT = require('../helpers/validarJWT');
const { crearSerie, buscarSerie, modificarSerie, borrarSerie } = require('../services/serie');

// TODO: CREAR SERIE
router.post("/serie", [
    check("titulo", "El nombre es obligatorio").notEmpty(),
    check("imagen", "El path de la imagen es obligatorio").notEmpty(),
    check("calificacion", "La calificacion es obligatoria").notEmpty(),
    validarCampos,
    crearSerie
    ]);

// TODO: BUSCAR SERIES
router.get("/serie",  buscarSerie);

// TODO: MODIFICAR SERIE
router.put("/serie", [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(laSerieExiste),
    validarCampos,
    modificarSerie
    ]);

// TODO: BORRAR SERIE
router.delete("/serie", [
    validarJWT,
    borrarSerie]);

module.exports = router;