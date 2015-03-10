#!/bin/bash

# Variables
BRANCH="master"

echo "\n\nPulling Latest $BRANCH Branches and NPM Installing..."
echo "PULLING CAMERA APP..."
cd /home/pi/raspberry_akitabox_camera
ssh-add /home/ubuntu/.ssh/id-rsa
# git stash
sudo -u pi git checkout $BRANCH
sudo -u pi git pull origin $BRANCH --force
echo "PULL COMPLETE, NPM INSTALL..."
sudo -u pi /usr/local/bin/npm install

echo "******** SETUP COMPLETE *********"
echo "shutting down now..."

sudo /sbin/shutdown -r now

