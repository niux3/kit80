var express = require('express'),
    routes = express.Router();


routes.get('/', function(req, res, next) {
    res.redirect('/catalogue');
});

module.exports = routes;
