const { request, response } = require("express");
const UsuarioSchema = require('../models/Usuario');
require('dotenv').config();

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('token');
  if(!token){
    return res.send({message:'No hay token'})
  }
  try {
    let {_id} = jwt.verify(token, process.env.KEY_JWT);
    let usuario = await UsuarioSchema.findById({_id});
    
    if(!usuario)
      return res.send({message:'El usuariono existe en la db'});

    if(!usuario.activo)
      return res.send({message:'El usuario ya no se encuentra activo'});

    req.usuario = usuario;
    next();
  }catch(error) {
    console.log(error);
    res.send({message:'Error con el token'})
  }
}

  module.exports = validarJWT;