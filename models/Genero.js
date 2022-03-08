const {Schema, model} = require('mongoose');

const GeneroSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    imagen: {
        type: String,
        required: [true, 'El path de la imagen es obligatorio']
    },
    peliculas: {
        type: [String],
        default: []
    },
    series: {
        type: [String],
        default: []
    }
});

GeneroSchema.methods.toJSON = function() {
    const {__v, ...pelicula} = this.toObject();
    return pelicula;
}

module.exports = model("Genero", GeneroSchema);