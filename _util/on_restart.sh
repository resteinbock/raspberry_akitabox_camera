#!/bin/bash
#
# not needed
# set env="production"
# added a task to crontab -e
#
# to update network
# sudo vim /etc/network/interfaces
#
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
#
# sudo crontab -e
# SHELL=/bin/sh
# PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
# @reboot /usr/local/bin/forever start -al /home/pi/Documents/raspberry_akitabox_camera/logs/camera.log /home/pi/Documents/raspberry_akitabox_camera/app.js
#
# sudo vim /etc/rc.local
# echo "Running forever script..."
# su pi -c '/home/pi/node/node-v0.10.28-linux-arm-pi/bin/forever start -c /home/pi/node/node-v0.10.28-linux-arm-pi/bin/node -al /home/pi/Documents/raspberry_akitabox_camera/logs/camera.log /home/pi/Documents/raspberry_akitabox_camera/app.js < /dev/null &'
#
#
# initd-forever -c /home/pi/node/node-v0.10.28-linux-arm-pi/bin/node -l /home/pi/Documents/raspberry_akitabox_camera/logs/camera.log -f /home/pi/node/node-v0.10.28-linux-arm-pi/bin