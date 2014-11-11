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
# SHELL=/bin/sh
# PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
# @reboot /usr/local/bin/forever start -al /home/pi/Documents/raspberry_akitabox_camera/logs/camera.log /home/pi/Documents/raspberry_akitabox_camera/app.js
#