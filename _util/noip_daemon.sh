#! /bin/sh
# /etc/init.d/noip

### BEGIN INIT INFO
# Provides:          noip
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Simple script to start a program at boot
# Description:       A simple script from www.stuffaboutcode.com which will start / stop a program a boot / shutdown.
### END INIT INFO

# Reference: http://www.stuffaboutcode.com/2012/06/raspberry-pi-run-program-at-start-up.html
# put file at: /etc/init.d/noip_daemon.sh
# using: sudo cp /home/pi/raspberry_akitabox_camera/_util/noip_daemon.sh /etc/init.d/noip_daemon.sh
# command to make it run on startup: sudo update-rc.d noip_daemon.sh defaults

# If you want a command to always run, put it here

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting noip"
    # run application you want to start
    /usr/local/bin/noip2
    ;;
  stop)
    echo "Stopping noip"
    # kill application you want to stop
    killall noip2
    ;;
  *)
    echo "Usage: /etc/init.d/noip {start|stop}"
    exit 1
    ;;
esac

exit 0