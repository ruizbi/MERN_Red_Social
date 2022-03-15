require('dotenv').config();
const jwt = require('jsonwebtoken');

const generarJWT = (_id = '') => {
    return new Promise((resolve, reject) => {
        const payload = {_id};
        jwt.sign(payload, process.env.KEY_JWT, {expiresIn: "4h"}, (err, token) => {
        if(err) {
            console.log(err);
            reject('No se pudo generar el token');
        }
        else
            resolve(token);
        });
    });
}

module.exports = generarJWT;