var ApiClient = require('planvault_api_client');
var archiver = require('archiver');
var fs = require('fs');
var Stream = require('stream');
var _ = require('underscore');
var config = require('./config');
var async = require('async');
var path = require('path');

module.exports = camera = {
    init:function(){
        //setup the api client
        var api_config = {
            server: config.api_server,
            debug: config.debug,
            protocol: config.api_protocol,
            client_id: config.client_id,
            client_secret: config.client_secret,
            access_token: config.project.owner
        };

        this.pv_client = ApiClient(api_config);

    },
    sendPhotos:function(callback){
        var photo_zip = archiver('zip');

        //cycle through the files in /photos and add them to akitabox
        async.eachSeries(
            message.attachments,
            function (attachment, each_cb) {
                //add the file to the zip
                var attachment_key = attachment.generatedFileName;
                console.log('POST: - ' + config.project.uri + '/docs');
                photo_zip.append(attachment.content, {name: attachment_key});
                return each_cb();

            },
            function(err){
                if (err) {
                    return callback(err);
                }

                //send the zip
                var tmp = config.local_fs_path + Math.ceil(Math.random()*10000)+'.zip';
                var output = fs.createWriteStream(tmp);

                photo_zip.pipe(output);

                photo_zip.on('error', function(err) {
                    return callback(err);
                });

                output.on('close', function(err, bytes) {
                    console.log('About to write zip: ' + tmp);
                    if(err) {
                        return callback(err);
                    }
                    email.client.post(
                            config.project.uri + '/docs/batch/zip',
                        {
                            name: 'Camera App Photos',
                            file: fs.createReadStream(tmp)
                        },
                        function (err, res) {
                            if (err) {
                                return callback(err);
                            }
                            return callback();
                        }
                    );
                });

                photo_zip.finalize();
            }
        );
    },
    deletePhotos:function(){
        //delete everything in the photos directory

    },
    start:function(){
        console.log('starting...');

        //try to upload whatever is in the photos directory

        //delete whatever is in the photos directory

        //setup the camera

        //setup the posting to akitabox

    }

};