let db = require('../configuration/database'),
    authors = require('../models/authors'),
    books = require('../models/books'),
    reverseURL = require('../utils/reverseURL');

module.exports = {


    index(req, res) {
        authors.findall((context)=>{
            res.render('pages/authors/index.twig', context);
        });
    },


    show(req, res) {
        let context = {}
        authors.findone(req.params.id, (rows)=>{
            if(rows === undefined){
                res.redirect('/404NotFound');
            }
            context['author'] = rows['author'];
            books.findall_by_authors(req.params.id, (rows)=>{
                context['books'] = rows['books'];
                res.render('pages/authors/show.twig', context);
            });
        });
    },


    create(req, res) {
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            err = authors.is_valid(req.body);
            if(Object.keys(err).length === 0){
                authors.save(req.body, ()=>{
                    req.flash('flash', {type : 'success', txt : 'Votre ajout a bien été prise en compte'});
                    res.redirect(reverseURL('author_list'));
                });
            }else{
                context['data'] = req.body;
                context['error'] = err;
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
            if(err != null){
                req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
            }
            res.render('pages/authors/edit.twig', context);
        }
    },


    remove(req, res) {
        if(!/\d+/.test(req.params.id)){
            res.redirect('/catalogue/auteurs');
        }
        //delete author
        db('authors').where('id', parseInt(req.params.id, 10)).del().then(()=>{
            //delete books
            db.select('b.id AS bid').from('books as b')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('authors_books AS ab', 'b.id', 'ab.books_id')
            .where('a.id', parseInt(req.params.id, 10)).then((rows)=>{
                req.flash('flash', {type : 'success', txt : 'Votre suppression a bien été prise en compte'});
                if(rows.length > 0){
                    db('books').where('id', rows[0].bid).del().then(()=>{
                        //delete authors_books
                        db('authors_books').where('authors_id', parseInt(req.params.id, 10)).del().then(()=>{
                            res.redirect(reverseURL('author_list'));
                        });
                    });
                }
                res.redirect(reverseURL('author_list'));
            })
        });
    },

    edit(req, res) {
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            err = authors.is_valid(req.body);
            if(Object.keys(err).length === 0){
                authors.save(req.body, ()=>{
                    req.flash('flash', {type : 'success', txt : 'Votre modification a bien été prise en compte'});
                    res.redirect(reverseURL('author_list'))
                });
            }else{
                context['data'] = req.body;
                context['error'] = err;
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
            authors.findone(req.params.id, (rows)=>{
                context['data'] = rows['author'];
                if(err != null){
                    req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
                }
                res.render('pages/authors/edit.twig', context);
            });
        }
    },
};
