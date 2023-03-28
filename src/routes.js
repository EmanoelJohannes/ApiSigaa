const express = require('express');

const routes = new express.Router();

const authMiddleware = require('./app/middlewares/auth');

const docentesController = require('./app/controllers/DocentesController');

const discentesController = require('./app/controllers/DiscentesController');

// Rotas a partir desse ponto são rotas com autentificação
routes.get('/docentes', docentesController.getDocentes);
routes.get('/docentes-by-year/:year', docentesController.getDocentesByYear);

routes.get('/discentes', discentesController.getDiscentes)
routes.get('/docentes-by-year/:year', discentesController.getDiscentesByYear);

routes.use(authMiddleware);

module.exports = routes;