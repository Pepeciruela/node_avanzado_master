"use strict"

require('dotenv').config();

const mongoose = require("mongoose");

mongoose.connection.on('error', err => {
    console.log('Se ha producido un error de conexión', err);
    process.exit(1);
  });
  
  mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB a la BD:', mongoose.connection.name);
  });
  
  // me conecto a la BD
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
  });
  
  // opcional
  module.exports = mongoose.connection;
  