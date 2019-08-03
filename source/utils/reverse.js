
let reverse = (name, params)=>{
    let urlCatch = this.urls.filter((url)=>{
            if(url.name === name){
                return url;
            }
        })[0],
        pattern = /:[a-z0-9]+/ig,
        paramsList = urlCatch.path.match(pattern);
    for(let i = 0; i <  paramsList.length; i++){
        let key = paramsList[i];
        urlCatch.path = urlCatch.path.replace(key, params[key]);
    }
    return urlCatch.path;

}
//let result = reverse('book_update_get', {':id' : 3});
