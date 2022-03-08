const express = require('express');
const router = express.Router();
const {validarCampos} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
const { verificarUsuario, registrarUsuario, desactivarUsuario } = require('../services/login');
require('dotenv').config();

router.post('/login', verificarUsuario);

router.post('/register', [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("correo", "El correo es obligatorio").notEmpty().isEmail(),
    check("contraseña", "La contraseña es obligatoria (Mayor a 6 caracteres)").notEmpty().isLength({min:6}),
    validarCampos,
    registrarUsuario]);

router.delete('/delete/user', [
    check("contraseña", "La contraseña es obligatori").notEmpty(),
    check("correo", "El correo es obligatorio").notEmpty().isEmail(),
    validarCampos,
    desactivarUsuario]);

module.exports = router;