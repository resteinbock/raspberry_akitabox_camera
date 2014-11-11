module.exports = function(app){
    /*var webhooks = require('./webhooks');
    app.all('/webhooks', webhooks.route);
    app.all('/webhooks/settings', webhooks.settings);
    app.all('/settings/project', require('./settings/project')(app));
    app.all('/settings/account', require('./settings/account')(app));*/

    app.get('/', function(req, res, next){
        res.send("Raspberry Pi Camera App Running....");
    });

    //TODO make this route more secure
    app.get('/updatecode', function(req, res, next){
        res.send("attempting to update the code and restart....");
        app.sys_checks.updateCode(function(err){ /*...*/ });
    });

    app.get('/restartrpi', function(req, res, next){
        res.send("attempting to restart....");
        app.sys_checks.foreceRestart(function(err){ /*...*/ });
    });
};