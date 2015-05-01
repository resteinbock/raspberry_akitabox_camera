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

    middleware: function(){
        return function(req, res, next){
            //check the secret if the method was a POST
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

                //add in the doci local for each document
                // /doci/raw/:account/:project/docs/:document/revisions/:commit/page/:page
                var dociHost = _routes.app.config.host ? _routes.app.config.host : _routes.app.config.domain;
                _.each(_documents, function(document){
                    document.doci_redirect = dociHost + document.last_binary_commit_uri + '/page/1';
                });

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
                    grouped_documents: grouped_documents,
                    project_name: 'AkitaBox Raspberry Pi Camera',
                    camera_tag: _routes.app.config.tag.name + ': ' +  _routes.app.config.tag.value
                };

                return res.render('index', locals);
            });
        });

        app.get('/doci/*', function(req, res, next){
            var dociUrl = req.path.replace('/doci', '');
            var url = config.doci_url + dociUrl;

            res.set('x-access-token', _routes.app.config.project.access_token);

            return res.redirect(url);

            //send with access token header
            /*var req_data = {
                method:  'GET',
                url:     url,
                headers: {'x-access-token': _routes.app.config.project.access_token}
            };

            request(req_data, function(err, res, body) {
                if(err) return next(err);

                return res.sendfile(body);
            });*/
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

            if (!commit){
                return res.send('Must take a photo before it can be viewed');
            }


            if (!commit.revisions || !commit.revisions[0] || !commit.revisions[0].document || !commit.cre_date_display){
                return app.standard_helpers.akitaError('Invalid commit', 500, next);
            }

            //default to the first revision in the commit
            var locals = {
                project: commit.project,
                date: commit.cre_date_display,
                url: app.config.doci_url + path.join('/raw', app.config.project.uri, '/docs', commit.revisions[0].document),
                display_url: app.config.domain + '/showpic/' + req.document
            };

            return res.render('last_pic', locals);
        });

        app.get('/showpic/:document', function(req, res, next) {

            var locals = {
                project:  app.config.project.uri,
                date: 'need to fetch this',
                url: app.config.doci_url + path.join('/raw', app.config.project.uri, '/docs', req.document),
                display_url: app.config.domain + '/showpic/' + req.document
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
