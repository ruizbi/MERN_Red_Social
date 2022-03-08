const PublicacionSchema = require('../models/Publicacion');
const { request, response } = require('express');
const ComentarioSchema = require('../models/Comentario');

const crearPublicacion = (req = request, res = response) => {
    const {usuario} = req;
    const {imagen, descripcion} = req.body;
    const publicacion = PublicacionSchema({imagen, descripcion, uid:usuario._id});
    publicacion
        .save()
        .then((data) => res.status(201).send({data, msg:'Publicacion creada con éxito'}))
        .catch((error) => res.status(500).send({data:error, msg:'Error al crear publicacion'}));
};

const borrarPublicacion = async (req = request, res = response) => {
    const {usuario} = req;
    const {pid} = req.body;

    let publicacion = await PublicacionSchema.findById({_id:pid});
    if(!publicacion)
        return res.status(404).send({msg:'La publicación no existe'});
    if(usuario._id != publicacion.uid)
        return res.status(400).send({msg:'Error al querer borrar publicacion'});

    const comentarios = publicacion.comentarios;

    await Promise.all(comentarios.forEach( async function(comentario) {
        await ComentarioSchema.deleteOne({_id:comentario._id});
    }));

    PublicacionSchema
        .deleteOne({pid})
        .then((data) => res.status(200).send({msg:'Publicacion borrada con éxito', data}))
        .catch((error) => res.status(400).send({msg:'Error al querer borrar publicacion', data:error}));
};

const modificarPublicacion = async (req = request, res = response) => {
    const {usuario} = req;
    const {pid, imagen, descripcion} = req.body;

    let publicacion = await PublicacionSchema.findById({_id:pid});
    if(!publicacion)
        return res.status(404).send({msg:'La publicación no existe'});
    if(usuario._id != publicacion.uid)
        return res.status(400).send({msg:'Error al querer modificar publicacion'});

    PublicacionSchema
        .updateOne(publicacion, {imagen, descripcion})
        .then((data) => res.status(200).send({msg:'Se modifico la publicacion con exito', data}))
        .catch((error) => res.status(400).send({msg:'Error al querer modificar publicacion', data:error}));
};

const changeLike = async (req = request, res = response) => {
    const {usuario} = req;
    const {pid} = req.body;

    let publicacion = await PublicacionSchema.findById({_id:pid});
    if(!publicacion)
        return res.status(404).send({msg:'La publicación no existe'});

    if(publicacion.likes.includes(usuario._id)) {
        await publicacion.updateOne({$pull:{likes:usuario._id}});
        return res.status(200).send({msg:'Se quita el like a la publicacion', data:publicacion});
    }

    await publicacion.updateOne({$push:{likes:usuario._id}});
    res.status(200).send({msg:'Se suma el like a la publicacion', data:publicacion});

};

// TODO: BUSCAR PUBLICACION COMPLETA
const buscarPublicacion = async (req = request, res = response) => {
    const {pid} = req.params;
    
    let publicacion = await PublicacionSchema.findById({_id:pid});
    if(!publicacion)
        return res.status(404).send({msg:'La publicación no existe'});
    let count_like = publicacion.likes.length;
    let comentarios = publicacion.comentarios;
    let lista_comentarios = await Promise.all(comentarios.map(async function(comentario){
        let commnt = await ComentarioSchema.findOne({_id:comentario._id});
        return commnt;
    }));
    res.status(200).send({msg:'La busqueda fue exitosa', data:{publicacion, comentarios:lista_comentarios, count_like}});
}

module.exports = {
    borrarPublicacion,
    crearPublicacion,
    modificarPublicacion,
    changeLike,
    buscarPublicacion
}