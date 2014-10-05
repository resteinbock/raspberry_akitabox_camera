var path = require('path');

module.exports = {
    www_server: "beta.akitabox.com",
    api_server: "api.beta.akitabox.com",
    api_protocol: "https",
    client_id: "rpi_robbie",
    client_secret: 'mcj2YYdVWxTBp1XnyC64K9amAACrG2nh',
    local_fs_path: path.join(__dirname, '/../tmp/'),
    cookie:{
        secret: '0asdufj9we'
    },
    camera: {
        local_zips: path.join(__dirname, '/../tmp/zips'),
        local_photos: path.join(__dirname, '/../tmp/photos'),
        //photo_interval_ms: 3600000, //1 hour
        //photo_interval_ms: 600000, //10 min
        photo_interval_ms: 120000, //2 min
        //mode: "motion"
        mode: "time_lapse"
        //mode: "live_feed"
        //mode: "on_demand_only"
    },
    project:{
        owner: "rsteinbock_turissystems",
        //uri: "/rsteinbock_turissystems/conference_camera",
        uri: "/rsteinbock_turissystems/home_camera",
        access_token: "YrDNiKixvTBUtO5W5YZO8UQ8j19pHgHj5LO2OGEd4m9kUfkWE6MuAryaH2RSIhuKq1qrrPOQOZD5bNRkvjU58lY47odERqpgdHYG1dwvO4gvpbsVveTSNmVta4WlZxivLZZVNPkvbBw88l184kYWauWx0Xj1BGfnke2pdvHdSUN17kItnhQH80IE490N6osFqSdnWfkYpDWzHNyAaCuPhdmv4WCHw7SQE0tFNPD8FE2gg6sjKZ4FG2us4nPAHzD3"
    },
    tag: {
        name: "camera",
        value: "r_pi_1"
    },
    port: {
        http: 3010
        //https: 3042
    }
};
