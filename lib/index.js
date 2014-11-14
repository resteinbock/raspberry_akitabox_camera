var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var readline = require('readline');
var _ = require('underscore');
var async = require('async');
var ApiClient = require('planvault_api_client');
var archiver = require('archiver');

module.exports = _camera = {
    configure:function(app){
        console.log('initializing camera...');

        //choose the correct config file based on env variable RPI_CONFIG
        //RPI_CONFIG="/home/pi/Documents/raspberry_akitabox_camera/lib/config_files/config.js"
        if (!process.env.RPI_CONFIG) {
            throw new Error('invalid RPI_CONFIG');
        }
        try {
            app.config = require(process.env.RPI_CONFIG);
        } catch (err) {
            console.error(err);
            throw new Error('file at RPI_CONFIG not found');
        }

        app.sys_checks = require('./sys_checks');
        app.sys_checks.configure(app);

        app.routes = require('../routes.index');
        app.routes.configure(app);

        //set up planvault app tools
        var tools = require('planvault_app_tools');
        tools.configure(app);

        //setup the api client
        var api_config = {
            server: app.config.api_server,
            debug: app.config.debug,
            protocol: app.config.api_protocol,
            client_id: app.config.client_id,
            client_secret: app.config.client_secret,
            access_token: app.config.project.access_token
        };

        app.pv_client = ApiClient(api_config);
        _camera.app = app;
    },

    start:function(take_on_start){
        console.log('starting camera...');

        if (typeof take_on_start === 'undefined' || take_on_start === null){
            take_on_start = true;
        }

        async.series(
            [
                function(series_cb){
                    //make sure the photo directory exist
                    fs.exists(_camera.app.config.local_fs_path, function(exists){
                        if (!exists){
                            console.log('making new local_fs directory: ' + _camera.app.config.local_fs_path);
                            return fs.mkdir(_camera.app.config.local_fs_path, series_cb);
                        } else {
                            return series_cb();
                        }
                    });
                },
                function(series_cb){
                    //make sure the photo directory exist
                    fs.exists(_camera.app.config.camera.local_photos, function(exists){
                        if (!exists){
                            console.log('making new photo directory: ' + _camera.app.config.camera.local_photos);
                            return fs.mkdir(_camera.app.config.camera.local_photos, series_cb);
                        } else {
                            return series_cb();
                        }
                    });
                },
                function(series_cb){
                    //make sure the zip directory exist
                    fs.exists(_camera.app.config.camera.local_zips, function(exists){
                        if (!exists){
                            console.log('making new zip directory: ' + _camera.app.config.camera.local_zips);
                            return fs.mkdir(_camera.app.config.camera.local_zips, series_cb);
                        } else {
                            return series_cb();
                        }
                    });
                },
                function(series_cb){
                    if (!take_on_start) {
                        //skip taking a pic on start
                        return series_cb();
                    }

                    console.log('take a quick photo');
                    return _camera.takePhoto(series_cb);
                },
                function(series_cb){
                    //do stuff depending on the mode
                    switch(_camera.app.config.camera.mode){
                        case("motion"):

                            break;
                        case("on_demand_only"):
                            //this is set up after the switch
                            break;
                        default:
                            //time_lapse
                            _camera.timeLapse();
                            break;
                    }

                    //always set up the keyPress camera
                    //return _camera.keyPress(series_cb);

                    return series_cb();
                }
            ],
            _camera.errorHandler
        );

    },
    errorHandler:function(err){
        if (typeof err === 'undefined' || err === null){
            return;
        }

        console.error(err);
        console.trace(err);

        if (typeof err.code === 'undefined' || err.code === null){
            return;
        }

        //do special stuff for some errors
        err.code = err.code.toUpperCase();
        switch(err.code){
            case('ENOTFOUND'):
            case('ECONNRESET'):
                //internet is probably not connected
                return _camera.app.sys_checks.checkInternet(function(){
                    //if execution makes it here, then we have internet!
                    //so restart the camera
                    console.log('Guess we have the internets. Restarting the camera...');
                    return _camera.start(false);
                });
                break;
            case('ENOSPC'):
                //no space... try removing some stuff and then restart the camera without taking a pic on startup
                return _camera.app.sys_checks.clearSpace(function(){
                    return _camera.start(false);
                });
                break;
            default:
                //not sure what happened...
                return _camera.start(false);
                break;
        }

        //do not do anything here
    },
    keyPress:function(callback){

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Press ENTER at any time to take a photo...", function(answer) {
            /*if (answer !== '\n'){
                console.log('Neglecting. Answer: ' + answer);
                return _camera.keyPress(callback);
            }*/
            console.log("taking on demand photo");

            rl.close();

            _camera.takePhoto(function(err){
                if (err) {
                    console.error('Error taking on-demand picture');
                    return _camera.errorHandler(err);
                }

                //get ready to take another on-demand photo
                answer = '';
                return _camera.keyPress(callback);
            });
        });
    },
    time_lapse_interval_min: _camera.app.config.camera.photo_interval_min,
    last_commit: {},
    timeLapse:function(){
        console.log('waiting ' + _camera.time_lapse_interval_min + ' minutes...');

        if (_camera.time_lapse_interval_min === null){
            console.log('stopping time lapse');
            return;
        }
        var interval_ms = _camera.time_lapse_interval_min * 60 * 1000;

        setTimeout(
            function(){
                var take_pic = false;
                async.series(
                    [
                        function(series_cb){
                            _camera.checkTime(function(err, _take_pic){
                                if (err) return series_ch(err);

                                if(_take_pic) {
                                    take_pic = true;
                                }

                                return series_cb();
                            })
                        },
                        function(series_cb){
                            if (!take_pic) {
                                //do not take a pic
                                return series_cb();
                            }

                            return _camera.takePhoto(series_cb);
                        }
                    ],
                    function(err){
                        if (err) {
                            console.error('Error taking photo');
                            return _camera.errorHandler(err);
                        }
                        //continue the time lapse...
                        return  _camera.timeLapse();
                    }
                );
            },
            interval_ms
        );
    },
    checkTime:function(callback){
        var now = new Date();

        //check day of week
        var day = now.getDay();
        if (_camera.app.config.days[day] === false) {
            console.log('not taking today: ' + day);
            return callback(null, false);
        }

        //check the hour
        var hour = now.getHours();
        if (hour < _camera.app.config.hours.start) {
            console.log('too early: ' + hour);
            return callback(null, false);
        }
        if (hour > _camera.app.config.hours.stop) {
            console.log('too late: ' + hour);
            return callback(null, false);
        }

        //within time window to tak a pic!
        return callback(null, true);
    },
    takePhoto:function(callback){
        console.log('taking photo...');

        var script = '../_util/usb_photo_script.sh';
        if (_camera.app.rpi_camera) {
            script = '../_util/rpi_photo_script.sh';
        }

        var deploySh = spawn('bash', [ script ], { cwd: __dirname });

        deploySh.stdout.on('data', function (data) {
            //console.log('stdout: ' + data);
        });

        deploySh.stderr.on('data', function (data) {
            //console.log('stderr: ' + data);
        });

        deploySh.on('close', function (code) {
            console.log('child process exited with code ' + code);

            //return callback();

            _camera.sendPhotos(function(err){
                if (err) {
                    console.error('Error sending photos');
                    return callback(err);
                }
                return callback();
            });
        });

    },
    sendPhotos:function(callback){
        console.log('sending photos...');

        async.series([
            function(series_cb){
                //try to upload whatever is in the photos directory
                return _camera.sendZip(series_cb);
            },
            function(series_cb){
                //delete whatever is in the photos directory
                return _camera.deleteLocal(_camera.app.config.camera.local_photos, series_cb);
            },
            function(series_cb){
                //delete whatever is in the zips directory
                return _camera.deleteLocal(_camera.app.config.camera.local_zips, series_cb);
            }
        ],
            callback
        );
    },
    sendZip:function(callback){
        var photo_zip = archiver('zip');

        //cycle through the files in /photos and add them to akitabox
        fs.readdir(_camera.app.config.camera.local_photos, function(err, names){
            if (err) return callback(err);

            if (!names || !names.length || names.length === 0) {
                console.log('no photos to process');
                return callback();
            }

            async.eachSeries(
                names,
                function (name, each_cb) {
                    //add the file to the zip
                    console.log('appending - ' + name);

                    fs.readFile(path.join(_camera.app.config.camera.local_photos, name), function(err, _content){
                        if (err) return each_cb(err);
                        photo_zip.append(_content, {name: name});
                        return each_cb();
                    });

                },
                function(err){
                    if (err) return callback(err);

                    //send the zip
                    console.log('POST: - ' + _camera.app.config.project.uri + '/docs');

                    var tmp = _camera.app.config.camera.local_zips + '/' + Math.ceil(Math.random()*10000)+'.zip';
                    var output = fs.createWriteStream(tmp);

                    photo_zip.pipe(output);

                    photo_zip.on('error', function(err) {
                        return callback(err);
                    });

                    output.on('close', function(err, bytes) {
                        if(err) return callback(err);

                        console.log('About to write zip: ' + tmp);

                        var commit = {};

                        async.series([
                            function(series_cb){
                                _camera.app.pv_client.post(
                                    _camera.app.config.project.uri + '/docs/batch/zip',
                                    {
                                        name: 'Camera App Photos',
                                        file: fs.createReadStream(tmp)
                                    },
                                    function (err, res) {
                                        if (err) return series_cb(err);

                                        if (res && res.commit) commit = res.commit;
                                        return series_cb();
                                    }
                                );
                            },
                            function(series_cb){
                                _camera.last_commit = commit;
                                return _camera.tagSentPhotos(commit, series_cb);
                            }
                        ],
                            callback
                        );
                    });

                    photo_zip.finalize();
                }
            );
        });
    },
    tagSentPhotos:function(commit, callback){
        //cycle through the revisions in the commit and tag each document according to the config file
        if (! commit || !commit.revisions || commit.revisions.length < 1 ) {
            console.log('no documents to tag');
            return callback();
        }

        console.log('adding tags to uploaded documents...');

        async.eachSeries(
            commit.revisions,
            function(revision, each_cb){
                _camera.app.pv_client.post(
                        path.join(_camera.app.config.project.uri, '/docs', revision.document, '/tags'),
                    {
                        cat_alias: _camera.app.config.tag.name,
                        alias: _camera.app.config.tag.value
                    },
                    function (err, res) {
                        if (err) return each_cb(err);

                        return each_cb();
                    }
                );
            },
            callback
        );
    },
    deleteLocal:function(folder, callback){
        //delete everything in the local zip and photos directory
        console.log('deleting files in ' + folder + '...');

        //cycle through the files in the specidied folder and delete them
        fs.readdir(folder, function(err, names){
            if (err) return callback(err);

            if (!names || !names.length || names.length === 0) {
                console.log('no files to delete');
                return callback();
            }

            async.eachSeries(
                names,
                function (name, each_cb) {
                    //delete the file
                    var file_path = path.join(folder, name);

                    console.log('deleting - ' + file_path);

                    return fs.unlink(file_path, each_cb);

                },
                callback
            );
        });
    }

};
