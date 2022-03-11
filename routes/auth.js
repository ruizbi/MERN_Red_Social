const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarUsuario, crearUsuario } = require('../services/usuario');

router.post('/signin', [
    check('nombre', 'El nombre es obligatorio').isString().notEmpty(),
    check('apellido', 'El apellido es obligatorio').isString().notEmpty(),
    check('email', 'El mail es obligatorio').isEmail().notEmpty(),
    check('contraseña', 'La contraseña es obligatoria').isLength({min:6}).notEmpty(),
    check('alias', 'El alias es obligatorio').notEmpty(),
    validarCampos,
    crearUsuario]);

router.get('/login', [
    check('identificacion', 'El mail es obligatorio').notEmpty(),
    check('contraseña', 'La contraseña es obligatoria').isLength({min:6}).notEmpty(),
    validarCampos,
    validarUsuario]);

module.exports = router;