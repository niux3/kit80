let db = require('../configuration/database');
let reverseURL = require('../utils/reverseURL');

module.exports = {


    index(req, res) {
        let context = {};
        db('categories').select('id', 'name').orderBy('name').then((rows)=>{
            context['categories'] = rows;
            res.render('pages/categories/index.twig', context);
        });
    },


    create(req, res){
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body,
            err = {};
            let value = data['name'].trim();
            if(!/^[a-zéèêçàù ']+$/i.test(value)){
                err['name'] = "une catégorie ne doit pas contenir de chiffre ou de caractères 'spéciaux'";
            }
            if(value === ''){
                err['name'] = "ce champ ne doit pas être vide";
            }
            if(Object.keys(err).length === 0){
                let params = {
                    name : value
                }
                db.insert(params).into('categories').then(()=>{
                    res.redirect(reverseURL('book_list'));
                })
            }else{
                context = {
                    'data' : data,
                    'error' : err
                };
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
            res.render('pages/categories/edit.twig', context);
        }
    },


    categorie_delete_get(req, res) {
        res.send(`>>>> categories delete GET : ${req.params.id }`);
    },


    edit(req, res){
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            data = req.body,
            err = {};
            let value = data['name'].trim();
            if(!/^[a-wéèêçàù ']+$/i.test(value)){
                err['name'] = "une catégorie ne doit pas contenir de chiffre ou de caractères 'spéciaux'";
            }
            if(value === ''){
                err['name'] = "ce champ ne doit pas être vide";
            }
            if(Object.keys(err).length === 0){
                db('categories')
                    .where('id', parseInt(data['categories_id'].trim(), 10))
                    .update({name : value, id : data['categories_id']}).then(()=>{
                        res.redirect(reverseURL('categorie_list'))
                    });
            }
        }
        db('categories').select('id AS categories_id', 'name').where('id',req.params.id).then((rows)=>{
            context['data'] = rows[0];
            context['error'] = err === null ? {} : err;
            context['data'] = data === null ? context['data'] : data;
            res.render('pages/categories/edit.twig', context);
        })
    },
};
