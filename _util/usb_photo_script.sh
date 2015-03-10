#!/bin/bash

#
# script to take a picture using usb camera
#

DATE=$(date +"%Y-%m-%d_%H%M_%S")

echo "usb camera"
echo $DATE

fswebcam /home/pi/raspberry_akitabox_camera/tmp/photos/$DATE.jpg

# raspistill -o /home/pi/raspberry_akitabox_camera/tmp/photos/$DATE.jpg