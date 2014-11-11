var spawn = require('child_process').spawn;
var async = require('async');

module.exports = _sys_checks = {
    configure:function(app){
        _sys_checks.app = app;
    },
    checkInternet:function(callback){
        async.series(
            [
                function(series_cb){
                    //first try restarting the internet connection
                    return _sys_checks.restartInternet(series_cb);
                },
                function(series_cb){
                    //if all else fails, restart the rpi
                    return _sys_checks.restartRpi(series_cb);
                }
            ],
            callback
        )
    },
    restartInternet:function(callback){
        console.log('checking internet, restarting internet...');
        var deploySh = spawn('bash', [ 'restart_internet.sh' ], { cwd: __dirname });

        deploySh.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        deploySh.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        deploySh.on('close', function (code) {
            console.log('child process exited with code ' + code);

            return callback();
        });
    },
    restartRpi:function(callback){
        console.log('checking internet, restarting rpi...');
        var deploySh = spawn('bash', [ 'restart_rpi.sh' ], { cwd: __dirname });

        deploySh.stdout.on('data', function (data) {
            //console.log('stdout: ' + data);
        });

        deploySh.stderr.on('data', function (data) {
            //console.log('stderr: ' + data);
        });

        deploySh.on('close', function (code) {
            console.log('child process exited with code ' + code);

            return callback();
        });
    },
    clearSpace:function(callback){
        console.log('try to clear some space...');
        //TODO delete some stuff....

        return callback();
    }
};