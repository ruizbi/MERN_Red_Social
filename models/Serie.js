const {Schema, model} = require('mongoose');

const SerieSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        unique: true
    },
    imagen: {
        type: String,
        required: [true, 'El path de la imagen es obligatorio']
    },
    fecha_creacion: {
        type: String,
        required: [true, 'La fecha de creacion es obligatoria']
    },
    calificacion: {
        type: Number,
        required: [true, 'La calificacion es obligatoria']
    },
    personajes: {
        type: [String],
        default: []
    }
});

SerieSchema.methods.toJSON = function() {
    const { __v, ...serie} = this.toObject();
    return serie;
}

module.exports = model("Serie", SerieSchema);