module.exports = class Server{
    constructor(){
        //dependances
        this.path = require('path');
        this.Twig = require("twig");
        this.express = require('express');
        this.cookieParser = require('cookie-parser');
        this.logger = require('morgan');
        this.app = this.express();

        this.indexRouter = require('./routes/index');
        this.catalogRouter = require('./routes/catalog');
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

            this.app.set("views", ROOT_PATH + '/source/views');

            //middleware
            this.app.use(this.logger('dev'));
            this.app.use(this.express.json());
            this.app.use(this.express.urlencoded({ extended: false }));
            this.app.use(this.cookieParser());
            this.app.use(this.express.static('public'));

            // prefix routes
            this.app.use('/', this.indexRouter);
            this.app.use('/catalogue', this.catalogRouter);

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
            this.app.listen(PORT);
        }catch(err){
            console.error('error system ====> ', err);
        }
    }
}
