process.chdir(__dirname);
var express = require('express');
require('colors');

var app = express();

app.camera = require('./lib');
app.camera.configure(app);

app.set('port', app.config.port || 3000);
app.set('env', process.env.env || 'local');

//app.set('views', path.join(__dirname, 'public/templates'));
//app.set('view engine', 'hjs');

//app.use(express.cookieParser(app.config.cookie.secret));
//app.use(express.session());
app.use(express.logger('dev'));
app.use(express.bodyParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.locals.api_protocol = app.config.api_protocol;
//app.locals.api_server = app.config.api_server;
//app.locals.partials = {
//    _header:'_header',
//    _footer:'_footer'
//};

//Heartbeat middleware
app.use( app.standard_middleware.heartbeat() );

app.use( app.routes.middleware() );
app.routes.router(app);

//404 middleware (after all routes, but before the error handler)
app.use( app.standard_middleware.json404() );

//error handling middleware
app.use( app.standard_middleware.prodErrorHandler() );

//Start the server
http.createServer(app).listen(app.get('port'), function() {
    app.standard_middleware.onServerCreate();
});

app.camera.start(true);