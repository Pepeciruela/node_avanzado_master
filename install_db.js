"use strict"

require('dotenv').config();

const mongoose = require('mongoose');
const readline = require('readline');
const database = require("./lib/connectMongoose");
const anunciosData = require("./data/anuncios.json");

main().catch(err => console.log('Hubo un error', err));

const {Anuncio, Usuario} = require('./models');

async function main() {

  await new Promise((resolve, reject) => {
    database.once('open', resolve);
    database.once('error', reject);
  });

  if (!(await askYesNo('Estas seguro que quieres inicializar la BD? (yes/no)'))) {
    console.log('Abortado el comando. No se ha borrado nada.');
    return process.exit(0);
  }

  // inicializo la colección de anuncios
  await initAnuncios();

  // inicializo la colección de usuarios
  await initUsuarios();

  mongoose.connection.close();

}


async function initAnuncios() {
  // elimino todos los anuncios existentes
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

  // creo los anuncios iniciales
  const anuncios = await Anuncio.insertMany(anunciosData.anuncios);
  console.log(`Creados ${anuncios.length} anuncios.`);
};

async function initUsuarios() {

  await Usuario.deleteMany();
  console.log('Usuarios borrados.');

  const numLoaded = await Usuario.insertMany([
    {
      email: "user@example.com",
      password: await Usuario.hashPassword("1234")
    }
  ]);
  console.log(`Se han cargado ${numLoaded.length} usuarios.`);

  return numLoaded;

};

function askYesNo(questionText) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(questionText, answer => {
      rl.close();
      if (answer.toLowerCase() === 'yes') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  });
}

