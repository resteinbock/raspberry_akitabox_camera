process.chdir(__dirname);
var express = require('express');
var camera = require('./lib');
var path = require('path');
var config = require('./lib/config');
var routes = require('./routes/index');
var colors = require('colors');

camera.init();

var app = express();
//app.set('views', path.join(__dirname, 'public/templates'));
//app.set('view engine', 'hjs');

app.use(express.cookieParser(config.cookie.secret));
app.use(express.session());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.locals.api_protocol = config.api_protocol;
//app.locals.api_server = config.api_server;
//app.locals.partials = {
//    _header:'_header',
//    _footer:'_footer'
//};

routes(app);

app.listen(config.port.http, function() {
    console.log('* Started Express server (http)'.green);
});

camera.start();