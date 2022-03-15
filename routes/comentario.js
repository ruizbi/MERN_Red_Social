const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarCoincidenciaID, validarExistenciaComentario } = require('../middlewares/validarComentario');
const validarJWT = require('../middlewares/validarJWT');
const { crearComentario, borrarComentario, changeLike_Comentario, modificarComentario } = require('../services/comentario');
const router = express.Router();

router.post('/crear_comentario', [
    check('pid', 'El ID de la publicacion es obligatorio'),
    check('message', 'El mensaje es obligatorio'),
    validarCampos,
    validarJWT,
    crearComentario]);

router.delete('/borrar_comentario', [
    check('cid', 'El ID del comentario es obligatorio'),
    check('pid', 'El ID de la publicacion esobligatorio'),
    validarCampos,
    validarExistenciaComentario,
    validarJWT,
    validarCoincidenciaID,
    borrarComentario]);

router.put('/change_like', [
    check('cid', 'El ID del comentario es obligatorio'),
    validarCampos,
    validarExistenciaComentario,
    validarJWT,
    changeLike_Comentario]);

router.put('/modificar_comentario', [
    check('cid', 'El ID del comentario es obligatorio'),
    check('message', 'El mensaje es obligatorio'),
    validarCampos,
    validarExistenciaComentario,
    validarJWT,
    validarCoincidenciaID,
    modificarComentario]);
    
module.exports = router;