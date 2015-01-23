var spawn = require('child_process').spawn;
var async = require('async');

module.exports = _sys_checks = {
    configure:function(app){
        _sys_checks.app = app;
    },
    updateCode:function(callback){
        async.series(
            [
                function(series_cb){
                    //make sure we have internets first
                    return _sys_checks.checkInternet(series_cb);
                },
                function(series_cb){
                    //then update the code and restart
                    return _sys_checks.gitPullNpmInstall(series_cb);
                }
            ],
            callback
        );
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
        );
    },
    restartInternet:function(callback){
        console.log('checking internet, restarting internet...');
        var script = '../_util/restart_internet.sh';

        return _sys_checks.runScript(script, callback);
    },
    restartRpi:function(callback){
        console.log('checking internet, restarting rpi...');
        var script = '../_util/restart_rpi.sh';

        return _sys_checks.runScript(script, callback);
    },
    clearSpace:function(callback){
        console.log('try to clear some space...');
        var script = '../_util/clear_photos_zips.sh';

        return _sys_checks.runScript(script, callback);
    },
    gitPullNpmInstall:function(callback){
        console.log('git pull, npm install, restart rpi...');
        var script = '../_util/git_npm.sh';

        return _sys_checks.runScript(script, callback);
    },
    foreceRestart:function(callback){
        console.log('forcing rpi restart...');
        var script = '../_util/force_restart.sh';

        return _sys_checks.runScript(script, callback);
    },
    runScript:function(script, callback){
        var deploySh = spawn('bash', [ script ], { cwd: __dirname });

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
    }
};