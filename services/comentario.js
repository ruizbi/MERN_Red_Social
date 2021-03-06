const { request, response } = require('express');
const ComentarioSchema = require('../models/Comentario');
const PublicacionSchema = require('../models/Publicacion');
const UsuarioSchema = require('../models/Usuario');

const crearComentario = async (req = request, res = response) => {
    const {usuario} = req;
    const {pid, message} = req.body;

    const publicacion = await PublicacionSchema.findOne({_id:pid});
    if(!publicacion)
        return res.status(401).send({msg:'La publicacion no se encuentra disponible'});
    
    const user_pub = await UsuarioSchema.findOne({_id:publicacion.uid});
    if(!user_pub || !user_pub.activo)
        return res.status(401).send({msg:'La publicacion no se encuentra disponible - USER'})
        
    const comentario = ComentarioSchema({pid, uid:usuario._id, message});

    await PublicacionSchema.updateOne(publicacion, {$push:{comentarios:comentario._id}});

    comentario
        .save()
        .then((data) => res.status(201).send({data, msg:'Se creo el comentario con exito'}))
        .catch((error) => res.status(500).send({data:error, msg:'Error al crear comentario'}));
};

const borrarComentario = async (req = request, res = response) => {
    const {comentario} = req;

    const publicacion = await PublicacionSchema.findOne({_id:comentario.pid});
    if(!publicacion)
        return res.status(401).send({msg:'La publicacion no se encuentra disponible'});
    
    await PublicacionSchema.updateOne(publicacion, {$pull:{comentarios:comentario._id}});
    
    ComentarioSchema
        .deleteOne(comentario)
        .then(data => res.status(200).send({msg:'Se borro el comentario con exito', data}))
        .catch(error => res.status(500).send({msg:'No se pudo borrar el comentario', data:error}));
};

const changeLike_Comentario = async (req = request, res = response) => {
    const {comentario, usuario} = req;

    if(comentario.likes.includes(usuario._id)){
        await ComentarioSchema.updateOne(comentario, {$pull:{likes:usuario._id}});
        return res.status(200).send({msg:'Se quit?? el like del comentario', data:comentario});
    }

    await ComentarioSchema.updateOne(comentario, {$push:{likes:usuario._id}});
    res.status(200).send({msg:'Se agrego el like al comentario'});
};

const modificarComentario = async (req = request, res = response) => {
    const {comentario} = req;
    const {message} = req.body;

    ComentarioSchema
        .updateOne(comentario, {message})
        .then(data => res.status(200).send({msg:'Se modifico el comentario con ??xito', data}))
        .catch(error => res.status(500).send({msg:'No se pudo modificar el comentario', data:error}));
};

module.exports = {
    crearComentario,
    borrarComentario,
    changeLike_Comentario,
    modificarComentario
}