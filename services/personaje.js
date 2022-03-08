const { request, response } = require('express');
const PersonajeSchema = require('../models/Personaje');

const obtener_info_filtrada = (data = []) => data.map(dato => ({nombre:dato.nombre, imagen:dato.imagen}))

const crearPersonaje = async (req = request, res = response) => {
    let {nombre, edad, peso, historia, imagen, series, peliculas} = req.body;
    let validar_personaje = await PersonajeSchema.findOne({nombre});
    
    if(validar_personaje)
        return res.status(400).send({message:'El personaje ya existe', data:{}});

    let personaje = new PersonajeSchema({nombre, edad, peso, historia, imagen, series, peliculas});
    personaje
        .save()
        .then(data => res.status(201).send({message:'Personaje creado', data}))
        .catch(error => res.status(500).send({message:'Error al crear personaje', data:error}));
};

const obtenerPersonaje = (req = request, res = response) => {
    let query = req.query;
    if(Object.keys(query).length === 0){
        PersonajeSchema
            .find()
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message: 'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        PersonajeSchema
            .findOne({nombre:query.name})
            .then((data) => {
                (data) ? res.send({data, message:'Busqueda exitosa'}) : res.status(404).send({data, message:'No se encontro el personaje'})
            })
            .catch((error) => res.status(500).send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('age')) {
        PersonajeSchema
            .find({edad:query.age})
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message: 'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('weight')) {   
        PersonajeSchema
            .find({peso:query.weight})
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('movies')) {
        PersonajeSchema
            .find({$or:[{peliculas:{$in:[query.movies]}}, {series:{$in:[query.movies]}}]})
            .then((data) => {
                (data.length > 0) ? res.send({data, message:'Busqueda exitosa'}):res.status(404).send({data:[], message:'No hubo resultados'})})
            .catch((error) => res.status(500).send({message: 'Error en la busqueda', data:error}));
    }
    else
        res.status(400).send({data: {}, message:'Error de parametros'}); 
};

const borrarPersonaje = (req = request, res = response) => {
    let query = req.query;

    if(query.hasOwnProperty('id')) {
        // VALIDAR QUE EXISTE
        PersonajeSchema
            .deleteOne({_id:query.id})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        // VALIDAR QUE EXISTE
        PersonajeSchema
            .deleteOne({nombre:query.name})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
    else res.status(400).send({message:'Error en los parametros al borrar', data: {}})
}

const modificarPersonaje = (req, res) => {
    let {id} = req.query;
    let {nombre, edad, peso, historia, imagen, series, peliculas} = req.body;
    PersonajeSchema
        .updateOne({_id:id}, { $set: {nombre, edad, peso, historia, imagen, series, peliculas}})
        .then((data) => res.send({data, message:'Personaje modificado con exito'}))
        .catch((error) => res.status(500).send({message:'Error al modificar el personaje',data:error}));
};

module.exports = {
    crearPersonaje,
    obtenerPersonaje,
    borrarPersonaje,
    modificarPersonaje
}