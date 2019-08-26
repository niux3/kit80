let books = require('../models/books');
let db = require('../configuration/database');
let reverseURL = require('../utils/reverseURL');

module.exports = {

    api(req, res){
        books.get_api((rows)=>{
            res.type('application/json');
            res.send(rows);
        });
    },


    home(req, res){
        books.state((context)=>{
            res.render('pages/index.twig', context);
        })
    },


    index(req, res){
        books.findall((context)=>{
            res.render('pages/books/index.twig', context);
        });
    },


    show(req, res){
        books.findone(req.params.id, (context)=>{
            if(context['book'] === undefined){
                res.redirect('/404NotFound');
            }
            res.render('pages/books/show.twig', context);
        });
    },


    create(req, res){
        let data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body;
            err = books.is_valid(data);
            if(Object.keys(err).length === 0){
                let values = {
                    title : data['title'].trim(),
                    isbn : data['isbn'].trim(),
                    url : data['url'].trim(),
                    summary : data['summary'].trim(),
                    categories_id : parseInt(data['categories_id'].trim(), 10),
                    authors_id : parseInt(data['authors_id'].trim(), 10),
                }
                books.insert(values, ()=>{
                    req.flash('flash', {type : 'success', txt : 'Votre livre a bien été ajouté'});
                    res.redirect(reverseURL('book_list'));
                });
            }
        }
        books.get_authors_categories((context)=>{
            context['error'] = err === null ? {} : err;
            if(err != null){
                req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
            }
            context['data'] = data === null ? {} : data;
            res.render('pages/books/edit.twig', context);
        });
    },


    remove(req, res){
        if(!/\d+/.test(req.params.id)){
            res.redirect(reverseURL('book_list'));
        }
        books.delete(req.params.id, ()=>{
            req.flash('flash', {type : 'success', txt : 'Votre suppression a bien été prise en compte'});
            res.redirect(reverseURL('book_list'));
        })
    },

    edit(req, res){
        let context = {},
        data = null,
        err = null;
        if(req.method === 'POST'){
            data = req.body;
            err = books.is_valid(data);
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
                            req.flash('flash', {type : 'success', txt : 'Votre modification a bien été prise en compte'});
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
        books.findone(req.params.id, (context)=>{
            db.select('id', 'name').from('categories').then((rows)=>{
                context['categories'] = rows;
                db.select('id', 'firstname', 'lastname').from('authors').then((rows)=>{
                    context['authors'] = rows;
                    context['error'] = err === null ? {} : err;
                    if(err != null){
                        req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
                    }
                    context['data'] = data === null ? context['book'] : data;
                    res.render('pages/books/edit.twig', context);
                })
            })
        })
        // db.select('b.id AS book_id', 'b.title AS title', 'b.isbn AS isbn', 'b.url AS url', 'b.summary AS summary', 'c.id AS categories_id', 'a.id AS authors_id')
        //     .from('books AS b')
        //     .join('authors_books AS ab', 'b.id', 'ab.books_id')
        //     .join('authors AS a', 'a.id', 'ab.authors_id')
        //     .join('categories AS c', 'c.id', 'b.categories_id')
        //     .where('b.id', parseInt(req.params.id, 10)).then((rows)=>{
        //         context['data'] = rows[0];
        //
        //     })
    },
};
