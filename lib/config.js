var path = require('path');

module.exports = {
    www_server: 'local.planvau.lt:3000', //To give out going email addresses a domain to point at
    api_server: 'api.local.planvau.lt:3000',
    api_protocol: 'http',
    debug: true,
    client_id: 'camera',
    client_secret: 'camera_secret',
    address_domain: 'planvau.lt',
    local_fs_path: path.join(__dirname, '/../.tmp/'),
    cookie:{
        secret: '0asdufj9we'
    },
    camera: {
        script: path.join(__dirname, "/photo_script.sh"),
        photo_interval_ms: 6000,
        zip_interval_ms: 60000
    },
    project: {
        owner: "rsteinbock_turissystems",
    },
    port: {
        http: 3010
    }
};