const express = require('express');

const routes = new express.Router();

const authMiddleware = require('./app/middlewares/auth');

const userController = require('./app/controllers/UserController');
const sessionController = require('./app/controllers/SessionController');
const docentesController = require('./app/controllers/DocentesController');
const discentesController = require('./app/controllers/DiscentesController');
const externosController = require('./app/controllers/ExternosController');

const metricsController = require('./app/controllers/MetricsController');

const generalMetricsController = require('./app/controllers/GeneralMetrics');

routes.get('/users', userController.getUsers);
routes.post('/storeUser', userController.storeUser);

routes.post('/authenticate', sessionController.store);

// Rotas a partir desse ponto são rotas com autentificação

routes.get('/authenticate', sessionController.authenticate);

routes.use(authMiddleware);

routes.get('/docentes', docentesController.getDocentes);
routes.get('/docentesNaoRepetidos', docentesController.getDocentesNaoRepetidos);

routes.get('/docentes-by-year/:year', docentesController.getDocentesByYear);
routes.get('/get-docentes-lista', docentesController.getDocentesLista);
routes.post('/post-departament-in-years', docentesController.getDepartamentInYears);

routes.get('/discentes', discentesController.getDiscentes)
routes.get('/discentes-by-year/:year', discentesController.getDiscentesByYear);
routes.post('/post-departament-in-years-discente', discentesController.getDepartamentInYears);

routes.get('/externos', externosController.getExternos)
routes.get('/externos-by-year/:year', externosController.getExternosByYear);
routes.post('/post-departament-in-years-externo', externosController.getDepartamentInYears);

routes.get('/metrics-financing', metricsController.getMetrics);
routes.get('/metrics-public', metricsController.getPublicMetric);
routes.get('/metrics-public-by-year/:year', metricsController.getPublicMetricByYear);

routes.get('/generalMetrics', generalMetricsController.getGeneralMetrics);
routes.post('/generalMetrics-in-departaments', generalMetricsController.getGeneralMetricsByDepartament);




module.exports = routes;