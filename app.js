process.chdir(__dirname);
var path = require('path');
var express = require('express');
var camera = require('./lib');
var routes = require('./routes/index');
require('colors');

var app = express();
camera.configure(app);
app.set('port', app.config.port.http || 3000);
app.set('env', process.env.ENV || 'local');
//app.set('views', path.join(__dirname, 'public/templates'));
//app.set('view engine', 'hjs');

app.use(express.cookieParser(app.config.cookie.secret));
app.use(express.session());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.locals.api_protocol = app.config.api_protocol;
//app.locals.api_server = app.config.api_server;
//app.locals.partials = {
//    _header:'_header',
//    _footer:'_footer'
//};

routes(app);

//404
app.use(function(req, res, next){
    res.status(404);

    return res.json({ error: '404 Not found', uri: req.path })
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port') );
    console.log('Referencing config file: ' + app.config.name);
    console.log('Referencing local storage: ' + app.config.local_fs_path);

    var date = new Date();
    console.log('App started on date :: ' + date.toString());

    app.ping_akitabot.pingOnStartup(function(err){ /*...*/ });
});

camera.start(true);