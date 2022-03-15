const {request, response} = require('express');
const ComentarioSchema = require('../models/Comentario');

const validarCoincidenciaID = async (req = request, res = response, next) => {
    const {usuario, comentario} = req;
    if(usuario._id != comentario.uid)
        return res.status(401).send({msg:'No se puede realizar dicha acción'});
    next(); 
};

const validarExistenciaComentario = async (req = request, res = response, next) => {
    const {cid} = req.body;
    const comentario = await ComentarioSchema.findOne({_id:cid});
    if(!comentario)
        return res.status(401).send({msg:'El comentario no se encuentra disponible'});
    req.comentario = comentario;
    next(); 
};

module.exports = {
    validarCoincidenciaID,
    validarExistenciaComentario
}