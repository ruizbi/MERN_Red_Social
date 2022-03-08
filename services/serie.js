const SerieSchema = require('../models/Serie');
const GeneroSchema = require('../models/Genero');

const obtener_info_filtrada = (data = []) => data.map(dato => ({titulo:dato.titulo, imagen:dato.imagen, fecha_creacion:dato.fecha_creacion}))

const crearSerie = async (req, res) => {
    let {titulo, imagen, fecha_creacion, calificacion, personajes} = req.body;
    let validar_serie = await SerieSchema.findOne({titulo});
    
    if(validar_serie)
        return res.status(400).send({message:'La serie ya existe', data:{}});

    let serie = new SerieSchema({titulo, imagen, fecha_creacion, calificacion, personajes});

    (serie.calificacion < 1) ?
        serie.calificacion = 1 : (serie.calificacion > 5) ?
            serie.calificacion = 5 : null;

        serie
            .save()
            .then((data) => res.status(201).send({data, message:'Serie creada'}))
            .catch((error) => res.status(500).send({data:error, message:'Error al crear serie'}));
};

const buscarSerie = (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        SerieSchema
            .find()
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('name')) {
        SerieSchema
            .findOne({titulo:query.name})
            .then((data) => (data) ? res.send({data, message:'Busqueda exitosa'}) : res.status(404).send({data:[], message:'No se encontro la serie'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('genre')) {
        GeneroSchema
            .findOne({nombre:query.genre})
            .then((data) => (Object.keys(data).length > 0) ? res.send({data:data.series, message:'Busqueda exitosa'}):res.status(404).send({data:{}, message:'No se encontro la serie'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('order')) {
        (query.order === "ASC") ? 
        SerieSchema
            .find()
            .sort({fecha_creacion:1})
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda ASC exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'})) :
        SerieSchema
            .find().sort({fecha_creacion:-1})
            .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda DESC exitosa'}))
            .catch((error) => res.status(500).send({data:error, message:'Error en la busqueda'}));
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
}

const modificarSerie = (req, res) => {
    const {id} = req.query;
    const {titulo, imagen, fecha_creacion, calificacion, personajes} = req.body;

    peliculaSchema
        .updateOne({_id:id}, {$set:{titulo, imagen, fecha_creacion, calificacion, personajes}})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.status(500).send({message:'Error al modificar serie', data:error}));
}

const borrarSerie = (req, res) => {
    let query = req.query;
        
    if(query.hasOwnProperty('id')) {
        SerieSchema
            .deleteOne({_id:query.id})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('titulo')) {
        SerieSchema
            .deleteOne({titulo:query.name})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.status(500).send({message:'Error al borrar', data:error}));
    }
}

module.exports = {
    crearSerie,
    buscarSerie,
    modificarSerie,
    borrarSerie
}