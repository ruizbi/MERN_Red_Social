const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validarJWT');
const { crearPublicacion, borrarPublicacion, modificarPublicacion, changeLike, buscarPublicacion } = require('../services/publicacion');
const router = express.Router();

router.post('/crear_publicacion', [
    check('imagen', 'El path de la imagen es obligatorio').notEmpty(),
    check('descripcion', 'La descripcion es obligatoria').notEmpty(),
    validarCampos,
    validarJWT,
    crearPublicacion
    ]);

router.delete('/borrar_publicacion', [
    check('pid', 'El ID de la publicacion es obligatorio').notEmpty(),
    validarCampos,
    validarJWT,
    borrarPublicacion]);

router.put('/modificar_publicacion', [
    check('pid', 'El ID de la publicacion es obligatorio').notEmpty(),
    check('imagen', 'El path de la imagen es obligatorio').notEmpty(),
    check('descripcion', 'La descripcion es obligatoria').notEmpty(),
    validarCampos,
    validarJWT,
    modificarPublicacion]);

router.put('/change_like', [
    check('pid', 'El ID de la publicacion es obligatorio').notEmpty(),
    validarJWT,
    changeLike]);

router.get('/:pid', buscarPublicacion);

module.exports = router;