KPD Scripts by ando#6372

USAGE:
These scripts ONLY work in idkr client.
Github link: https://github.com/Mixaz017/idkr

I've read the source code, there's nothing bad in it (Loggers, Sniffers, etc).
Compiled verions are automatically made by Github (Actions tab), so the dev can't include harmful code.
If you still don't trust the version on Github, I've compiled one myself.
Download link: https://drive.google.com/drive/folders/1g8D-imc_67QtYlK8ootNWqCgz3pxgtxV?usp=sharing

I will update this executable once more updates come to the idkr client.
Put update mode on skip if you don't want auto updates.

How to use:
Install idkr client, then enable userscripts in the idkr settings tab. Close the client.
To install the userscipts, download the code as zip, then drag both .js files to Documents/idkr/scripts
Launch the Client.
Almost everything is customizable, open the idkr settings tab and modify settings in the KPD Tab.
A new user will be greeted like this.

![image](https://user-images.githubusercontent.com/79867635/111846589-6f4c9b80-8907-11eb-893a-debcec3a13d9.png)


Set your preferences and reload the window (F5 or F6).

other idkr keyboard shortcuts are found here: https://github.com/Mixaz017/idkr#keyboard-shortcuts

UNDERSTANDING THE SETTINGS:

Senior: Set if you are Senior or not (Defaults to off).
KPD Menu Features: Adds a Searchbar to call list and ban logs. Supports pasting clipboard on right click. Highlights players based on your settings. Copies names out of Ban Logs via right click. Shows call region in call list.
Spectate Features: Highlights both caller and suspect in the spectate ui. Follows the suspect in kpd mode if enabled.
Alt Menu Buttons: Adds two buttons to the alt menu, 'Log' saves the suspects link to your logfile, 'AOI' flags, bans and logs the player without confirmation (Be careful).
Show Additional Call Info: Shows suspect and caller names in a call. After confirming it opens players profile based on your preferences. If you deny, it opens the KPD menu.
Show Open Link Button: Adds a 'Link' input element and a 'Open Link' button. Enter a players profile name and click 'Open Link' to quickly access it. If you have a profile link in your clipboard, it opens that instead.

![image](https://user-images.githubusercontent.com/79867635/111846617-7ecbe480-8907-11eb-8ae4-aff6941f5e5b.png)


Hotkeys:

Suspect Focus: Toggle if the suspect is followed in KPD mode.

Hide Nametag: Toggles all nametags.

KPD Menu: Opens the KPD menu.

Preferences:

Minimum Level: Highlights players above this level in the call list.

Color: Set the color of the highlight.

Anti Color: Highlights players over level 15 if senior is set.
	
Additional Script	

socialTagButton.js:

	Features: Adds a tag button on profiles. If clicked, it tags the user (if tagged it doesn't untag), also reports user with clipboard content and puts profile link and    clipboard content into a text file for logging purpose. Also has a button whcih opens reports section, opens every report and highlights every link.
	Usage: First, open source code file and change the path to your logs file. After that's done copy evidence into clipboard, press the button. Thats it.
	Issues: If you don't open a players profile link but instead go on market, hub, etc. first, then click on a profile, the button doesn't appear. It might also disappear after a tag has been executed, but it doesn't really matter.
	WARNING: No promt to confirm or anything, pressing the button tags. Be careful.


Enjoy :)
