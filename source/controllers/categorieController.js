let db = require('../configuration/database');
let categories = require('../models/categories');
let reverseURL = require('../utils/reverseURL');

module.exports = {


    index(req, res) {
        categories.findall((context)=>{
            res.render('pages/categories/index.twig', context);
        })
    },


    create(req, res){
        let context = {},
            data = null,
            err = null;
        if(req.method === 'POST'){
            err = categories.is_valid(req.body);
            if(Object.keys(err).length === 0){
                categories.save(req.body, ()=>{
                    req.flash('flash', {type : 'success', txt : 'Votre ajout a bien été prise en compte'});
                    res.redirect(reverseURL('book_list'));
                });
            }else{
                context = {
                    'data' : req.body,
                    'error' : err
                };
            }
        }
        if(req.method === 'GET' || context['error'] !== undefined){
            if(err != null){
                req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
            }
            res.render('pages/categories/edit.twig', context);
        }
    },


    categorie_delete_get(req, res) {
        res.send(`>>>> categories delete GET : ${req.params.id }`);
    },


    edit(req, res){
        let data = null,
            err = null;
        if(req.method === 'POST'){
            err = categories.is_valid(req.body);
            if(Object.keys(err).length === 0){
                categories.save(req.body, ()=>{
                    req.flash('flash', {type : 'success', txt : 'Votre modification a bien été prise en compte'});
                    res.redirect(reverseURL('categorie_list'))
                });
            }
        }
        categories.findone(req.params.id, (context)=>{
            context['error'] = err === null ? {} : err;
            if(err != null){
                req.flash('flash', {type : 'danger', txt : 'Il y a une ou plusieurs erreurs dans votre saisie'});
            }
            context['data'] = data === null ? context['data'] : req.body;
            res.render('pages/categories/edit.twig', context);
        })
    },
};
