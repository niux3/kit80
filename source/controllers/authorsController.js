let db = require('../configuration/database'),
    reverseURL = require('../utils/reverseURL');

module.exports = {


    index(req, res) {
        let context = {};
        db.select('id', 'firstname', 'lastname', 'url').from('authors').orderBy('lastname').then((rows)=>{
            context['authors'] = rows;
            res.render('pages/authors/index.twig', context);
        });
    },


    show(req, res) {
        let context = {},
            params = {id : parseInt(req.params.id, 10)}
        db.select('id', 'firstname', 'lastname', 'url').from('authors').where(params).then((rows)=>{
            if(rows === undefined){
                res.redirect('/404NotFound');
            }
            context['author'] = rows[0];
            params = {}
            db.select('b.id AS bid', 'b.title AS btitle', 'b.url AS burl')
                .from('books AS b')
                .join('authors_books AS ab', 'b.id', 'ab.books_id')
                .join('authors AS a', 'a.id', 'ab.authors_id')
                .where({'ab.authors_id' : parseInt(req.params.id, 10)}).then((rows)=>{
                    context['books'] = rows;
                    res.render('pages/authors/show.twig', context);
                })
        });
    },


    create(req, res) {
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body;
            err = {};
            for(let k in data){
                let value = data[k].trim();
                switch(k){
                    case 'firstname':
                    case 'lastname':
                        if(/\d+/.test(value)){
                            err[k] = "Ce champ ne doit pas comporter de nombre";
                        }
                        break;
                        case 'url':
                            if(!/^http.+\.\w{2,4}$/.test(value)){
                                err[k] = "ce champ doit être une url valide";
                            }
                            break;
                }
                if(value === ""){
                    err[k] = "Ce champ ne doit pas être vide";
                }
            }
            if(Object.keys(err).length === 0){
                let params = {
                    firstname : data['firstname'],
                    lastname : data['lastname'],
                    url : data['url'],
                };
                db.insert(params).into('authors').then(()=>{
                    res.redirect(reverseURL('author_list'));
                });
            }else{
                context['data'] = data;
                context['error'] = err;
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
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
            params = {id : req.params.id},
            data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body;
            err = {};
            for(let k in data){
                let value = data[k].trim();
                switch(k){
                    case 'firstname':
                    case 'lastname':
                        if(/\d+/.test(value)){
                            err[k] = "Ce champ ne doit pas comporter de nombre";
                        }
                        break;
                        case 'url':
                            if(!/^http.+\.\w{2,4}$/.test(value)){
                                err[k] = "ce champ doit être une url valide";
                            }
                            break;
                }
                if(value === ""){
                    err[k] = "Ce champ ne doit pas être vide";
                }
            }
            if(Object.keys(err).length === 0){
                let set = {
                    firstname : data['firstname'],
                    lastname : data['lastname'],
                    url : data['url'],
                    id : data['authors_id']
                }
                db('authors').where(params).update(set).then(()=>{
                    res.redirect(reverseURL('author_list'))
                });
            }else{
                context['data'] = data;
                context['error'] = err;
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
            db.select('id AS authors_id', 'firstname', 'lastname', 'url').from('authors').where(params).then((rows)=>{
                context['data'] = rows[0];
                res.render('pages/authors/edit.twig', context);
            });
        }
    },
};
