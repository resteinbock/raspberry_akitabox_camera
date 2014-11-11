#! /bin/sh
# /etc/init.d/node-server

### BEGIN INIT INFO
# Provides:          node-server
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Simple script to start a program at boot
# Description:       Start / stop a node server wrapped by forever on boot / shutdown.
### END INIT INFO

# Reference: http://www.stuffaboutcode.com/2012/06/raspberry-pi-run-program-at-start-up.html
# put file at: /etc/init.d/server_daemon.sh
# using: cp /home/pi/Documents/raspberry_akitabox_camera/_util/server_daemon.sh /etc/init.d/server_daemon.sh
# command to make it run on startup: sudo update-rc.d server_daemon.sh defaults

# If you want a command to always run, put it here

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting forever server"
    # run application you want to start
    /home/pi/node/node-v0.10.28-linux-arm-pi/bin/forever start -al /home/pi/Documents/raspberry_akitabox_camera/logs/camera.log /home/pi/Documents/raspberry_akitabox_camera/app.js
    ;;
  stop)
    echo "Stopping forever server"
    # kill application you want to stop
    /home/pi/node/node-v0.10.28-linux-arm-pi/bin/forever stop 0
    ;;
  *)
    echo "Usage: /etc/init.d/node-server {start|stop}"
    exit 1
    ;;
esac

exit 0