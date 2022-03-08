const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const validarCredencial = async (req = request, res = response, next) => {
    let usuario = await UsuarioSchema.findOne({$or:[{email:identificacion},{alias:identificacion}]})
    if(!usuario || !usuario.activo)
        throw new Error('Credencial incorrecta');

    let validar_contraseña = bcryptjs.compareSync(contraseña, usuario.contraseña);
    if(!validar_contraseña)
        throw new Error('Credencial incorrecta');
    next();
};

module.exports = { validarCredencial }