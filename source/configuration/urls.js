module.exports = [
    /// LIVRES ///
    { method : "get", path : "/", view : 'bookController.index',  name : "index" },
    { method : "get", path : "/catalogue/livres/api", view : 'bookController.api', name : "api" },
    { method : "get", path : "/catalogue/livres", view : 'bookController.book_list', name : "book_list" },
    { method : "get", path : "/catalogue/livre/:id", view : 'bookController.book_detail', name : "book_detail" },
    { method : "get", path : "/catalogue/livre_ajouter", view : 'bookController.book_create_get', name : "book_create_get" },
    { method : "post", path : "/catalogue/livre/ajouter", view : 'bookController.book_create_post', name : "book_create_post" },
    { method : "get", path : "/catalogue/livre/supprimer/:id", view : 'bookController.book_delete_get', name : "book_delete_get" },
    { method : "post", path : "/catalogue/livre/editer", view : 'bookController.book_update_post', name : "book_update_post" },
    { method : "get", path : "/catalogue/livre/editer/:id", view : 'bookController.book_update_get', name : "book_update_get" },
    //
    // /// AUTEUR ///
    { method : "get", path : "/catalogue/auteurs", view : 'authorsController.author_list', name : "author_list" },
    { method : "get", path : "/catalogue/auteur/:id", view : 'authorsController.author_detail', name : "author_detail" },
    { method : "get", path : "/catalogue/auteur_ajouter", view : 'authorsController.author_create_get', name : "author_create_get" },
    { method : "post", path : "/catalogue/auteurs/ajouter", view : 'authorsController.author_create_post', name : "author_create_post" },
    { method : "get", path : "/catalogue/auteurs/supprimer/:id", view : 'authorsController.author_delete_get', name : "author_delete_get" },
    { method : "get", path : "/catalogue/auteurs/editer/:id", view : 'authorsController.author_update_get', name : "author_update_get" },
    { method : "post", path : "/catalogue/auteurs/editer", view : 'authorsController.author_update_post', name : "author_update_post" },
    //
    // /// GENRE ROUTES ///
    { method : "get", path : "/catalogue/categories", view : 'categorieController.categorie_list', name : "categorie_list" },
    { method : "get", path : "/catalogue/categorie_ajouter", view : 'categorieController.categorie_create_get', name : "categorie_create_get" },
    { method : "post", path : "/catalogue/categorie/ajouter", view : 'categorieController.categorie_create_post', name : "categorie_create_post" },
    { method : "get", path : "/catalogue/categories/supprimer/:id", view : 'categorieController.categorie_delete_get', name : "categorie_delete_get" },
    { method : "get", path : "/catalogue/categories/editer/:id", view : 'categorieController.categorie_update_get', name : "categorie_update_get" },
    { method : "post", path : "/catalogue/categories/editer", view : 'categorieController.categorie_update_post', name : "categorie_update_post" }
];
