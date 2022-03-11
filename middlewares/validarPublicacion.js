const {request, response} = require('express');
const PublicacionSchema = require('../models/Publicacion');

const validarExistenciaPublicacion = async (req = request, res = response, next) => {
    const {pid} = req.body;
    let publicacion = await PublicacionSchema.findOne({_id:pid});
    if(!publicacion)
        return res.status(404).send({msg:'La publicación no existe'});
    req.publicacion = publicacion;
    next();
};

const validarCoincidenciaID = (req = request, res = response, next) => {
    const {usuario, publicacion} = req;
    if(usuario._id != publicacion.uid)
        return res.status(400).send({msg:'Error al querer borrar publicacion'});
    next();
};

module.exports = { validarExistenciaPublicacion, validarCoincidenciaID };