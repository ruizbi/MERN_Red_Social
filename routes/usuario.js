const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarIdentificador, validarDisponibilidad } = require('../middlewares/validarCredencial');
const validarJWT = require('../middlewares/validarJWT');
const { desactivarUsuario, followUser, unfollowUser, cargarUsuario, cargarContactos, cambiarEstadoPrivacidad, cargarInicio } = require('../services/usuario');
const router = express.Router();

router.get('/home', [
    validarJWT,
    cargarInicio]);
    
router.put('/desactivar_usuario', [
    validarJWT,
    desactivarUsuario]);

router.put('/agregar_contacto', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    validarCampos,
    validarIdentificador,
    validarJWT,
    followUser]);

router.put('/borrar_contacto', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    validarCampos,
    validarIdentificador,
    validarJWT,
    unfollowUser]);

router.get('/:alias_param', [
    validarJWT,
    validarDisponibilidad,
    cargarUsuario]);

router.get('/:alias_param/:type_f', [
    validarJWT,
    validarDisponibilidad,
    cargarContactos]);

router.put('/cambiar_privacidad', [
    validarJWT,
    cambiarEstadoPrivacidad]);

module.exports = router;