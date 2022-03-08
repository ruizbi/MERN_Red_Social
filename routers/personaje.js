const express = require('express');
const router = express.Router();
const {validarCampos, elPersonajeExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
const validarJWT = require('../helpers/validarJWT');
const {crearPersonaje, obtenerPersonaje, borrarPersonaje, modificarPersonaje} = require('../services/personaje');

// TODO: CREAR PERSONAJE
router.post("/characters", [
    check('nombre','No se ingreso el nombre').notEmpty(),
    check('edad','No se ingreso la edad').notEmpty(),
    check('peso','No se ingreso el peso').notEmpty(),
    check('historia','No se ingreso la historia').notEmpty(),
    check('imagen','No se ingreso el path de la imagen').notEmpty(),
    validarCampos,
    crearPersonaje]);
 
// TODO: OBTENER PERSONAJES
router.get("/characters", obtenerPersonaje);

// TODO: BORRAR PERSONAJE
router.delete("/characters", [
    validarJWT,
    borrarPersonaje]);

// TODO: MODIFICAR PERSONAJE
router.put("/characters", [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elPersonajeExiste),
    validarCampos,
    modificarPersonaje]);

module.exports = router;