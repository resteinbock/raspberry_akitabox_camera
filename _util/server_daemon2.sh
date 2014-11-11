#!/bin/bash

# MyApplication
# Maintainer: resteinbock
# Authors: resteinbock@gmail.com
# chkconfig: - 80 05

### BEGIN INIT INFO
# Provides:          mynodejsapplication
# Required-Start:    $syslog $remote_fs
# Required-Stop:     $syslog $remote_fs
# Should-Start:      $local_fs
# Should-Stop:       $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Script for My Node Application
# Description:       Script for My Node Application
### END INIT INFO

# Reference: http://www.linuxfunda.com/2013/12/15/how-to-install-and-configure-forever-as-a-service-to-run-node-js-application-ubuntu-12-04/
# put file at: /etc/init.d/server_daemon2.sh
# using: cp /home/pi/Documents/raspberry_akitabox_camera/_util/server_daemon2.sh /etc/init.d/server_daemon2.sh
# command to make it run on startup: sudo update-rc.d server_daemon2.sh defaults

# An application name to display in echo text.
# An application name to display in echo text.
# NAME="My Application"
# The full path to the directory containing the node and forever binaries.
# NODE_BIN_DIR=/home/node/local/node/bin
# Set the NODE_PATH to the Node.js main node_modules directory.
# NODE_PATH=/home/node/local/node/lib/node_modules
# The directory containing the application start Javascript file.
# APPLICATION_DIRECTORY=/home/node/my-application
# The application start Javascript filename.
# APPLICATION_START=start-my-application.js
# Process ID file path.
# PIDFILE=/var/run/my-application.pid
# Log file path.
# LOGFILE=/var/log/my-application.log

NAME="camera"
NODE_BIN_DIR=/home/pi/node/node-v0.10.28-linux-arm-pi/bin
NODE_PATH=/home/pi/node/node-v0.10.28-linux-arm-pi/lib/node_modules
APPLICATION_DIRECTORY=/home/pi/Documents/raspberry_akitabox_camera
APPLICATION_START=app.js
PIDFILE=/var/run/$NAME.pid
LOGFILE=/home/pi/Documents/raspberry_akitabox_camera/logs/$NAME.log

PATH=$NODE_BIN_DIR:$PATH
export NODE_PATH=$NODE_PATH

start() {
        echo "Starting $NAME"
        /usr/local/bin/forever --pidFile $PIDFILE --sourceDir $APPLICATION_DIRECTORY \
                -a -l $LOGFILE --minUptime 5000 --spinSleepTime 2000 \
                start $APPLICATION_START &
        RETVAL=$?
}

stop() {
        if [ -f $PIDFILE ]; then
                echo "Shutting down $NAME"
                rm -f $PIDFILE
                RETVAL=$?
        else
                echo "$NAME is not running."
                RETVAL=0
        fi
}

restart() {
        echo "Restarting $NAME"
        stop
        start
}

status() {
        echo "Status for $NAME:"
        /usr/local/bin/forever list
        RETVAL=$?
}

case "$1" in
        start)
                start
                ;;
        stop)
                stop
                ;;
        status)
                status
                ;;
        restart)
                restart
                ;;
        *)
                echo "Usage: {start|stop|status|restart}"
                exit 1
                ;;
esac
exit $RETVAL