var path = require('path');

module.exports = {
    www_server: 'beta.akitabox.com',
    api_server: 'api.beta.akitabox.com',
    api_protocol: 'https',
    client_id: 'camera',
    client_secret: 'camera_secret',
    local_fs_path: path.join(__dirname, '/../.tmp/'),
    cookie:{
        secret: '0asdufj9we'
    },
    camera: {
        local_zips: path.join(__dirname, '/../.tmp/zips'),
        local_photos: path.join(__dirname, '/../.tmp/photos'),
        photo_interval_ms: 3600000, //must be at least a minute
        zip_interval_ms:  3610000 //5 min
    },
    project:{
        owner: "rsteinbock_turissystems",
        uri: "/rsteinbock_turissystems/conference_camera"
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
