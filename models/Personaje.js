const {Schema, model} = require('mongoose');

const PersonajeSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria']
    },
    peso: {
        type: Number,
        required: [true, 'El peso es obligatorio']
    },
    historia: {
        type: String,
        required: [true, 'La historia es obligatoria']
    },
    imagen: {
        type: String,
        required: [true, 'El path de la imagen es obligatorio']
    },
    series: {
        type: [String],
        default: []
    },
    peliculas: {
        type: [String],
        default: []
    }
});

PersonajeSchema.methods.toJSON = function() {
    const {__v, ...personaje} = this.toObject();
    return personaje;
}

module.exports = model("Personaje", PersonajeSchema);