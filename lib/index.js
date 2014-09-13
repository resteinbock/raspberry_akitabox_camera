var ApiClient = require('planvault_api_client');
var archiver = require('archiver');
var fs = require('fs');
var Stream = require('stream');
var _ = require('underscore');
var config = require('./config');
var async = require('async');
var hogan = require("hogan.js");
var path = require('path');

module.exports = camera = {
    init:function(){
        //setup the api client
        var api_config = {
            server: config.api_server,
            debug: config.debug,
            protocol: config.api_protocol,
            client_id: config.client_id,
            client_secret: config.client_secret
        };

        this.pv_client = ApiClient(api_config);

    },
    start:function(){
        console.log('starting...');

        //setup the camera

        //setup the posting to akitabox

    }

};