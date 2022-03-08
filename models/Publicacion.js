const {Schema, model} = require('mongoose');

const PublicacionSchema = Schema({
    uid: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        required: [true, 'El path de la imagen es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    likes: {
        type: Array,
        default: []
    },
    comentarios: {
        type: Array,
        default: []
    }
});

PublicacionSchema.methods.toJSON = function() {
    const {__v, _id, ...resto} = this.toObject();
    resto.pid = _id;
    return resto;
};

module.exports = model('Publicacion', PublicacionSchema);