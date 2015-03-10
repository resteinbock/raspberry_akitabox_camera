#!/bin/bash

#
# script to take a picture using rpi camera module
#

DATE=$(date +"%Y-%m-%d_%H%M_%S")

echo "rpi camera"
echo $DATE

# fswebcam /home/pi/raspberry_akitabox_camera/tmp/photos/$DATE.jpg

raspistill -o /home/pi/raspberry_akitabox_camera/tmp/photos/$DATE.jpg

