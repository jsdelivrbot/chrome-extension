# Global input chrome extension


This is for enabling chrome to support the Global Input software so that you can use your mobile to login instead of typing on the computer screen. Since your mobile will remember your password and auto-fill the form, you can speed up the login process. For example, when you go to confluence page, it will display a QR code,  so that you can connect with the Global Input mobile app (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) to your the confluence just by poing the phone camera to the QR code.

At the moment it supports confluence, JIRA and gitlab, github and Lucidchart, 123-reg.

### Installation

Download the files in this repository into a folder:

 ```git clone https://github.com/global-input/chrome-extension.git```


Then click on the "tools" (three dots on the right hand side of the chrome) to open the tools menu and and select ```More Tools```, then ```extensions```, then click on the ```Load unpacked extensions...``` button to open the file section menu (this will only be visible if you have  ```Developer mode``` ticked), select the folder that you have downloaded the chrome extension into, then click on the```select``` button.

### Test

You can visit any confluence page, for example [our confluence](https://iterativesolution.co.uk/confluence), you should see a QR code. When you scan it with Global Input App, you should see a login form on your mobile as well.
