#!/bin/bash

# restart the wifi
# reference:
#   http://weworkweplay.com/play/rebooting-the-raspberry-pi-when-it-loses-wireless-connection-wifi/
#   http://jeromejaglale.com/doc/unix/shell_scripts/ping

ping -q -c5 google.com > /dev/null

if [ $? != 0 ]
then
  echo "No network connection, restarting wlan0..."
  /sbin/ifdown 'wlan0'
  sleep 15
  /sbin/ifup --force 'wlan0'
fi