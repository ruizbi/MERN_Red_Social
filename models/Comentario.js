const {Schema, model} = require('mongoose');

const ComentarioSchema = Schema({
    pid: {
        type: String,
        required: [true, 'El ID de la publicacion es obligatorio']
    },
    uid: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio']
    },
    message: {
        type: String,
        required: [true, 'El comentario no puede estar vacío']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    }
});

ComentarioSchema.methods.toJSON = function() {
    const {__v, _id, ...resto} = this.toObject();
    resto.cid = _id;
    return resto;
};

module.exports = model('Comentario', ComentarioSchema);