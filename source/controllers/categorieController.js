let sqlite3 = require('sqlite3').verbose(),
    path = require('path'),
    dbPath = path.resolve(__dirname, '../data/database.db'),
    db = new sqlite3.Database(dbPath);

module.exports = {


    categorie_list(req, res) {
        let context = {},
            sql = `
                SELECT
                    id,
                    name
                FROM
                    categories
                ORDER BY
                    name
            `;
        db.all(sql, (err, rows)=>{
            context['categories'] = rows;
            res.render('pages/categories/index.twig', context);
        });
    },


    categorie_create_get(req, res) {
        res.render('pages/categories/edit.twig');
    },


    categorie_create_post(req, res) {
        let data = req.body,
            value = data['name'].trim(),
            context = {},
            params = {':name' : value},
            err = {},
            sql = `
                INSERT INTO
                    categories(name)
                VALUES
                    (:name)
            `;
        if(!/^[a-wéèêçàù ']+$/i.test(value)){
            err['name'] = "une catégorie ne doit pas contenir de chiffre ou de caractères 'spéciaux'";
        }
        if(value === ''){
            err['name'] = "ce champ ne doit pas être vide";
        }
        if(Object.keys(err).length === 0){
            db.run(sql, params, ()=>{
                res.redirect('/catalogue/livres');
            });
        }else{
            context = {
                'data' : data,
                'error' : err
            };
            res.render('pages/categories/edit.twig', context);
        }
    },


    categorie_delete_get(req, res) {
        res.send(`>>>> categories delete GET : ${req.params.id }`);
    },


    categorie_update_get(req, res) {
        let context = {},
            params = { ':id' : req.params.id },
            sql = `
                SELECT
                    id AS categories_id,
                    name
                FROM
                    categories
                WHERE
                    id = :id
            `;
            db.get(sql, params, (err, row)=>{
                context['data'] = row;
                res.render('pages/categories/edit.twig', context);
            });
    },


    categorie_update_post(req, res) {
        let data = req.body,
            value = data['name'].trim(),
            context = {},
            params = {':name' : value, ':id' : data['categories_id']},
            err = {},
            sql = `
                UPDATE
                    categories
                SET
                    name = :name
                WHERE
                    id = :id
            `;
        if(!/^[a-wéèêçàù ']+$/i.test(value)){
            err['name'] = "une catégorie ne doit pas contenir de chiffre ou de caractères 'spéciaux'";
        }
        if(value === ''){
            err['name'] = "ce champ ne doit pas être vide";
        }
        if(Object.keys(err).length === 0){
            db.run(sql, params, ()=>{
                res.redirect('/catalogue/categories');
            });
        }else{
            context = {
                'data' : data,
                'error' : err
            };
            res.render('pages/categories/edit.twig', context);
        }
    }
};
