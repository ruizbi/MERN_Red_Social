const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    cuentaPrivada: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    alias: {
        type: String,
        required: [true, 'El alias es obligatorio'],
        unique: true
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    activo: {
        type: Boolean,
        default: true
    },
    seguidores: {
        type: Array,
        default: []
    },
    seguidos: {
        type: Array,
        default: []
    }
});

UsuarioSchema.methods.toJSON = function() {
    const {__v, _id, contraseña, ...resto} = this.toObject();
    resto.uid = _id;
    return resto;
}

module.exports = model("Usuario", UsuarioSchema);