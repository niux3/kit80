let db = require('../configuration/database');
let reverseURL = require('../utils/reverseURL');

module.exports = {

    api(req, res){
        db.select('b.title AS title', 'b.isbn AS isbn', 'b.url AS book_photo', 'b.summary AS summary', 'c.name AS categorie', 'a.firstname AS firstname', 'a.lastname AS lastname', 'a.url AS authors_photo')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('categories AS c', 'c.id', 'b.categories_id')
            .orderBy('b.title')
            .then((rows)=>{
                res.type('application/json');
                res.send(rows);
            });
    },


    home(req, res){
        let context = {
            'books' : 0,
            'authors' : 0,
            'categories' : 0
        };
        db.from('books').count('*', {as: 'books'}).then((rows)=>{
            context['books'] = rows[0].books;
            db.from('authors').count('*', {as: 'authors'}).then((rows)=>{
                context['authors'] = rows[0].authors;
                db.from('categories').count('*', {as: 'categories'}).then((rows)=>{
                    context['categories'] = rows[0].categories;
                    res.render('pages/index.twig', context);
                });
            });
        });
    },


    index(req, res){
        let context = {};
        db.select('b.id AS book_id', 'b.title AS book_title', 'a.firstname AS author_firstname', 'a.lastname AS author_lastname')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .orderBy('b.title').then((rows)=>{
                context['books'] = rows;
                res.render('pages/books/index.twig', context);
            });
    },


    show(req, res){
        let context = {};
        db.select('b.id AS book_id', 'b.title AS book_title', 'b.url AS url', 'b.isbn AS isbn', 'b.summary AS summary', 'c.name AS categorie', 'a.firstname AS firstname', 'a.lastname AS lastname', 'a.id AS author_id')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('categories AS c', 'c.id', 'b.categories_id')
            .where('b.id', req.params.id).then((rows)=>{
                context['book'] = rows[0];
                if(context['book'] === undefined){
                    res.redirect('/404NotFound');
                }
                res.render('pages/books/show.twig', context);
            });
    },


    create(req, res){
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body,
            err = {};
            for(let k in data){
                let value = data[k].trim();
                switch(k){
                    case 'isbn':
                        if(!/\d{10}/.test(value)){
                            err[k] = "ce champ ne doit contenir une série de 10 chiffres";
                        }
                        break;

                    case 'url':
                        if(!/^http.+\.\w{2,4}$/.test(value)){
                            err[k] = "ce champ doit être une url valide";
                        }
                        break;
                }
                if(data[k].trim() === ''){
                    err[k] = "ce champ ne doit pas être vide";
                }
            }
            if(Object.keys(err).length === 0){
                let values = {
                    title : data['title'].trim(),
                    isbn : data['isbn'].trim(),
                    url : data['url'].trim(),
                    summary : data['summary'].trim(),
                    categories_id : parseInt(data['categories_id'].trim(), 10),
                }
                db.insert(values, ['id']).into('books').then((item)=>{
                    let last_insert_id = item[0];
                    values = {
                        books_id : last_insert_id,
                        authors_id : parseInt(data['authors_id'].trim(), 10)
                    };
                    db.insert(values).into('authors_books').then(()=>{
                        res.redirect(reverseURL('book_list'));
                    });
                });
            }
        }
        db.select('id', 'name').from('categories').orderBy('name').then((rows)=>{
            context['categories'] = rows;
            db.select('id', 'firstname', 'lastname').from('authors').orderBy('lastname').then((rows)=>{
                context['authors'] = rows;
                context['error'] = err === null ? {} : err;
                context['data'] = data === null ? {} : data;
                res.render('pages/books/edit.twig', context);
            })
        });
    },


    remove(req, res){
        if(!/\d+/.test(req.params.id)){
            res.redirect(reverseURL('book_list'));
        }
        db('books').where('id', parseInt(req.params.id, 10)).del().then(()=>{
            db('authors_books').where('id', parseInt(req.params.id, 10)).del().then(()=>{
                res.redirect(reverseURL('book_list'));
            })
        });
    },

    edit(req, res){
        let context = {},
        data = null,
        err = null;
        if(req.method === 'POST'){
            data = req.body,
            err = {};
            for(let k in data){
                let value = data[k].trim();
                switch(k){
                    case 'isbn':
                        if(!/\d{10}/.test(value)){
                            err[k] = "ce champ ne doit contenir une série de 10 chiffres";
                        }
                        break;

                    case 'url':
                        if(!/^http.+\.\w{2,4}$/.test(value)){
                            err[k] = "ce champ doit être une url valide";
                        }
                        break;
                }
                if(data[k].trim() === ''){
                    err[k] = "ce champ ne doit pas être vide";
                }
            }
            if(Object.keys(err).length === 0){
                db('books')
                    .where('id', parseInt(data['book_id'].trim(), 10))
                    .update({
                        title : data['title'].trim(),
                        isbn : data['isbn'].trim(),
                        url : data['url'].trim(),
                        summary : data['summary'].trim(),
                        categories_id : parseInt(data['categories_id'].trim(), 10),
                        id : parseInt(data['book_id'].trim(), 10),
                    }).then(()=>{
                        // author change ?
                        db('authors_books').select('authors_id').where('books_id', parseInt(data['book_id'].trim(), 10)).then((rows)=>{
                            if(parseInt(data['authors_id'].trim(), 10) !== parseInt(rows[0].authors_id, 10)){
                                let params = {
                                    authors_id : parseInt(data['authors_id'].trim(), 10),
                                    books_id : parseInt(data['book_id'].trim(), 10)
                                };
                                db('authors_books').update(params).where('books_id', parseInt(data['book_id'].trim(), 10)).then(()=>{
                                    res.redirect(reverseURL('book_list'));
                                })
                            }else{
                                res.redirect(reverseURL('book_list'));
                            }
                        })
                    });
            }
        }
        db.select('b.id AS book_id', 'b.title AS title', 'b.isbn AS isbn', 'b.url AS url', 'b.summary AS summary', 'c.id AS categories_id', 'a.id AS authors_id')
            .from('books AS b')
            .join('authors_books AS ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('categories AS c', 'c.id', 'b.categories_id')
            .where('b.id', parseInt(req.params.id, 10)).then((rows)=>{
                context['data'] = rows[0];
                db.select('id', 'name').from('categories').then((rows)=>{
                    context['categories'] = rows;
                    db.select('id', 'firstname', 'lastname').from('authors').then((rows)=>{
                        context['authors'] = rows;
                        context['error'] = err === null ? {} : err;
                        context['data'] = data === null ? context['data'] : data;
                        res.render('pages/books/edit.twig', context);
                    })
                })
            })
    },
};
