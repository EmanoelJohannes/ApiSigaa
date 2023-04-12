const express = require('express');

const routes = new express.Router();

const authMiddleware = require('./app/middlewares/auth');

const docentesController = require('./app/controllers/DocentesController');

const discentesController = require('./app/controllers/DiscentesController');

const externosController = require('./app/controllers/ExternosController');

// Rotas a partir desse ponto são rotas com autentificação
routes.get('/docentes', docentesController.getDocentes);
routes.get('/docentesNaoRepetidos', docentesController.getDocentesNaoRepetidos);

routes.get('/docentes-by-year/:year', docentesController.getDocentesByYear);
routes.get('/get-docentes-lista', docentesController.getDocentesLista);
routes.post('/post-departament-in-years', docentesController.getDepartamentInYears);

routes.get('/discentes', discentesController.getDiscentes)
routes.get('/discentes-by-year/:year', discentesController.getDiscentesByYear);

routes.get('/externos', externosController.getExternos)
routes.get('/externos-by-year/:year', externosController.getExternosByYear);

routes.use(authMiddleware);

module.exports = routes;