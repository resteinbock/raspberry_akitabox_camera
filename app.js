process.chdir(__dirname);
var express = require('express');
var http = require('http');
var path = require('path');
require('colors');

var app = express();

app.camera = require('./lib');
app.camera.configure(app);

app.set('port', app.config.port || 3000);
app.set('env', process.env.ENV || 'local');
app.set('views', path.join(__dirname, 'public/templates'));
app.set('view engine', 'hjs');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

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
    //run ifconfig so that it will be posted to campfire
    var script = path.join(__dirname, '_util/ifconfig.sh');
    app.sys_checks.runScript(script, function(err){
        //dont do anything with the error
        app.standard_middleware.onServerCreate();
    });
});

app.camera.start(false);