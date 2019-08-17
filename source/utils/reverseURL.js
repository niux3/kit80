let urls = require('../configuration/routes');
let reverseUrl = (name, params)=>{
    let urlCatch = urls.filter((url)=>{
        if(url.name === name){
            return url;
        }
    })[0];
    if(params === undefined){
        return urlCatch.path;
    }else{
        let pattern = /:([a-z0-9]+)/ig,
            keywords = urlCatch.path.match(pattern),
            len = keywords.length,
            url = urlCatch.path;
        for(let i = 0; i <  len; i++){
            let key = keywords[i].substring(1);
                url = url.replace(':' + key, params[key]);
        }
        return url;
    }

}

module.exports = reverseUrl;
//let result = reverse('book_update_get', {':id' : 3});
