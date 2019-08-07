class Server{
    constructor(){
        //dependances
        let Twig = require("twig");

        this.path = require('path');
        this.Twig = Twig;
        this.express = require('express');
        this.session = require('express-session'); 
        this.cookieParser = require('cookie-parser');
        this.logger = require('morgan');
        this.app = this.express();
        this.urls = require('./configuration/routes');
    }

    run(){
        try{
            //config project
            const ROOT_PATH = this.path.resolve('./');
            const WWW_PATH = ROOT_PATH + '/public';
            const PORT = 3000;

            //config app object
            this.app.set("twig options", {
                allow_async: true, // Allow asynchronous compiling
                strict_variables: false
            });

            //bad bug twig extension (2 loops ??) !
            let counter = 0;
            this.Twig.extendFunction("url", (name, params)=> {
                if(counter === 0){
                    let urlCatch = this.urls.filter((url)=>{
                        if(url.name === name){
                            return url;
                        }
                    })[0];
                    if(params === undefined){
                        return urlCatch.path;
                    }
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
                counter+= 1;
            });

            this.app.set("views", ROOT_PATH + '/source/views');

            //middleware
            this.app.use(this.logger('dev'));
            this.app.use(this.express.json());
            this.app.use(this.express.urlencoded({ extended: false }));
            this.app.use(this.cookieParser());
            this.app.use(this.express.static('public'));

            //session
            let sess = {
                secret: 'keyboard cat',
                cookie: {},
                resave: false,
                saveUninitialized: false,
            };

            if (this.app.get('env') && this.app.get('env') === 'production') {
                this.app.set('trust proxy', 1) // trust first proxy
                sess.cookie.secure = true // serve secure cookies
                sess.saveUninitialized = true;
            }
            this.app.use(require('express-session')(sess));

            // routes
            let routes = this.express.Router(),
                setRoute = (url, method, routes)=>{
                    url.view = require('./controllers/controllerFactory')(url.view);
                    switch(method.trim().toLowerCase()){
                        case 'post':
                            routes.post(url.path, url.view);
                            break;
                        case 'put':
                            routes.put(url.path, url.view);
                            break;
                        case 'get':
                            routes.get(url.path, url.view);
                            break;
                    }
                    return routes;
                };

            for(let i in this.urls){
                let url = this.urls[ i ];
                if(url.method.indexOf(',') !== -1){
                    let methods = url.method.split(',')
                    for(let j = 0; j < methods.length; j++){
                        routes = setRoute(url,methods[j], routes);
                    }
                }else{
                    routes = setRoute(url,url.method, routes);
                }
            }
            this.app.use('/', routes);



            // catch 404 and forward to error handler
            this.app.use(function(req, res, next) {
                return next(require('http-errors')(404, '404 not found'));
            });

            // error handler
            this.app.use(function(err, req, res, next) {
                // set locals, only providing error in development
                res.locals.message = err.message;
                //res.locals.error = req.app.get('env') === 'development' ? err : {};

                // render the error page
                let statusErr = err.status || 500,
                    view = "404";
                res.status(statusErr);
                if(statusErr >= 500){
                    view = "500"
                }
                res.render(`errors/${view}.twig`);
            });

            //execute
            this.app.listen(PORT, ()=>{
                console.log(`Server is listening on port ${PORT}`);
                console.log(`http://localhost:${PORT}`);
            });
        }catch(err){
            console.error('error system ====> ', err);
        }
    }
}
new Server().run();
