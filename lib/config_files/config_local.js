var path = require('path');

module.exports = {
    app_name: "rpi_camera_local",
    config_name: "config_local.js",
    local_fs_path: path.join(__dirname, '/../../tmp/'),

    log_path: path.join(__dirname, '/../../logs/camera.log'),
    num_log_lines: 100,

    port: 8080,
    domain: "local.rpicamera.com",

    client_id: "rpi_robbie",
    client_secret: "rpi_secret",

    api_server: "api.local.akitabox.com:3000",
    api_protocol: "http",
    debug: false,

    camera: {
        secret: "h0114",

        rpi_camera: true,

        local_zips: path.join(__dirname, '/../../tmp/zips'),
        local_photos: path.join(__dirname, '/../../tmp/photos'),

        min_photo_interval: 2, //2 min

        //photo_interval_min: 0.5,
        photo_interval_min: 30,
        //photo_interval_min: 30,
        //photo_interval_min: 60,

        //mode: "motion"
        mode: "time_lapse"
        //mode: "live_feed"
        //mode: "on_demand_only"
    },

    days: [false, true, true, true, true, true, false],
    hours: {
        start: 7,
        stop: 17
    },

    project:{
        name: "a",
        project_url: "local.akitabox.com:3000/rsteinbock_turissystems/a",
        uri:"/rsteinbock_turissystems/a",
        access_token: "rsteinbock_turissystems"
    },

    tag: {
        name: "timelapse",
        value: "rpi1"
    },

    doci_url: "http://doci.local.akitabox.com:3002",

    akitabot_domain: "akitabot.local.akitabox.com:3005",
    akitabot_secret: "h0114"
};
