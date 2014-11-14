#!/bin/bash

#
# script to take a picture using usb camera
#

DATE=$(date +"%Y-%m-%d_%H%M_%S")

echo $DATE

fswebcam /home/pi/Documents/raspberry_akitabox_camera/tmp/photos/$DATE.jpg

# raspistill -o /home/pi/Documents/raspberry_akitabox_camera/tmp/photos/$DATE.jpg