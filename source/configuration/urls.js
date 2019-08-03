var book_controller = require('../controllers/bookController'),
    author_controller = require('../controllers/authorsController'),
    categorie_controller = require('../controllers/categorieController');


module.exports = [
    /// LIVRES ///
    { method : "get", path : "/", view : book_controller.index,  name : "index" },
    { method : "get", path : "/catalogue/livres/api", view : book_controller.api, name : "api" },
    { method : "get", path : "/catalogue/livres", view : book_controller.book_list, name : "book_list" },
    { method : "get", path : "/catalogue/livre/:id", view : book_controller.book_detail, name : "book_detail" },
    { method : "get", path : "/catalogue/livre_ajouter", view : book_controller.book_create_get, name : "book_create_get" },
    { method : "post", path : "/catalogue/livre/ajouter", view : book_controller.book_create_post, name : "book_create_post" },
    { method : "get", path : "/catalogue/livre/supprimer/:id", view : book_controller.book_delete_get, name : "book_delete_get" },
    { method : "post", path : "/catalogue/livre/editer", view : book_controller.book_update_post, name : "book_update_post" },
    { method : "get", path : "/catalogue/livre/editer/:id", view : book_controller.book_update_get, name : "book_update_get" },

    /// AUTEUR ///
    { method : "get", path : "/catalogue/auteurs", view : author_controller.author_list, name : "author_list" },
    { method : "get", path : "/catalogue/auteur/:id", view : author_controller.author_detail, name : "author_detail" },
    { method : "get", path : "/catalogue/auteur_ajouter", view : author_controller.author_create_get, name : "author_create_get" },
    { method : "post", path : "/catalogue/auteurs/ajouter", view : author_controller.author_create_post, name : "author_create_post" },
    { method : "get", path : "/catalogue/auteurs/supprimer/:id", view : author_controller.author_delete_get, name : "author_delete_get" },
    { method : "get", path : "/catalogue/auteurs/editer/:id", view : author_controller.author_update_get, name : "author_update_get" },
    { method : "post", path : "/catalogue/auteurs/editer", view : author_controller.author_update_post, name : "author_update_post" },

    /// GENRE ROUTES ///
    { method : "get", path : "/catalogue/categories", view : categorie_controller.categorie_list, name : "categorie_list" },
    { method : "get", path : "/catalogue/categorie_ajouter", view : categorie_controller.categorie_create_get, name : "categorie_create_get" },
    { method : "post", path : "/catalogue/categorie/ajouter", view : categorie_controller.categorie_create_post, name : "categorie_create_post" },
    { method : "get", path : "/catalogue/categories/supprimer/:id", view : categorie_controller.categorie_delete_get, name : "categorie_delete_get" },
    { method : "get", path : "/catalogue/categories/editer/:id", view : categorie_controller.categorie_update_get, name : "categorie_update_get" },
    { method : "post", path : "/catalogue/categories/editer", view : categorie_controller.categorie_update_post, name : "categorie_update_post" }
];
