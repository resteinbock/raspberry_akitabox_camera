raspberry_akitabox_camera
=========================

Raspberry Pi camera with uploads to an AkitaBox project


for standard usb webcams, be sure to run:
`sudo apt-get install fswebcam`

======================================================================
to install node on raspberry pi:
```
sudo apt-get update
sudo apt-get upgrade
wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz
tar -zxvf node-v0.10.28-linux-arm-pi.tar.gz
node-v010.28-linux-arm-pi/bin/node —v
```

add the following two lines to the .bash_profile (make sure the path is where you installed node):
```
PATH=”/home/pi/node-v0.10.28-linux-arm-pi/bin:${PATH}”
export PATH
```

restart the raspberry pi and run:
```
/bin/bash
npm -v
```
======================================================================

