var ApiClient = require('planvault_api_client');
var archiver = require('archiver');
var fs = require('fs');
var _ = require('underscore');
var config = require('./config');
var async = require('async');
var path = require('path');
var spawn = require('child_process').spawn;
var readline = require('readline');

module.exports = camera = {
    init:function(){
        console.log('initializing camera...');

        //setup the api client
        var api_config = {
            server: config.api_server,
            debug: config.debug,
            protocol: config.api_protocol,
            client_id: config.client_id,
            client_secret: config.client_secret,
            access_token: config.project.access_token
        };

        this.pv_client = ApiClient(api_config);

    },
    start:function(){
        console.log('starting camera...');

        async.series([
            function(series_cb){
                //make sure the photo directory exist
                fs.exists(config.local_fs_path, function(exists){
                    if (!exists){
                        console.log('making new local_fs directory: ' + config.local_fs_path);
                        return fs.mkdir(config.local_fs_path, series_cb);
                    } else {
                        return series_cb();
                    }
                });
            },
            function(series_cb){
                //make sure the photo directory exist
                fs.exists(config.camera.local_photos, function(exists){
                    if (!exists){
                        console.log('making new photo directory: ' + config.camera.local_photos);
                        return fs.mkdir(config.camera.local_photos, series_cb);
                    } else {
                        return series_cb();
                    }
                });
            },
            function(series_cb){
                //make sure the zip directory exist
                fs.exists(config.camera.local_zips, function(exists){
                    if (!exists){
                        console.log('making new zip directory: ' + config.camera.local_zips);
                        return fs.mkdir(config.camera.local_zips, series_cb);
                    } else {
                        return series_cb();
                    }
                });
            },
            function(series_cb){
                console.log('take a quick photo');
                camera.takePhoto(function(err){
                    if (err) {
                        console.error('Error starting camera');
                        console.error(err);
                        return series_cb(err);
                    }

                    switch(config.camera.mode){
                        case("motion"):

                            break;
                        case("on_demand_only"):
                            //this is set up after the switch
                            break;
                        default:
                            //time_lapse
                            camera.timeLapse();
                            break;
                    }

                    console.log('Successfully started camera!!!');

                    return series_cb();
                });
            },
            function(series_cb){
                //always set up the keyPress camera
                return camera.keyPress(series_cb);
            }
        ]);

    },
    keyPress:function(callback){

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Press ENTER at any time to take a photo...", function(answer) {
            if (answer !== '\n'){
                console.log('neglecting... ' + answer);
                return camera.keyPress(callback);
            }
            console.log("taking on demand photo");

            rl.close();

            camera.takePhoto(function(err){
                if (err) {
                    console.error('Error taking picture of ' + answer);
                    console.error(err);
                    return;
                }

                //get ready to take another on-demand photo
                return camera.keyPress(callback);
            });
        });
    },
    timeLapse:function(){
        console.log('waiting...');

        setInterval(
            function(){
                camera.takePhoto(function(err){
                    if (err) {
                        console.error('Error taking photo');
                        console.error(err);
                        return;
                    }
                });
            },
            config.camera.photo_interval_ms
        );
    },
    takePhoto:function(callback){
        console.log('taking photo...');
        var deploySh = spawn('bash', [ 'photo_script.sh' ], { cwd: __dirname });

        deploySh.stdout.on('data', function (data) {
            //console.log('stdout: ' + data);
        });

        deploySh.stderr.on('data', function (data) {
            //console.log('stderr: ' + data);
        });

        deploySh.on('close', function (code) {
            console.log('child process exited with code ' + code);

            //return callback();

            camera.sendPhotos(function(err){
                if (err) {
                    console.error('Error starting camera');
                    console.error(err);
                    return callback();
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
                return camera.sendZip(series_cb);
            },
            function(series_cb){
                //delete whatever is in the photos directory
                return camera.deleteLocal(config.camera.local_photos, series_cb);
            },
            function(series_cb){
                //delete whatever is in the zips directory
                return camera.deleteLocal(config.camera.local_zips, series_cb);
            }
        ],
            callback
        );
    },
    sendZip:function(callback){
        var photo_zip = archiver('zip');

        //cycle through the files in /photos and add them to akitabox
        fs.readdir(config.camera.local_photos, function(err, names){
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

                    fs.readFile(path.join(config.camera.local_photos, name), function(err, _content){
                        if (err) return each_cb(err);
                        photo_zip.append(_content, {name: name});
                        return each_cb();
                    });

                },
                function(err){
                    if (err) return callback(err);

                    //send the zip
                    console.log('POST: - ' + config.project.uri + '/docs');

                    var tmp = config.camera.local_zips + '/' + Math.ceil(Math.random()*10000)+'.zip';
                    var output = fs.createWriteStream(tmp);

                    photo_zip.pipe(output);

                    photo_zip.on('error', function(err) {
                        return callback(err);
                    });

                    output.on('close', function(err, bytes) {
                        if(err) return callback(err);

                        console.log('About to write zip: ' + tmp);

                        var commit = null;

                        async.series([
                            function(series_cb){
                                camera.pv_client.post(
                                    config.project.uri + '/docs/batch/zip',
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
                                return camera.tagSentPhotos(commit, series_cb);
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
                camera.pv_client.post(
                        path.join(config.project.uri, '/docs', revision.document, '/tags'),
                    {
                        name: config.tag.name,
                        value: config.tag.value
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
