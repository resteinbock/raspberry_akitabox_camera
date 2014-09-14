var path = require('path');

module.exports = {
    www_server: 'local.planvau.lt:3000',
    api_server: 'api.local.planvau.lt:3000',
    api_protocol: 'http',
    client_id: 'camera',
    client_secret: 'camera_secret',
    address_domain: 'planvau.lt',
    local_fs_path: path.join(__dirname, '/../.tmp/'),
    cookie:{
        secret: '0asdufj9we'
    },
    camera: {
        local_zips: path.join(__dirname, '/../.tmp/zips'),
        local_photos: path.join(__dirname, '/../.tmp/photos'),
        photo_interval_ms: 30000,
        zip_interval_ms:  120000
    },
    project:{
        owner: "rsteinbock_turissystems",
        uri: "/rsteinbock_turissystems/camera_test_2"
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