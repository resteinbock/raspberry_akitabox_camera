raspberry_akitabox_camera
=========================

Raspberry Pi camera with uploads to an AkitaBox project


For standard usb webcams, be sure to run:
`sudo apt-get install fswebcam`

For motion detection, be sure to run:
`sudo apt-get install motion`

======================================================================
Some details about running scripts on server startup:

http://raspberrywebserver.com/serveradmin/run-a-script-on-start-up.html

======================================================================
Set up wifi and static ip from the terminal

http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/
http://www.modmypi.com/blog/tutorial-how-to-give-your-raspberry-pi-a-static-ip-address

for changes to wifi access:
/etc/network/interfaces
/etc/wpa_supplicant/wpa_supplicant.conf

======================================================================
Some details about no-ip:

http://raspberrypihelp.net/tutorials/29-raspberry-pi-no-ip-tutorial

======================================================================
Some details about backing up and restoring sd cards

https://ariandy1.wordpress.com/2013/04/07/raspberry-pi-backup-and-restore-from-linux/

======================================================================
Commands to run to set up a new RPi

sudo apt-get update
sudo apt-get upgrade
sudo apt-get install vim
sudo apt-get install git
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR EMAIL ADDRESS"
ssh-keygen -t rsa -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
copy the rsa key
ssh -T git@github.com
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP /usr/local/lib/node_modules/
sudo npm install -g bower
sudo npm install -g forever
git clone git@github.com:resteinbock/raspberry_akitabox_camera.git
static ip
no-ip
on startup
npm install

