let db = require('../configuration/database');

module.exports = {

    findall(callback){
        let context = {};
        db.select('id', 'firstname', 'lastname', 'url').from('authors').orderBy('lastname').then((rows)=>{
            context['authors'] = rows;
            callback(context);
        });
    },

    findone(id, callback){
        let context = {},
            params = {id : parseInt(id, 10)}
        db.select('id', 'firstname', 'lastname', 'url').from('authors').where(params).then((rows)=>{
            context['author'] = rows[0];
            callback(context);
        });
    },

    is_valid(data){
        let err = {};
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

        return err;
    },

    save(data, callback){
        if(Object.keys(data).indexOf('id') !== -1){
            let params = {}
            for(let [key, value] of Object.entries(data)){
                if(key !== 'id'){
                    params[key] = value;
                }
            }
            db('authors').where('id', parseInt(data['id'], 10)).update(params).then(callback);
        }else{
            db.insert(data).into('authors').then(callback);
        }
    },
}
