const express = require('express');

const routes = new express.Router();

const authMiddleware = require('./app/middlewares/auth');

const docentesController = require('./app/controllers/DocentesController');

// Rotas a partir desse ponto são rotas com autentificação
routes.get('/docentes/:year', docentesController.getDocentes);
routes.get('/docentes-by-year/:year', docentesController.getDocentesByYear);

routes.use(authMiddleware);

module.exports = routes;