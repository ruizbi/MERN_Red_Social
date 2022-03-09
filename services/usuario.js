const { request, response } = require('express');
const UsuarioSchema = require('../models/Usuario');
const PublicacionSchema = require('../models/Publicacion');
const bcryptjs = require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');
const UsuarioSchema = require('../models/Usuario');

const crearUsuario = async (req = request, res = response) => {
    const {nombre, apellido, email, contraseña, alias} = req.body;
    let validar_usuario = await UsuarioSchema.findOne({$or:[{email},{alias}]});
    
    if(validar_usuario)
        return res.status(400).send({data:{}, msg:'El usuario/alias ya existe'});
    
    let usuario = new UsuarioSchema({nombre, apellido, email, contraseña, alias});
    let salt = bcryptjs.genSaltSync();
    usuario.contraseña = bcryptjs.hashSync(contraseña, salt);
    
    usuario
        .save()
        .then((data) => res.status(201).send({data, msg:'Usuario creado con éxito'}))
        .catch((error) => res.status(500).send({data:error, msg:'Error al crear usuario'}));
};

const validarUsuario = async (req = request, res = response) => {
    const {identificacion, contraseña} = req.body;
    
    let usuario = await UsuarioSchema.findOne({$or:[{email:identificacion},{alias:identificacion}]})
    if(!usuario)
        return res.status(400).send({data:{}, msg:'Credencial incorrecta'});

    let validar_contraseña = bcryptjs.compareSync(contraseña, usuario.contraseña);
    if(!validar_contraseña) {
        return res.status(400).send({data:{}, msg:'Credencial incorrecta'});
    }

    let token = await generarJWT(usuario._id);

    if(!usuario.activo) {
        await UsuarioSchema.updateOne(usuario, {$set:{activo:true}});
        return res.status(200).send({data:usuario, msg:'Login correcto - Usuario reactivado', token});
    }

    res.status(200).send({data:usuario, msg:'Login correcto', token});
};

const desactivarUsuario = async (req = request, res = response) => {
    const {usuario} = req;

    if(usuario.activo) {
        UsuarioSchema
        .updateOne(usuario, {$set:{activo:false}})
        .then((data) => res.status(200).send({data, msg:'Desactivado con éxito'}))
        .catch((error) => res.status(500).send({data:error, msg:'Error al desactivar usuario'}));
    }
    else
        res.status(400).send({msg:'Error al desactivar usuario', data:{}});
};

const followUser = async (req = request, res = response) => {
    const {usuario, user_friend} = req;

    // const {usuario} = req;
    // const {identificacion} = req.body;
    // let user_friend = await UsuarioSchema.findOne({$or:[{email:identificacion},{alias:identificacion}]});
    // if(!user_friend || !user_friend.activo)
    //     return res.status(404).send({data:{}, msg:'El email/alias es incorrecto'});

    if(usuario.seguidos.includes(user_friend._id))
        return res.status(400).send({data:{}, msg:'El usuario ya está en la lista de seguidos'});

    await user_friend.updateOne({$push:{seguidores:usuario._id}});
    await usuario.updateOne({$push:{seguidos:user_friend._id}});
    
    res.status(200).send({msg:`Se agrego a ${user_friend.alias} con éxito`});
};

const unfollowUser = async (req = request, res = response) => {
    const {usuario, user_friend} = req;

    // const {usuario} = req;
    // const {identificacion} = req.body;
    // let user_friend = await UsuarioSchema.findOne({$or:[{email:identificacion},{alias:identificacion}]});
    // if(!user_friend || !user_friend.activo)
    //     return res.status(404).send({data:{}, msg:'El email/alias es incorrecto'});
    
    if(!(usuario.seguidos.includes(user_friend._id)))
        return res.status(400).send({data:{}, msg:'El usuario no está en la lista de seguidos'});

    await user_friend.updateOne({$pull:{seguidores:usuario._id}});
    await usuario.updateOne({$pull:{seguidos:user_friend._id}});
    
    res.status(200).send({msg:`Se borró a ${user_friend.alias} con éxito`});
};

