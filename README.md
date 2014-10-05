raspberry_akitabox_camera
=========================

Raspberry Pi camera with uploads to an AkitaBox project


For standard usb webcams, be sure to run:
`sudo apt-get install fswebcam`

For motion detection, be sure to run:
`sudo apt-get install motion`

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
Some details about running scripts on server startup:
http://raspberrywebserver.com/serveradmin/run-a-script-on-start-up.html

======================================================================
Set up wifi from the terminal

```
sudo vim /etc/network/interfaces
```

Now add these lines at the end of the file (or change existing lines to match these):

```
allow-hotplug wlan0 
iface wlan0 inet dhcp 
wpa-ssid "YOUR NETWORK SSID"
wpa-psk "WIFI PASSWORD"
```

Then reboot `sudo reboot`

