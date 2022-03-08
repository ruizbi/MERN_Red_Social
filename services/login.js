const UsuarioSchema = require('../models/Usuario');
const generarJWT = require('../helpers/generarJWT');
const bcryptjs = require('bcryptjs');

const verificarUsuario = async (req, res) => {
    let {correo, contraseña} = req.body;
    let usuario = await UsuarioSchema.findOne({correo});

    if(!usuario)
        return res.status(400).send({message:'El usuario no existe o la contraseña es incorrecta', data:{}});
    if(!usuario.activo)
        return res.send({message:'El usuario no se encuentra activo', data:{}});

    const validar_password = bcryptjs.compareSync(contraseña, usuario.contraseña);
    
    if(!validar_password)
        return res.status(400).send({message:'El usuario no existe o la contraseña es incorrecta (PASS)', data:{}});

    const token = await generarJWT(usuario._id);
    res.send({message:'Loggin correcto', usuario, token});

/*    UsuarioSchema
        .findOne({correo, contraseña})
        .then( async (data) => {
            if(data) {
                const token = await generarJWT(data._id);
                res.send({message:'Loggin correcto', data, token})
            }
            else
                res.send({message:'El usuario no existe o la contraseña es incorrecta', data:{}})
        })
        .catch(error => res.send({message:'Error al logear', data:error})); */
};

const registrarUsuario = async (req, res) => {
    let {correo, contraseña, nombre} = req.body;
    let validar_correo = await UsuarioSchema.findOne({correo});

    if(validar_correo)
        return res.status(400).send({message:'El mail ya esta registrado', data:{}});

    let usuario = new UsuarioSchema({correo, contraseña, nombre});
    let salt = bcryptjs.genSaltSync();
    usuario.contraseña = bcryptjs.hashSync(contraseña, salt);
    usuario
        .save()
        .then((data) => res.send({data, message:'Usuario creado'}))
        .catch((error) => res.status(500).send({data:error, message:'Error al crear usuario'}));
};

const desactivarUsuario = async (req, res) => {
    let {correo, contraseña} = req.body;
    let validar_correo = await UsuarioSchema.findOne({correo, contraseña});
    
    if(!validar_correo)
        return res.status(404).send({message:'El mail no existe'});
    
    UsuarioSchema
        .updateOne({correo}, {$set:{activo:false}})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.status(500).send({message:'Error al modificar usuario', data:error}));
};

module.exports = {
    verificarUsuario,
    registrarUsuario,
    desactivarUsuario
}
