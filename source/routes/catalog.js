var express = require('express'),
    routes = express.Router();

var book_controller = require('../controllers/bookController'),
    author_controller = require('../controllers/authorsController'),
    categorie_controller = require('../controllers/categorieController');


/// LIVRES ///
routes.get('/', book_controller.index);
routes.get('/livres', book_controller.book_list);
routes.get('/livre/:id', book_controller.book_detail);
routes.get('/livres/api', book_controller.api);
routes.get('/livre_ajouter', book_controller.book_create_get);
routes.post('/livre/ajouter', book_controller.book_create_post);
routes.get('/livre/supprimer/:id', book_controller.book_delete_get);
routes.get('/livre/editer/:id', book_controller.book_update_get);
routes.post('/livre/editer', book_controller.book_update_post);

/// AUTEUR ///
routes.get('/auteurs', author_controller.author_list);
routes.get('/auteur/:id', author_controller.author_detail);
routes.get('/auteur_ajouter', author_controller.author_create_get);
routes.post('/auteurs/ajouter', author_controller.author_create_post);
routes.get('/auteurs/supprimer/:id', author_controller.author_delete_get);
routes.get('/auteurs/editer/:id', author_controller.author_update_get);
routes.post('/auteurs/editer', author_controller.author_update_post);

/// GENRE ROUTES ///
routes.get('/categories', categorie_controller.categorie_list);
routes.get('/categorie_ajouter', categorie_controller.categorie_create_get);
routes.post('/categories/ajouter', categorie_controller.categorie_create_post);
routes.get('/categories/supprimer/:id', categorie_controller.categorie_delete_get);
routes.get('/categories/editer/:id', categorie_controller.categorie_update_get);
routes.post('/categories/editer', categorie_controller.categorie_update_post);


module.exports = routes;
