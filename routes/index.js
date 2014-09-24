module.exports = function(app){
    /*var webhooks = require('./webhooks');
    app.all('/webhooks', webhooks.route);
    app.all('/webhooks/settings', webhooks.settings);
    app.all('/settings/project', require('./settings/project')(app));
    app.all('/settings/account', require('./settings/account')(app));*/

    app.all('/', function(req, res, next){
        res.send("Raspberry Pi Camera App Running....");
    });
};