'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionAuth = require('./lib/sessionMiddleware');
const jwtAuth = require('./lib/jwtAuthMiddleware');
const LoginController = require('./controllers/loginController');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const storageZone = multer.memoryStorage();
const upload = multer ({storage: storageZone});


const app = express();

const db = require('./lib/connectMongoose');

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');

const loginController = new LoginController();

app.use(session({
  name: 'nodeapi-session',
  secret: ']~J@:h2xS/JMvw>&B8H:};A\.L*]EP+H',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2
  },
  store: MongoStore.create({mongoUrl: process.env.MONGO_DB_CONNECTION})
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const i18n = require('./lib/i18nConfigure');
app.use(i18n.init);

app.use('/', require('./routes/login'));
app.use('/login', require('./routes/login'));

app.use('/anuncios', sessionAuth, require('./routes/anuncios'));
app.use('/change-locale', require('./routes/change-locale'));

app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout)


// Global Template variables
app.locals.title = 'NodePop';

// API v1
app.use('/api/anuncios', jwtAuth, require('./routes/api/index'));
app.post('/api/login', loginController.postJWT);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  
  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'not valid', errors: err.mapped()}
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);
  
  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
