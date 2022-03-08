const PeliculaSchema = require('../models/Pelicula');
const GeneroSchema = require('../models/Genero');

const obtener_info_filtrada = (data = []) => data.map(dato => ({titulo:dato.titulo, imagen:dato.imagen, fecha_creacion:dato.fecha_creacion}))

const crearPelicula = (req, res) => {
    let {titulo, imagen, fecha_creacion, calificacion, personajes} = req.body;
    let validar_pelicula = SerieSchema.findOne({titulo});
        
    if(validar_pelicula)
        return res.status(400).send({message:'La pelicula ya existe', data:{}});
    
    let pelicula = new PeliculaSchema({titulo, imagen, fecha_creacion, calificacion, personajes});

    (pelicula.calificacion < 1) ?
        pelicula.calificacion = 1 : (pelicula.calificacion > 5) ?
            pelicula.calificacion = 5 : null;

    pelicula
        .save()
        .then((data) => res.status(201).send({data, message:'Pelicula creada'}))
        .catch((error) => res.status(500).send({data:error, message:'Error al crear pelicula'}));
};

const buscarPelicula = (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        PeliculaSchema
            .find()
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('name')) {
        PeliculaSchema
            .findOne({titulo:query.name})
            .then((data) => (data) ? res.send({data, message:'Busqueda exitosa'}) : res.status(404).send({data:{}, message:'No se encontro la pelicula'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('genre')) {
        GeneroSchema
            .findOne({nombre:query.genre})
            .then((data) => (Object.keys(data).length > 0) ? res.send({data:data.peliculas, message:'Busqueda exitosa'}):res.status(404).send({data:{}, message:'No se encontro la pelicula'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('order')) {
        (query.order === "ASC") ? 
        PeliculaSchema
            .find()
            .sort({fecha_creacion:1})
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda ASC exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'})) :
        PeliculaSchema
            .find().sort({fecha_creacion:-1})
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda DESC exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else
        res.status(400).send({data:{}, message:'Error en el parametro de busqueda'});
};

const borrarPelicula = (req, res) => {
    let query = req.query;
        
    if(query.hasOwnProperty('id')) {
        SerieSchema
            .deleteOne({_id:query.id})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('titulo')) {
        serieSchema
            .deleteOne({titulo:query.name})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
};

const modificarPelicula = (req, res) => {
    const {id} = req.query;
    const {_id, ...resto} = req.body;

    PeliculaSchema
        .updateOne({_id:id}, {$set:resto})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.status(500).send({message:'Error al modificar pelicula', data:error}));
};

module.exports = {
    crearPelicula,
    modificarPelicula,
    borrarPelicula,
    buscarPelicula
}