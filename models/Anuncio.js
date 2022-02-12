"use strict"

const mongoose = require("mongoose");

//Creamos el esquema de nuestro anuncios
const schemaAnuncio = mongoose.Schema({
    nombre: {type: String,
            require: true,
        },
    venta: {type: Boolean,
            require: true,
        },
    precio: {type: Number,
            require: true,
    },
    foto: {type: String,
    },
    tags: {type: [String]}
});

//Creamos un método estático

schemaAnuncio.statics.lista = (filtro, skip, limit, fields, sort) => {
    const query = Anuncio.find(filtro);
    query.skip(skip);
    query.limit(limit);
    query.select(fields);
    query.sort(sort);
    return query.exec();
};

schemaAnuncio.statics.etiquetas = () => {
    const query = Anuncio.find().distinct("tags");
    return query.exec();
}

//Creamos el modelo
const Anuncio = mongoose.model("Anuncio", schemaAnuncio);

//Lo exportamos
module.exports = Anuncio;