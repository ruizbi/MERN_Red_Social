const GeneroSchema = require('../models/Genero');

const crearGenero = async (req, res) => {
    let {nombre, imagen, peliculas, series} = req.body;
    let validar_genero = await GeneroSchema.findOne({nombre});
    
    if(validar_genero)
        return res.status(400).send({message:'El usuario ya existe', data:{}});

    let genero = new GeneroSchema({nombre, imagen, peliculas, series});

    genero
        .save()
        .then((data) => res.status(201).send({data, message:'Genero creado'}))
        .catch((error) => res.status(500).send({message:'Error al crear genero', data:error}));
};

const buscarGenero = (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        GeneroSchema
            .find()
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message:'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('nombre')){
        GeneroSchema
            .find({nombre:query.nombre})
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message:'Error en la busqueda', data:error}));    
    }
    else if(query.hasOwnProperty('id')){
        GeneroSchema
            .find({_id:query.id})
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.status(500).send({message:'Error en la busqueda', data:error}));    
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
};

const buscarPorID = (req, res) => {
    let {id} = req.query;
    GeneroSchema
        .findById({_id:id})
        .then((data) => (data) ? res.send({message:'Busqueda exitosa',data}):res.status(404).send({message:'No se encontro el genero', data:{}}))
        .catch((error) => res.status(500).send({message:'Error en la busqueda', data:error}));
};

const borrarGenero = (req, res) => {
    let {id} = req.query;
    GeneroSchema
        .remove({_id:id})
        .then((data) => res.send({data, message:'Eliminado con exito'}))
        .catch((error) => res.status(500).send({message:'Error al eliminar genero', data:error}));
};

const modificarGenero = (req, res) => {
    let {id} = req.query;
    let {_id, ...resto} = req.body;
    GeneroSchema
        .updateOne({_id:id}, {$set:resto})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.status(500).send({message:'Error al modificar genero', data:error}));
};

module.exports = {
    crearGenero,
    modificarGenero,
    buscarGenero,
    buscarPorID,
    borrarGenero
}