'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Creamos el esquema sobre el que trabajar
const usuarioSchema = mongoose.Schema({
    email: {type:String, unique:true},
    password: String
});

usuarioSchema.statics.hashPassword = function(passwordEnClaro){
    return bcrypt.hash(passwordEnClaro, 7);
}

usuarioSchema.methods.comparePassword = function(passwordEnClaro){
    return bcrypt.compare(passwordEnClaro, this.password);
}

//Creo el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema)

//Exporto el modelo
module.exports = Usuario;