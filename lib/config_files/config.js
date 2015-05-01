var path = require('path');

module.exports = {
    app_name: "akitacamera_rpi_camera",
    config_name: "config_akita_camera.js",
    local_fs_path: path.join(__dirname, '/../../tmp/'),

    log_path: path.join(__dirname, '/../../logs/camera.log'),
    num_log_lines: 100,

    port: 8080,
    domain: "http://rpicam.ddns.net",

    client_id: "rpi_robbie",
    client_secret: "42ZWG91uL0aKPlLNdqW1oruQ0flT4a8A",

    api_server: "api.akitabox.com",
    api_protocol: "https",
    debug: false,

    camera: {
        secret: "h0114",

        rpi_camera: true,

        local_zips: path.join(__dirname, '/../../tmp/zips'),
        local_photos: path.join(__dirname, '/../../tmp/photos'),

        min_photo_interval: 2, //2 min

        //photo_interval_min: 0.5,
        photo_interval_min: 15,
        //photo_interval_min: 30,
        //photo_interval_min: 60,

        //mode: "motion"
        mode: "time_lapse"
        //mode: "live_feed"
        //mode: "on_demand_only"
    },

    days: [true, true, true, true, true, true, true],
    hours: {
        start: 6,
        stop: 18
    },

    project:{
        uri:"/rsteinbock_turissystems/rpi",
        access_token: "LWJlbiv7X5dLBppqplQWyGpUXIDJC7aRMQPz2oE9k1NrJUhjxSLyOOdAbmcQCIDERi3X7mtilSDYfIpA4zUBehF73vNDPnyfCCWavL87PFUVcOYK59GO5lzedZuWsYfu9dqZ1YhAiLwr1Cfy9ZV9yIYF2h48Z5F6y472yPfa5f8SSfOVR5ZK5cgbHb2RARkhm4ZN2nfUTnakWtQ2VopWVvNIK9fhdE81GQn323sSTncrUXMPNX9dfIZ16AkxbEIU"
    },

    tag: {
        name: "timelapse",
        value: "bahamas"
    },

    doci_url: "https://doci.akitabox.com",

    akitabot_domain: "akitabot.akitabox.com",
    akitabot_secret: "h0114"
};
