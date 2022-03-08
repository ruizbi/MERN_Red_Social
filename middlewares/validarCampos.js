const { validationResult } = require("express-validator");
const GeneroSchema = require('../models/Genero');
const PeliculaSchema = require('../models/Pelicula');
const SerieSchema = require('../models/Serie');
const PersonajeSchema = require('../models/Personaje');
const UsuarioSchema = require('../models/Usuario');

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.send(errors);
    next();
}

const elGeneroExiste = async (id) => {
    const validar_genero = await GeneroSchema.findById({_id:id});
    if(!validar_genero)
        throw new Error('El genero no existe');
}

const laPeliculaExiste = async (id) => {
    const validar_pelicula = await PeliculaSchema.findById({_id:id});
    if(!validar_pelicula)
        throw new Error('La pelicula no existe');
}

const laSerieExiste = async (id) => {
    const validar_serie = await SerieSchema.findById({_id:id});
    if(!validar_serie)
        throw new Error('La serie no existe');
}
const elPersonajeExiste = async (id) => {
    const validar_personaje = await PersonajeSchema.findById({_id:id});
    if(!validar_personaje)
        throw new Error('El personaje no existe');
}
const elCorreoExiste = async (correo) => {
    const validar_correo = await UsuarioSchema.findOne({correo});
    if(!validar_correo)
        throw new Error('El correo no existe')
}

module.exports = {
    validarCampos,
    elGeneroExiste,
    laPeliculaExiste,
    laSerieExiste,
    elPersonajeExiste,
    elCorreoExiste
};