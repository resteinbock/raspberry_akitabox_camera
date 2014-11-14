var path = require('path');

module.exports = _routes = {
    configure:function(app){
        _routes.app = app;
    },

    middleware: function(){
        return function(req, res, next){
            if (req.method !== "POST"){
                //request was not a POST
                return next();
            }

            //request was a POST, so verify the secret in the body
            if (!req.body || !req.body.secret || req.body.secret !== app.config.camera.secret) {
                return _routes.app.standard_helpers.akitaError('Unauthorized', 401, next);
            }
        }
    },

    router: function(app) {
        app.get('/', function (req, res, next) {
            return res.send("Raspberry Pi Camera App Running....");
        });

        app.post('/stoptimelapse', function (req, res, next) {
            if (app.camera.time_lapse_interval_min === null) {
                return res.send('Time lapse has already been stopped');
            }

            app.camera.time_lapse_interval_min = null;
            return res.send('Time lapse will stop after the next pic...');
        });

        app.post('/restarttimelapse', function (req, res, next) {
            if (app.camera.time_lapse_interval_min !== null) {
                return res.send('Time lapse is already running');
            }

            res.send('Restarting time lapse...');
            app.camera.time_lapse_interval_min = app.config.camera.photo_interval_min;
            app.camera.timeLapse();
        });

        app.post('/updateinterval', function (req, res, next) {
            if (app.camera.time_lapse_interval_min === null) {
                return res.send('Time lapse is not on');
            }

            if (!req.body || !req.body.interval_min || typeof req.body.interval_min !== 'number') {
                return _routes.app.standard_helpers.akitaError('Bad request', 400, next);
            }

            app.camera.time_lapse_interval_min = req.body.interval_min;
            res.send('Interval will be updated to ' + app.camera.time_lapse_interval_min + ' min after the next pic is taken...');
        });

        app.post('/takepic', function (req, res, next) {
            res.send('Taking pic and uploaded to ' + app.config.project.uri + '...');

            app.camera.takePhoto(function (err) {
                if (err) {
                    //return next(err);
                }

                return;
            });
        });

        app.post('/showlastpic', function (req, res, next) {
            //use the doci to show the last pic referencing the last commit
            var commit = app.camera.last_commit;

            if (!commit){
                return res.send('Must take a photo before it can be viewed');
            }


            if (!commit.project || !commit.revisions || !commit.revisions[0] || !commit.revisions[0].document){
                return app.standard_helpers.akitaError('Invalid commit', 500, next);
            }

            //default to the first revision in the commit
            var url = app.config.doci_url + path.join('/raw', commit.project, '/docs', commit.revisions[0].document);
            console.log('redirecting to: ' + url);
            return res.redirect(url);
        });

        app.post('/updatecode', function (req, res, next) {
            res.send("Attempting to update the code and restart....");
            app.sys_checks.updateCode(function (err) { /*...*/
            });
        });

        app.post('/restartrpi', function (req, res, next) {
            res.send("Attempting to restart....");
            app.sys_checks.foreceRestart(function (err) { /*...*/
            });
        });
    }
};