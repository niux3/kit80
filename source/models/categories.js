let db = require('../configuration/database');

module.exports = {
    findall(callback){
        let context = {};
        db('categories').select('id', 'name').orderBy('name').then((rows)=>{
            context['categories'] = rows;
            callback(context);
        });
    },

    is_valid(data){
        let err = {};
            value = data['name'].trim();
        if(!/^[a-zéèêçàù ']+$/i.test(value)){
            err['name'] = "une catégorie ne doit pas contenir de chiffre ou de caractères 'spéciaux'";
        }
        if(value === ''){
            err['name'] = "ce champ ne doit pas être vide";
        }

        return err;
    },

    findone(id, callback){
        let context = {};
        db('categories').select('id', 'name').where('id', parseInt(id, 10)).then((rows)=>{
            context['data'] = rows[0];
            callback(context);
        })
    },

    save(data, callback){
        if(Object.keys(data).indexOf('id') !== -1){
            let params = {}
            for(let [key, value] of Object.entries(data)){
                if(key !== 'id'){
                    params[key] = value;
                }
            }
            db('categories').where('id', parseInt(data['id'], 10)).update(params).then(callback);
        }else{
            db.insert(data).into('categories').then(callback);
        }
    },
}
