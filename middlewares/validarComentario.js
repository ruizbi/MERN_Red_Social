const {request, response} = require('express');
const ComentarioSchema = require('../models/Comentario');

const validarCoincidenciaID = async (req = request, res = response, next) => {
    const {usuario} = req;
    const {cid} = req.body;
    const comentario = await ComentarioSchema.findOne({_id:cid});
    if(!comentario)
        return res.status(401).send({msg:'El comentario no se encuentra disponible'});
    if(usuario._id != comentario.uid)
        return res.status(401).send({msg:'No se puede realizar dicha acción'});
    
    req.comentario = comentario;
    next(); 
};

module.exports = {
    validarCoincidenciaID
}