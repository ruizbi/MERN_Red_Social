const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarExistenciaPublicacion, validarCoincidenciaID } = require('../middlewares/validarPublicacion');
const validarJWT = require('../middlewares/validarJWT');
const { crearPublicacion, borrarPublicacion, modificarPublicacion, changeLike, buscarPublicacion } = require('../services/publicacion');
const router = express.Router();

router.post('/crear_publicacion', [
    check('imagen', 'El path de la imagen es obligatorio').notEmpty(),
    check('descripcion', 'La descripcion es obligatoria').isString().notEmpty(),
    validarCampos,
    validarJWT,
    crearPublicacion]);

router.delete('/borrar_publicacion', [
    check('pid', 'El ID de la publicacion es obligatorio').isString().notEmpty(),
    validarCampos,
    validarExistenciaPublicacion,
    validarJWT,
    validarCoincidenciaID,
    borrarPublicacion]);

router.put('/modificar_publicacion', [
    check('pid', 'El ID de la publicacion es obligatorio').isString().notEmpty(),
    check('imagen', 'El path de la imagen es obligatorio').isString().notEmpty(),
    check('descripcion', 'La descripcion es obligatoria').isString().notEmpty(),
    validarCampos,
    validarExistenciaPublicacion,
    validarJWT,
    validarCoincidenciaID,
    modificarPublicacion]);

router.put('/change_like', [
    check('pid', 'El ID de la publicacion es obligatorio').isString().notEmpty(),
    validarExistenciaPublicacion,
    validarJWT,
    changeLike]);

router.get('/:pid', [
    validarJWT,
    buscarPublicacion]);

module.exports = router;