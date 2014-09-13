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
    project:{
        owner: "rsteinbock_turissystems",
        uri: "/rsteinbock_turissystems/camera_test"
    },
    tag: {
        category: "Camera",
        value: "r_pi_1"
    },
    port: {
        http: 3002/*,
         https: 3042*/
    }
};