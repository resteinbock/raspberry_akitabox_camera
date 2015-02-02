var path = require('path');
var async = require('async');
var _ = require('underscore');

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

            //get the most recent documents
            var uri = _routes.app.config.project.uri + '/docs?tags_' + _routes.app.config.tag.name + '=' + _routes.app.config.tag.value;
            _routes.app.pv_client.get(uri, {}, function(err, _documents){
                if (err) return next(err);

                //group the documents by the day they were last modified
                var grouped_docs = _.groupBy(_documents, function(document){
                    var date = new Date(document.last_mod_date);

                    //return a string of numbers in yyyymmdd format so that sorting works correctly
                    var day = date.getDate();
                    if (day<10) day = '0' + day;

                    var month = date.getMonth() + 1;
                    if (month<10) month = '0' + month;

                    return date.getFullYear().toString() + month.toString() + day.toString();
                });

                //get an array of the group_by object keys
                var keys = _.keys(grouped_docs);

                //use numeric sorting
                keys = _.sortBy(keys, function(num) { return parseInt(num,10); });

                //reverse the list
                keys = keys.reverse();

                //make a new object in the sorted keys order
                var sorted_grouped_docs = {};
                var limit = 100;
                if (keys.length < limit) {
                    limit = keys.length;
                }
                for (var j = 0; j < limit; j++){
                    //the key in this case is document.last_mod_date in yyyymmdd format so we need to make it a user friendly format
                    var date = parseInt(keys[j].slice(4,6),10) + '/' + parseInt(keys[j].slice(6,8),10) + '/' + keys[j].slice(0,4);
                    sorted_grouped_docs[date] = grouped_docs[keys[j]];
                }
                grouped_docs = sorted_grouped_docs;

                //cycle through each group and prepare the locals for each group
                var grouped_docs_obj = [];
                var first = true;
                for(var i in grouped_docs) {
                    var safe_name = i;
                    //replace all of the characters that prevent the groups from collapsing in the files list
                    safe_name = safe_name.replace(/[=[\]{}()`*#~+!@%&?<>.,^$|\/\\\s]/g, "_");

                    grouped_docs_obj.push({
                        name: i,
                        safe_name: safe_name,
                        count: grouped_docs[i].length,
                        documents: grouped_docs[i],
                        first: first
                    });
                    first = false;
                }
                grouped_docs = grouped_docs_obj;

                var locals = {
                    grouped_docs: grouped_docs,
                    group_names: _.keys(grouped_docs)
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
