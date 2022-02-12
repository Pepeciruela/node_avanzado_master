'use strict'

const sharp = require('sharp');
const { nanoid } = require('nanoid');
const fs = require('fs');

const convertirImagen = async (foto) => {
    const nombre = nanoid();
    fs.writeFileSync(`./public/images/${nombre}.jpg`, foto.buffer)
    const cambioImagen = sharp(foto.buffer).resize(100,100,{
        fit: 'cover'
    }).jpeg()
    const crearMiniatura = await cambioImagen.toBuffer()
    fs.writeFileSync(`./public/images/thumbnail/${nombre}.jpg`, crearMiniatura)
    console.log('acabo')
    return nombre
}

module.exports = convertirImagen;