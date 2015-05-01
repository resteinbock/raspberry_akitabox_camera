var path = require('path');
var async = require('async');
var _ = require('underscore');
var request = require('request');

module.exports = _routes = {
    configure:function(app){
        //extract url params
        app.param('document', function (req, res, next, id) {
            req.document = id;
            return next();
        });

        _routes.app = app;
    },

    middleware: function(req, res, next){
        var str_access_token = null;
        if(req.signedCookies && req.signedCookies.access_token) {
            //found the access token in a signed cookie
            str_access_token = req.signedCookies.access_token;
        } else if (req.get('x-access-token')) {
            str_access_token = req.get('x-access-token');
        } else if (req.query.access_token) {
            str_access_token = req.query.access_token;
        }

        //TODO make this work...
        if (!str_access_token) {
            //there is a user logged in, so carry on
            return next();
        }

        if (req.method === 'GET') {
            //method was a get, so redirect to login
            return res.redirect(_routes.app.config.core.url + '?redirect_url=' + _routes.app.config.domain);

        } else {
            //just return a 401
            var error = new Error('Unauthorized');
            error.status = 401;
            return next(error);
        }
    },

    router: function(app) {
        app.get('/', function (req, res, next) {

            //get the most recent documents that are tagged with the rpi
            var uri = _routes.app.config.project.uri + '/docs';
            uri += '?tags_' + _routes.app.config.tag.name + '=' + _routes.app.config.tag.value;
            uri += '&page=1';
            uri += '&per_page=100';
            uri += '&group_by=date';
            uri += '&sort_by=last_mod_date%2Cdesc';
            console.log(uri);

            _routes.app.pv_client.get(uri, {}, function(err, _documents){
                if (err) return next(err);

                //group the documents
                var grouped_documents = [];
                var temp_groups = _.groupBy(_documents, 'group_alias');
                var group_aliases = _.keys(temp_groups);
                var first = true;

                //cycle through the groups
                _.each(group_aliases, function(group_alias){
                    //everything should already be in the correct order
                    var group_name = group_alias.replace(/[=[\]{}()`*#~+!@%&?<>.,^$|\/\\\s]/g, "_");
                    var tmp_docs = temp_groups[group_alias];
                    for (var i=0; i<tmp_docs.length; i++) {
                        tmp_docs[i].is_first = (i === 0);
                        tmp_docs[i].counter = i;
                    }

                    grouped_documents.push({
                        div_group_id: 'div-group-' + group_name,
                        group_alias: group_alias,
                        group_name: group_name,
                        documents: tmp_docs,
                        count: temp_groups[group_alias].length,
                        first: first
                    });

                    first = false;
                });

                var locals = {
                    core_url: _routes.app.config.core.url,
                    grouped_documents: grouped_documents,
                    project_name: _routes.app.config.project.name,
                    project_uri: _routes.app.config.project.uri,
                    camera_tag: _routes.app.config.tag.name + ': ' +  _routes.app.config.tag.value
                };

                return res.render('index', locals);
            });
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
