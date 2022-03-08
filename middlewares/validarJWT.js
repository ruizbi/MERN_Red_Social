const UsuarioSchema = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { request, response } = require('express');

/*
const validarJWT = async (token) => {

    let {_id} = jwt.verify(token, process.env.KEY_JWT);
    let usuario = await UsuarioSchema.findById({_id});
    
    if(!usuario)
        throw new Error('El usuario no existe en la db');

    if(!usuario.activo)
        throw new Error('El usuario ya no se encuentra activo');
}
*/

const validarJWT = async (req = request, res = response, next) => {
    const {token} = req.body;
    if(!token){
      return res.status(400).send({msg:'No hay token'})
    }
    try {
      let {_id} = jwt.verify(token, process.env.KEY_JWT);
      let usuario = await UsuarioSchema.findById({_id});
      
      if(!usuario)
        return res.status(400).send({msg:'El usuario no existe en la db'});
  
      if(!usuario.activo)
        return res.status(400).send({msg:'El usuario ya no se encuentra activo'});
  
    req.usuario = usuario;
    next();
    }
    catch(error) {
        console.log(error);
        res.status(400).send({msg:'Error con el token'})
    }
  }
  module.exports = validarJWT;