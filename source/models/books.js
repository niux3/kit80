let db = require('../configuration/database');

module.exports = {
    state(callback){
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
                    callback(context);
                });
            });
        });
    },

    findall(callback){
        let context = {};

        db.select('b.id AS book_id', 'b.title AS book_title', 'a.firstname AS author_firstname', 'a.lastname AS author_lastname')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .orderBy('b.title').then((rows)=>{
                context['books'] = rows;
                callback(context);

            });
    },

    findall_by_authors(id, callback){
        let context = {};
        db.select('b.id AS bid', 'b.title AS btitle', 'b.url AS burl')
            .from('books AS b')
            .join('authors_books AS ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .where({'ab.authors_id' : parseInt(id)}).then((rows)=>{
                context['books'] = rows;
                callback(context);
            })
    },

    findone(id, callback){
        let context = {};
        db.select('b.id AS book_id', 'b.title AS title', 'b.url AS url', 'b.isbn AS isbn', 'b.summary AS summary', 'c.name AS categorie', 'a.firstname AS firstname', 'a.lastname AS lastname', 'a.id AS authors_id', 'c.id AS categories_id')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('categories AS c', 'c.id', 'b.categories_id')
            .where('b.id', id).then((rows)=>{
                context['book'] = rows[0];
                callback(context);
            });
    },

    is_valid(data){
        let err = {};
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

        return err;
    },

    insert(data, callback){
        let values = {}
        for(let [key, val] of Object.entries(data)){
            if(key !== 'authors_id'){
                values[key] = val;
            }
        }
        db.insert(values, ['id']).into('books').then((item)=>{
            let last_insert_id = item[0],
                values = {
                    books_id : last_insert_id,
                    authors_id : data.authors_id,
            };
            db.insert(values).into('authors_books').then(callback);
        });
    },

    get_authors_categories(callback){
        let context = {};
        db.select('id', 'name').from('categories').orderBy('name').then((rows)=>{
            context['categories'] = rows;
            db.select('id', 'firstname', 'lastname').from('authors').orderBy('lastname').then((rows)=>{
                context['authors'] = rows;
                callback(context);
            })
        });
    },

    delete(id, callback){
        db('books').where('id', parseInt(id, 10)).del().then(()=>{
            db('authors_books').where('authors_id', parseInt(id, 10)).del().then(callback);
        });
    },

    update(data, callback){

    },

    get_api(callback){
        db.select('b.title AS title', 'b.isbn AS isbn', 'b.url AS book_photo', 'b.summary AS summary', 'c.name AS categorie', 'a.firstname AS firstname', 'a.lastname AS lastname', 'a.url AS authors_photo')
            .from('books AS b')
            .join('authors_books as ab', 'b.id', 'ab.books_id')
            .join('authors AS a', 'a.id', 'ab.authors_id')
            .join('categories AS c', 'c.id', 'b.categories_id')
            .orderBy('b.title')
            .then(callback);
    },
}