const cargarUsuario = async (req = request, res = response) => {
    let {search_user} = req;

    // let {usuario} = req;
    // let {alias_param} = req.params;
    // let search_user = await UsuarioSchema.findOne({alias:alias_param});
    // if(!search_user)
    //     return res.status(404).send({data:{}, msg:'El alias es incorrecto'});
    // if(search_user.cuentaPrivada && !search_user.seguidos.includes(usuario._id))
    //     return res.status(400).send({data:{}, msg:'El alias es privado'});

    let {nombre, apellido, alias, imagenPerfil} = search_user;
    let count_seguidos = search_user.seguidos.length;
    let count_seguidores = search_user.seguidores.length;

    const publicaciones = await PublicacionSchema.find({uid:search_user._id});

    let publicaciones_resumidas = publicaciones.map(pub => ({imagen:pub.imagen, descripcion:pub.descripcion, count_likes:pub.likes.length, count_comentarios:pub.comentarios.length, fecha:pub.fecha, pid:pub._id})); // ASÍ TENGO QUE MOSTRAR EL INICIO

    res.status(200).send({msg:'Se ingresa al inicio del alias solicitado', data:{usuario:{nombre, apellido, alias, imagenPerfil, count_seguidos, count_seguidores}, publicaciones:publicaciones_resumidas}});
};

const cargarContactos = async (req = request, res = response) => {
    let {search_user} = req;
    let {type_f} = req.params;

    // let {usuario} = req;
    // let {alias_param, type_f} = req.params;
    // let search_user = await UsuarioSchema.findOne({alias:alias_param});
    // if(!search_user)
    //     return res.status(404).send({data:{}, msg:'El alias es incorrecto'}); 
    // if(search_user.cuentaPrivada && !search_user.seguidos.includes(usuario._id))
    //     return res.status(400).send({data:{}, msg:'El alias es privado'});

    if(type_f === "seguidos") {
        const resumen_seguidos = await Promise.all(search_user.seguidos.map(async function(_id) {
            let {nombre, apellido, alias, imagenPerfil} = await UsuarioSchema.findOne({_id});
            return {nombre, apellido, alias, imagenPerfil};
        }));
        return res.status(200).send({msg:'Lista de seguidos otorgada', data:resumen_seguidos});
    }
    else if(type_f === "seguidores") {
        const resumen_seguidores = await Promise.all(search_user.seguidores.map(async function(_id) {
            let {nombre, apellido, alias, imagenPerfil} = await UsuarioSchema.findOne({_id});
            return {nombre, apellido, alias, imagenPerfil};
        }));
        return res.status(200).send({msg:'Lista de seguidores otorgada', data:resumen_seguidores});
    }
    else
        return res.status(400).send({data:{}, msg:'Error en el parametro'});
};

const cambiarEstadoPrivacidad = (req = request, res = response) => {
    const {usuario} = req;
    const estado = usuario.cuentaPrivada;
    UsuarioSchema
        .updateOne(usuario, {$set:{cuentaPrivada:!estado}})
        .then(data => res.status(200).send({msg:'Se cambio el estado de privacidad', data}))
        .catch(error => res.status(500).send({msg:'No se pudo cambiar el estado de privacidad', data:error}));
};

// TENGO QUE CAMBIAR LA SALIDA
const cargarInicio = async (req = request, res = response) => {
    const {usuario} = req;
    const lista_publicaciones = await Promise.all(usuario.seguidos.map(async function(_id){
        let publicaciones = await PublicacionSchema.find({uid:_id});
        let publicaciones_resumidas = publicaciones.map(({imagen, descripcion, likes, comentarios, fecha, pid}) => ({imagen, descripcion, fecha, pid, count_likes:likes.length, count_comentarios:comentarios.length}));
        let {nombre, apellido, alias, imagenPerfil} = await UsuarioSchema.findById({_id});
        return {publicaciones:publicaciones_resumidas, usuario:{nombre, apellido, alias, imagenPerfil}};
    }));
    res.status(200).send({data:lista_publicaciones, msg:'Inicio cargado con éxito'});
}

module.exports = {
    crearUsuario,
    validarUsuario,
    desactivarUsuario,
    followUser,
    unfollowUser,
    cargarUsuario,
    cargarContactos,
    cambiarEstadoPrivacidad,
    cargarInicio
}