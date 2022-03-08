const express = require('express');
const router = express.Router();
const {validarCampos, elGeneroExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
const validarJWT = require('../helpers/validarJWT');
const { crearGenero, modificarGenero, buscarGenero, buscarPorID, borrarGenero } = require('../services/genero');

// TODO: CREAR GENERO
router.post("/genero", [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("imagen", "El path de la imagen es obligatorio").notEmpty(),
    validarCampos,
    crearGenero]);

// TODO: OBTENER GENEROS
router.get("/genero", buscarGenero);

// TODO: OBTENER GENERO POR ID
router.get("/genero", [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    buscarPorID
    ]);

// TODO: BORRAR GENERO POR ID
router.delete("/genero", [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    borrarGenero]);

// TODO: MODIFICAR GENERO POR ID
router.put("/genero", [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    modificarGenero]);

module.exports = router;