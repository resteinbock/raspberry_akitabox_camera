process.chdir(__dirname);
var express = require('express');
var http = require('http');
var path = require('path');
var colors = require('colors');

var app = express();

app.camera = require('./lib');
app.camera.configure(app);

app.set('port', app.config.port || 3000);
app.set('env', process.env.ENV || 'local');
app.set('views', path.join(__dirname, 'public/templates'));
app.set('view engine', 'hjs');

//Heartbeat middleware
app.use( app.standard_middleware.heartbeat() );

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));

app.use(function(req, res, next) {
    //enable CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token, x-response-type, x-forwarded-proto, Origin, Accept, Accept-Language, Content-Language, Content-Type, Authorization, Content-Length');

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.send(200);
    }

    return next();
});

app.use( app.routes.middleware() );
app.routes.router(app);

//404 middleware (after all routes, but before the error handler)
app.use( app.standard_middleware.json404() );

//error handling middleware
app.use( app.standard_middleware.prodErrorHandler() );

//Start the server
http.createServer(app).listen(app.get('port'), function() {
    //run ifconfig so that the ip address will be posted to campfire
    var script = path.join(__dirname, '_util/ifconfig.sh');
    app.sys_checks.runScript(script, function(err){
        //don't do anything with the error
        app.standard_middleware.onServerCreate();
    });
});

app.camera.start(true);