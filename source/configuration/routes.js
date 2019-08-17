module.exports = [
    /// LIVRES ///
    { method : "get", path : "/", view : 'bookController.home',  name : "index" },
    { method : "get", path : "/catalogue/livres/api", view : 'bookController.api', name : "api" },
    { method : "get", path : "/catalogue/livres", view : 'bookController.index', name : "book_list" },
    { method : "get; post", path : "/catalogue/livre/ajouter", view : 'bookController.create', name : "book_create" },
    { method : "get; post", path : "/catalogue/livre/editer/:id", view : 'bookController.edit', name : "book_update" },
    { method : "get", path : "/catalogue/livre/:id", view : 'bookController.show', name : "book_detail" },
    { method : "get", path : "/catalogue/livre/supprimer/:id", view : 'bookController.remove', name : "book_delete_get" },

    /// AUTEUR ///
    { method : "get", path : "/catalogue/auteurs", view : 'authorsController.index', name : "author_list" },
    { method : "get; post", path : "/catalogue/auteur/ajouter", view : 'authorsController.create', name : "author_create" },
    { method : "get; post", path : "/catalogue/auteurs/editer/:id", view : 'authorsController.edit', name : "author_update" },
    { method : "get", path : "/catalogue/auteur/:id", view : 'authorsController.show', name : "author_detail" },
    { method : "get", path : "/catalogue/auteurs/supprimer/:id", view : 'authorsController.remove', name : "author_delete_get" },

    /// GENRE ///
    { method : "get", path : "/catalogue/categories", view : 'categorieController.index', name : "categorie_list" },
    { method : "get; post", path : "/catalogue/categorie/ajouter", view : 'categorieController.create', name : "categorie_create" },
    { method : "get; post", path : "/catalogue/categories/editer/:id", view : 'categorieController.edit', name : "categorie_update" },
    { method : "get", path : "/catalogue/categories/supprimer/:id", view : 'categorieController.categorie_delete_get', name : "categorie_delete" },
];
