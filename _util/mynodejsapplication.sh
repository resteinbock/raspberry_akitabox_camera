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
# put file at: /etc/init.d/mynodejsapplication.sh
# using: sudo cp /home/pi/Documents/raspberry_akitabox_camera/_util/mynodejsapplication.sh /etc/init.d/mynodejsapplication.sh
# command to make it run on startup: sudo update-rc.d mynodejsapplication.sh defaults

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
PID_FILE=$NAME.pid
PID_DIR=/var/run
LOGFILE=/home/pi/Documents/raspberry_akitabox_camera/logs/$NAME.log

# If you want a command to always run, put it here
PATH=$NODE_BIN_DIR:$PATH
PID_PATH=$PID_DIR/$PID_FILE
export NODE_PATH=$NODE_PATH
export RPI_CONFIG=/home/pi/Documents/raspberry_akitabox_camera/lib/config_files/config.js
export env=production

start() {
    echo "Starting $NAME"
    /home/pi/node/node-v0.10.28-linux-arm-pi/bin/forever -p $PID_DIR --pidFile $PID_FILE --sourceDir $APPLICATION_DIRECTORY \
        -a -l $LOGFILE --minUptime 5000 --spinSleepTime 2000 \
        start $APPLICATION_START &
    RETVAL=$?
}

stop() {
    if [ -f $PID_PATH ]; then
        echo "Shutting down $NAME $PID_FILE"
        forever stop $APPLICATION_START
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
    /home/pi/node/node-v0.10.28-linux-arm-pi/bin/forever list
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
        echo "Usage: /etc/init.d/mynodejsapplication.sh {start|stop|status|restart}"
        exit 1
        ;;
esac
exit $RETVAL