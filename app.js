const express = require('express');

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');

const app = express();

app.use(express.json());

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);

module.exports = app;
