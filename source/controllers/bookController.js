let sqlite3 = require('sqlite3').verbose(),
    path = require('path'),
    dbPath = path.resolve(__dirname, '../data/database.db'),
    db = new sqlite3.Database(dbPath);

module.exports = {


    api(req, res){
        let context = {},
            sql = `
                SELECT
                    b.title AS title,
                    b.isbn AS isbn,
                    b.url AS book_photo,
                    b.summary AS summary,
                    c.name AS categorie,
                    a.firstname AS firstname,
                    a.lastname AS lastname,
                    a.url AS authors_photo
                FROM
                    books AS b,
                    authors AS a,
                    authors_books AS ab,
                    categories AS c
                WHERE
                    b.id = ab.books_id
                AND
                    a.id = ab.authors_id
                AND
                    c.id = b.categories_id
                ORDER BY
                    b.title
            `;
        db.all(sql, (err, rows)=>{
            res.type('application/json');
            res.send(rows);
        });
    },


    index(req, res){
        let context = {
                'books' : 0,
                'authors' : 0,
                'categories' : 0
            },
            sql = `SELECT COUNT(*) as books FROM books `;
        db.get(sql,(err, row)=>{
            context['books'] = row.books;
            sql = `SELECT COUNT(*) as authors FROM authors `;
            db.get(sql,(err, row)=>{
                context['authors'] = row.authors;
                sql = `SELECT COUNT(*) as categories FROM categories `;
                db.get(sql,(err, row)=>{
                    context['categories'] = row.categories;
                    res.render('pages/index.twig', context);
                });
            });
        });
    },


    book_list(req, res){
        let context = {},
            sql = `
                SELECT
                    b.id AS book_id,
                    b.title AS book_title,
                    a.firstname AS author_firstname,
                    a.lastname AS author_lastname
                FROM
                    books AS b,
                    authors AS a,
                    authors_books AS ab
                WHERE
                    b.id = ab.books_id
                AND
                    a.id = ab.authors_id
                ORDER BY
                    b.title
        `;
        db.all(sql,(err, row)=>{
            context['books'] = row;
            res.render('pages/books/index.twig', context);
        });
    },


    book_detail(req, res){
        let context = {},
            sql = `
                SELECT
                    b.id AS book_id,
                    b.title AS title,
                    b.isbn AS isbn,
                    b.url AS url,
                    b.summary AS summary,
                    c.name AS categorie,
                    a.firstname AS firstname,
                    a.lastname AS lastname,
                    a.id AS author_id
                FROM
                    books AS b,
                    authors AS a,
                    authors_books AS ab,
                    categories AS c
                WHERE
                    b.id = ab.books_id
                AND
                    a.id = ab.authors_id
                AND
                    c.id = b.categories_id
                AND
                    b.id = $id
            `,
            params = {$id : req.params.id};
        db.get(sql,params, (err, row)=>{
            context['book'] = row;
            if(context['book'] === undefined){
                res.redirect('/404NotFound');
            }
            res.render('pages/books/show.twig', context);
        });
    },


    book_create_get(req, res){
        let context = {},
            sql = `SELECT  id, name  FROM categories ORDER BY name`;
        db.all(sql, (err, rows)=>{
            context['categories'] = rows;
            sql = `SELECT  id, firstname, lastname  FROM authors ORDER BY lastname`;

            db.all(sql, (err, rows)=>{
                context['authors'] = rows;
                res.render('pages/books/edit.twig', context);
            });
        });
    },


    book_create_post(req, res){
        let data = req.body,
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
            let sql = `
                    INSERT INTO
                        books (title, isbn, url, summary, categories_id)
                    VALUES
                        (:title, :isbn, :url, :summary, :categories_id)
                `,
                params = {
                    ':title' : data['title'].trim(),
                    ':isbn' : data['isbn'].trim(),
                    ':url' : data['url'].trim(),
                    ':summary' : data['summary'].trim(),
                    ':categories_id' : parseInt(data['categories_id'].trim(), 10),
                },
                id = 0;
            db.run(sql, params);
            sql = 'SELECT id FROM books ORDER BY id DESC LIMIT 1';
            db.each(sql, (err, row)=>{
                id = parseInt(row.id, 10);
            }, ()=>{
                sql = `
                    INSERT INTO
                        authors_books (books_id,authors_id)
                    VALUES
                        (:bid, :aid)
                `;
                params = {
                    ':bid' : id,
                    ':aid' : parseInt(data['authors_id'].trim(), 10)
                };
                db.run(sql, params, (err, row)=>{
                    res.redirect('/catalogue/livres');
                });
            });
        }else{
            let categories = [],
                authors = [],
                context = {},
                sql = `SELECT  id, name  FROM categories`;
            db.each(sql, (err, row)=>{
                categories.push(row);
            },()=>{
                let sql = `SELECT  id, firstname, lastname  FROM authors`;
                context['categories'] = categories;
                db.each(sql, (err, row)=>{
                    authors.push(row);
                },()=>{
                    context['authors'] = authors;
                    context['error'] = err;
                    context['data'] = data;
                    res.render('pages/books/edit.twig', context);
                });
            });
        }
    },


    book_delete_get(req, res){
        if(!/\d+/.test(req.params.id)){
            res.redirect('/catalogue/livres');
        }
        let sql = 'DELETE FROM books WHERE id = :id',
            params = {':id' : parseInt(req.params.id, 10)};
        db.run(sql, params, (err, row)=>{
            sql = 'DELETE FROM authors_books WHERE books_id = :id';
            db.run(sql, params, (err, row)=>{
                res.redirect('/catalogue/livres');
            })
        });
    },


    book_update_get(req, res){
        let context = {},
        params = {
            ':id' : parseInt(req.params.id, 10)
        },
        sql = `
            SELECT
                b.id AS book_id,
                b.title AS title,
                b.isbn AS isbn,
                b.url AS url,
                b.summary AS summary,
                c.id AS categories_id,
                a.id AS authors_id
            FROM
                books AS b,
                authors AS a,
                authors_books AS ab,
                categories AS c
            WHERE
                b.id = ab.books_id
            AND
                a.id = ab.authors_id
            AND
                c.id = b.categories_id
            AND
                b.id = :id
        `,
        categories = [],
        authors = [];
        db.each(sql, params, (err, row)=>{
            context['data'] = row;
        }, ()=>{
            if(context['data'] === undefined){
                res.redirect('/404NotFound');
            }
            sql = `SELECT  id, name  FROM categories`;
            db.each(sql, (err, row)=>{
                categories.push(row);
            },()=>{
                let sql = `SELECT  id, firstname, lastname  FROM authors`;
                context['categories'] = categories;
                db.each(sql, (err, row)=>{
                    authors.push(row);
                },()=>{
                    context['authors'] = authors;
                    res.render('pages/books/edit.twig', context);
                });
            });
        });
    },

    
    book_update_post(req, res){
        let data = req.body,
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
            let sql = `
                UPDATE
                    books
                SET
                    title = :title,
                    isbn = :isbn,
                    url = :url,
                    summary = :summary,
                    categories_id = :categories_id
                WHERE
                    id = :id
                `,
                params = {
                    ':title' : data['title'].trim(),
                    ':isbn' : data['isbn'].trim(),
                    ':url' : data['url'].trim(),
                    ':summary' : data['summary'].trim(),
                    ':categories_id' : parseInt(data['categories_id'].trim(), 10),
                    ':id' : parseInt(data['book_id'].trim(), 10),
                };
            db.run(sql, params, (err, row)=>{
                let authors_id = 0;
                sql = `SELECT authors_id FROM authors_books WHERE books_id = :id`,
                params = {':id' : parseInt(data['book_id'].trim(), 10)};
                db.each(sql, params, (err, row)=>{
                    authors_id = row.authors_id;
                },()=>{
                    if(parseInt(data['authors_id'].trim(), 10) !== parseInt(authors_id, 10)){
                        sql = `
                            UPDATE
                                authors_books
                            SET
                                authors_id = :authors_id
                            WHERE
                                books_id = :book_id
                        `,
                        params = {
                            ':authors_id' : parseInt(data['authors_id'].trim(), 10),
                            ':book_id' : parseInt(data['book_id'].trim(), 10)
                        };
                        db.run(sql, params);
                    }
                    res.redirect('/catalogue/livres');
                })
            });
        }else{
            let categories = [],
                authors = [],
                context = {},
                sql = `SELECT  id, name  FROM categories`;
            db.each(sql, (err, row)=>{
                categories.push(row);
            },()=>{
                let sql = `SELECT  id, firstname, lastname  FROM authors`;
                context['categories'] = categories;
                db.each(sql, (err, row)=>{
                    authors.push(row);
                },()=>{
                    context['authors'] = authors;
                    context['error'] = err;
                    context['data'] = data;
                    res.render('pages/books/edit.twig', context);
                });
            });
        }
    }
};
