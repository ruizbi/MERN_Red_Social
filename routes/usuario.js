const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validarJWT');
const { desactivarUsuario, followUser, unfollowUser, cargarUsuario, cargarContactos, cambiarEstadoPrivacidad } = require('../services/usuario');
const router = express.Router();

router.put('/desactivar_usuario', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    check('contraseña', 'La contraseña es obligatoria').notEmpty(),
    validarCampos,
    validarJWT,
    desactivarUsuario]);

router.put('/agregar_contacto', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    validarCampos,
    validarJWT,
    followUser]);

router.put('/borrar_contacto', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    validarCampos,
    validarJWT,
    unfollowUser]);

router.get('/:alias_param', [
    validarJWT,
    cargarUsuario]);

router.get('/:alias_param/:type_f', [
    validarJWT,
    cargarContactos]);

router.put('/cambiar_privacidad', [
    validarJWT,
    cambiarEstadoPrivacidad]);

module.exports = router;