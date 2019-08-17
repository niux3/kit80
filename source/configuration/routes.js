module.exports = [
    /// LIVRES ///
    { method : "get", path : "/", view : 'bookController.home',  name : "index" },
    { method : "get", path : "/catalogue/livres/api", view : 'bookController.api', name : "api" },
    { method : "get", path : "/catalogue/livres", view : 'bookController.index', name : "book_list" },
    { method : "get; post", path : "/catalogue/livre/ajouter", view : 'bookController.create', name : "book_create" },
    { method : "get; post", path : "/catalogue/livre/editer/:id", view : 'bookController.edit', name : "book_update" },
    { method : "get", path : "/catalogue/livre/:id", view : 'bookController.show', name : "book_detail" },
    { method : "get", path : "/catalogue/livre/supprimer/:id", view : 'bookController.remove', name : "book_delete_get" },

    // /// AUTEUR ///
    { method : "get", path : "/catalogue/auteurs", view : 'authorsController.author_list', name : "author_list" },
    { method : "get", path : "/catalogue/auteur/:id", view : 'authorsController.author_detail', name : "author_detail" },
    { method : "get", path : "/catalogue/auteur_ajouter", view : 'authorsController.author_create_get', name : "author_create_get" },
    { method : "post", path : "/catalogue/auteurs/ajouter", view : 'authorsController.author_create_post', name : "author_create_post" },
    { method : "get", path : "/catalogue/auteurs/supprimer/:id", view : 'authorsController.author_delete_get', name : "author_delete_get" },
    { method : "get", path : "/catalogue/auteurs/editer/:id", view : 'authorsController.author_update_get', name : "author_update_get" },
    { method : "post", path : "/catalogue/auteurs/editer", view : 'authorsController.author_update_post', name : "author_update_post" },

    // /// GENRE ///
    { method : "get", path : "/catalogue/categories", view : 'categorieController.index', name : "categorie_list" },
    { method : "get; post", path : "/catalogue/categorie/ajouter", view : 'categorieController.create', name : "categorie_create" },
    { method : "get; post", path : "/catalogue/categories/editer/:id", view : 'categorieController.edit', name : "categorie_update" },
    { method : "get", path : "/catalogue/categories/supprimer/:id", view : 'categorieController.categorie_delete_get', name : "categorie_delete" },
    { method : "post", path : "/catalogue/categories/editer", view : 'categorieController.categorie_update_post', name : "categorie_update_post" }
];
