const express = require('express');

const routes = new express.Router();

const authMiddleware = require('./app/middlewares/auth');

const userController = require('./app/controllers/UserController');

// Rotas a partir desse ponto são rotas com autentificação
routes.get('/scripts', userController.getScript);

routes.use(authMiddleware);

module.exports = routes;