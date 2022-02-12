"use strict"

const express = require('express');
const router = express.Router();
const Anuncio = require("../../models/Anuncio");
const {upload} = require('../../lib/multerConfigure');
const convertirImagen = require('../../lib/resizeImage');


/* GET ANUNCIOS: OBTENER UNA LISTA DE AUNCIOS */

router.get("/", async (req, res, next) => {
    try{
        const nombre = req.query.nombre;
        const venta = req.query.venta;
        const precio = req.query.precio;
        const foto = req.query.foto;
        const tags = req.query.tags;
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const select = req.query.select;
        const sort = req.query.sort;

        const filtro = {};

        //Permitimos el filtro por nombre del producto
        if(nombre){
            filtro.nombre = new RegExp('^' + req.query.nombre, "i")
        }

        //Permitimos el filtro por venta del producto
        if(venta){
            filtro.venta = venta;
        }

        //Permitimos el filtro por precio del producto con rangos de precio
        if(precio){
            if(precio.includes("-")){
                let precioNuevo = precio.split("-");
                filtro.precio = {};
                if (precioNuevo[0]){
                    filtro.precio["$gte"] = precioNuevo[0]; //Precio mayor o igual al especificado
                }
                if (precioNuevo[1]){
                    filtro.precio["$lte"] = precioNuevo[1]; //Precio menor o igual al especificado
                }
            } else {
                filtro.precio = precio;
            }
        }

        //Busqueda de los tags
        if(tags){
            if(tags.includes(",")){
                let tagsFiltro = tags.split(",");
                filtro.tags = {};
                filtro.tags["$in"] = tagsFiltro;
            } else {
                filtro.tags = tags;
            }
        }

        const anuncios = await Anuncio.lista (filtro, skip, limit, select, sort );

        res.json({results: anuncios});

    }catch (err) {
        next(err);
        return;
    }
});

//GET/TAGS: OBTENER LOS TAGS USADOS EN LOS ANUNCIOS

router.get("/tags", async(req, res, next) =>{
    try{
        const etiquetas = await Anuncio.etiquetas();

        res.json({result: etiquetas});

    } catch (err) {
        next(err);
        return;
    }
});

//Petición POST para crear un nuevo anuncio

router.post("/", upload.single('foto'), async (req, res, next) => {
    try {
        const anuncioData = req.body;
        const foto = req.file;
        
        const anuncio = new Anuncio({
            nombre: anuncioData.nombre,
            precio: anuncioData.precio,
            venta: anuncioData.venta,
            tags: anuncioData.tags,
            foto: `${await convertirImagen(foto)}.jpg`
        });

        const anuncioCreado = await anuncio.save();

        res.status(201).json({result: anuncioCreado});
    } catch (err) {
        next(err);
        return;
    }
});

//Peticion DELETE para eliminar un anuncio

router.delete("/:id", async (req, res, next) => {
    try{
        const id = req.params.id;

        await Anuncio.deleteOne({_id: id}).exec();

        res.json({sucess: true});
    } catch (err) {
        next(err);
        return;
    }
})



module.exports = router;