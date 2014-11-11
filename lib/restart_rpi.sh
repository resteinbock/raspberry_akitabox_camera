#!/bin/bash

# restart the raspberry pi
# reference:
#   http://weworkweplay.com/play/rebooting-the-raspberry-pi-when-it-loses-wireless-connection-wifi/
#   http://jeromejaglale.com/doc/unix/shell_scripts/ping

ping -q -c5 google.com > /dev/null

if [ $? != 0 ]
then
  echo "shutting down now..."
  sudo /sbin/shutdown -r now
fi
