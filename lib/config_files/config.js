var path = require('path');

module.exports = {
    app_name: "rpi_camera",
    name: "config.js",

    www_server: "akitabox.com",
    api_server: "api.akitabox.com",
    api_protocol: "https",
    client_id: "rpi_robbie",
    client_secret: "42ZWG91uL0aKPlLNdqW1oruQ0flT4a8A",
    local_fs_path: path.join(__dirname, '/../../tmp/'),
    cookie:{
        secret: '0asdufj9we'
    },
    camera: {
        local_zips: path.join(__dirname, '/../../tmp/zips'),
        local_photos: path.join(__dirname, '/../../tmp/photos'),
        //photo_interval_ms: 240000, //4min
        //photo_interval_ms: 3600000, //1 hour
        photo_interval_ms: 600000, //10 min
        //photo_interval_ms: 120000, //2 min

        //mode: "motion"
        mode: "time_lapse"
        //mode: "live_feed"
        //mode: "on_demand_only"
    },
    project:{
        //uri:"/shayden_turissystems/primex_thermometer",
        uri:"/rsteinbock_turissystems/rpi",
        access_token: "LWJlbiv7X5dLBppqplQWyGpUXIDJC7aRMQPz2oE9k1NrJUhjxSLyOOdAbmcQCIDERi3X7mtilSDYfIpA4zUBehF73vNDPnyfCCWavL87PFUVcOYK59GO5lzedZuWsYfu9dqZ1YhAiLwr1Cfy9ZV9yIYF2h48Z5F6y472yPfa5f8SSfOVR5ZK5cgbHb2RARkhm4ZN2nfUTnakWtQ2VopWVvNIK9fhdE81GQn323sSTncrUXMPNX9dfIZ16AkxbEIU"
    },
    tag: {
        name: "camera",
        value: "conference_room"
    },
    port: {
        http: 3010
        //https: 3042
    },
    akitabot_secret: "ho114"
};
