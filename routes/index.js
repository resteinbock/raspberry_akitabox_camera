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
            if (!req.body || !req.body.secret || req.body.secret !== _routes.app.config.camera.secret) {
                return _routes.app.standard_helpers.akitaError('Unauthorized', 401, next);
            }

            return next();
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

            if (!req.body || typeof req.body.interval_min !== 'string') {
                return app.standard_helpers.akitaError('Bad request', 400, next);
            }

            var new_interval_min = parseInt(req.body.interval_min, 10);

            //make sure the new time is greater than the min
            if(new_interval_min < parseInt(app.config.camera.min_photo_interval, 10)) {
                return app.standard_helpers.akitaError('interval_min too short ' + new_interval_min, 500, next);
            }

            app.camera.time_lapse_interval_min = new_interval_min;
            res.send('Interval will be updated to ' + new_interval_min + ' min after the next pic is taken...');
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

        app.get('/showlastpic', function (req, res, next) {
            //use the doci to show the last pic referencing the last commit
            var commit = app.camera.last_commit;

            //for local testing
            /*commit = {
                project: _routes.app.config.project.uri,
                revisions: [
                    {
                        document: '5464fa4768746dea2a16942f'
                    }
                ],
                cre_date_display: '11/13/2014 12:36 PM'
            };*/

            if (!commit){
                return res.send('Must take a photo before it can be viewed');
            }


            if (!commit.project || !commit.revisions || !commit.revisions[0] || !commit.revisions[0].document || !commit.cre_date_display){
                return app.standard_helpers.akitaError('Invalid commit', 500, next);
            }

            //default to the first revision in the commit
            var locals = {
                project: commit.project,
                date: commit.cre_date_display,
                url: app.config.doci_url + path.join('/raw', commit.project, '/docs', commit.revisions[0].document)
            };

            res.render('index', locals);
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