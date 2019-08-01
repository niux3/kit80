var sqlite3 = require('sqlite3').verbose(),
    path = require('path'),
    dbPath = path.resolve(__dirname, '../data/database.db'),
    db = new sqlite3.Database(dbPath);


exports.author_list = function(req, res) {
    let context = {},
        sql = `
            SELECT
                id,
                firstname,
                lastname,
                url
            FROM
                authors
            ORDER BY
                lastname
        `;
    db.all(sql, (err, rows)=>{
        context['authors'] = rows;
        res.render('pages/authors/index.twig', context);
    });
};


exports.author_detail = function(req, res) {
    let context = {},
        params = {':id' : parseInt(req.params.id, 10)}
        sql = `
            SELECT
                id,
                firstname,
                lastname,
                url
            FROM
                authors
            WHERE
                id = :id
        `;
    db.get(sql, params, (err, row)=>{
        if(row === undefined){
            res.redirect('/404NotFound');
        }else{
            context['author'] = row;
            sql = `
                SELECT
                    b.id AS bid,
                    b.title AS btitle,
                    b.url AS burl
                FROM
                    books AS b,
                    authors_books AS ab,
                    authors AS a
                WHERE
                    b.id = ab.books_id
                AND
                    a.id = ab.authors_id
                AND
                    ab.authors_id = :id
            `;
            db.all(sql, params, (err, rows)=>{
                context['books'] = rows;
                res.render('pages/authors/show.twig', context);
            });
        }
    });
};


exports.author_create_get = function(req, res) {
    res.render('pages/authors/edit.twig');
};


exports.author_create_post = function(req, res) {
    let data = req.body,
        err = {},
        context = {};
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
        let sql = `
                INSERT INTO
                    authors(firstname, lastname, url)
                VALUES
                    (:firstname, :lastname, :url)
            `,
            params = {
                ':firstname' : data['firstname'],
                ':lastname' : data['lastname'],
                ':url' : data['url'],
        };
        db.run(sql, params, ()=>{
            res.redirect('/catalogue/livres');
        });
    }else{
        context = {
            'data' : data,
            'error' : err
        };
        res.render('pages/authors/edit.twig', context);
    }
};


exports.author_delete_get = function(req, res) {
    if(!/\d+/.test(req.params.id)){
        res.redirect('/catalogue/auteurs');
    }
    let sql = 'DELETE FROM authors WHERE id = :id',
        params = {':id' : parseInt(req.params.id, 10)};

    db.run(sql, params, (err, row)=>{
        sql = `
            SELECT
                b.id AS bid
            FROM
                books AS b,
                authors AS a,
                authors_books AS ab
            WHERE
                a.id = ab.authors_id
            AND
                b.id = ab.books_id
            AND
                a.id = :id
        `;
        db.each(sql, params, (err, row)=>{
            sql = 'DELETE FROM books where id = :bid';
            db.run(sql, {':bid':row.bid});
        },()=>{
            sql = 'DELETE FROM authors_books WHERE authors_id = :id';
            db.run(sql, params, (err, row)=>{
                res.redirect('/catalogue/livres');
            });
        });
    });
};


exports.author_update_get = function(req, res) {
    let context = {},
        params = {':id' : req.params.id},
        sql = `
            SELECT
                id AS authors_id,
                firstname,
                lastname,
                url
            FROM
                authors
            WHERE
                id = :id
        `;
    db.get(sql, params, (err, row)=>{
        context['data'] = row;
        res.render('pages/authors/edit.twig', context);
    });
};


exports.author_update_post = function(req, res) {
    let data = req.body,
        err = {},
        context = {};
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
        let sql = `
                UPDATE
                    authors
                SET
                    firstname = :firstname,
                    lastname = :lastname,
                    url = :url
                WHERE
                    id = :id
            `,
            params = {
                ':firstname' : data['firstname'],
                ':lastname' : data['lastname'],
                ':url' : data['url'],
                ':id' : data['authors_id']
        };
        db.run(sql, params, ()=>{
            res.redirect('/catalogue/livres');
        });
    }else{
        context = {
            'data' : data,
            'error' : err
        };
        res.render('pages/authors/edit.twig', context);
    }
};
