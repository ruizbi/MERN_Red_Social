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

const validarIdentificador = async (req = request, res = response, next) => {
    const {identificacion} = req.body;
    let usuario_identificado = await UsuarioSchema.findOne({$or:[{email:identificacion},{alias:identificacion}]});

    if(!usuario_identificado || !usuario_identificado.activo)
        return res.status(404).send({data:{}, msg:'El email/alias es incorrecto'});

    req.user_friend = usuario_identificado;
    next();
};

const validarDisponibilidad = (req = request, res = response, next) => {
    let {usuario} = req;
    let {alias_param} = req.params;

    let search_user = await UsuarioSchema.findOne({alias:alias_param});
    if(!search_user)
        return res.status(404).send({data:{}, msg:'El alias es incorrecto'});
    
    if(search_user.cuentaPrivada && !search_user.seguidos.includes(usuario._id))
        return res.status(400).send({data:{}, msg:'El alias es privado'});
    
    req.search_user = search_user;
    next();
};

module.exports = { validarCredencial, validarIdentificador, validarDisponibilidad }