KPD Scripts by ando#6372

USAGE:
These scripts ONLY work in idkr client.
Github link: https://github.com/Mixaz017/idkr

I've read the source code, there's nothing bad in it (Loggers, Sniffers, etc).
If you don't trust the precompiled version on Github, I've compiled one myself.
Download link: https://drive.google.com/drive/folders/1g8D-imc_67QtYlK8ootNWqCgz3pxgtxV?usp=sharing

I will update this executable once more updates come to the idkr client.
Put update mode on skip if you don't want auto updates.


ENABLE USERSCRIPTS IN SETTINGS

To use userscipts, copy the .js files to Documents/idkr/scripts.

IF YOU CHANGE SOMETHING IN THE SETTINGS OR THE SOURCE CODE, RELOAD THE WINDOW!

UNDERSTANDING THE SCRIPTS:

Alt Menu Logger:

	Features: Adds log button to the alt menu. Becomes green once clicked.
	Toggleable: yes, can be turned off.
	Styling: styled in the source code.


KPD QOL:

	Features: Adds search bar to call list and ban logs, highlights calls based on your preference, adds the calls region.
	Background: Prepares data for display when joining a call.
	Usage: Configure your preferences in the source code by opening it in a text editor (constants at the top).
	Toggleable: yes, can be turned off.
	Styling: styled in the source code.
	
Nametag Hider:

	Features: Adds a hotkey to toggle nametags, also displays on/off messages in chat.
	Usage: Configure your hotkey in the idkr settings tab by opening regular settings and placing a key in the input field (Ex: F2, k). Case sensitive, so upper letters only work when tablock is active or shift is pressed.
	Toggleable: yes, can be turned off by not setting a value.
	Styling: none

Spectate QOL:

	Features: Highlights caller and suspect in spectator mode. Optional, automatically jump to the suspect.
	Usage: nothing required
	Toggleable: yes, can be turned off.
	Styling: styled in the source code.
	Requires: kpdQOL.js, suspectFocus.js
	
Suspect Display:

	Features: Shows suspect and caller in KPD spec.
	Background: Detects if you tag or not, if yes it opens suspects profile (optional) or log the tag (optional), if no it opens KPD window.
	Usage: Open source code file and change the path to your logs file.
	Toggleable: yes, can be turned off

Suspect Focus:

	Features: Adds a hotkey to toggle focussing the suspect in KPD spec, also displays on/off messages in chat.
	Usage: Configure your hotkey in the idkr settings tab by opening regular settings and placing a key in the input field (Ex: F1, k). Case sensitive, so upper letters only  work when tablock is active or shift is pressed.
	Toggleable: yes, can be turned off by not setting a value.
	Styling: none
	Requires: kpdQOL.js, specQOL.js
	

linkOpener.js:

	Features: Adds input field to menu screen to quickly open profile links.
	Usage: Either copy a profile link to your clipboard or enter a players name in the field, then press the 'Open Link' button to open it.
	Toggleable: yes, can be turned off.
	Styling: must be added to your css, IDs are #linkOpener and #linkInput.
	(I use these)
	
	#linkOpener {
		background-color: transparent;
		text-shadow: none;
		box-shadow: none;
		top: 130px;
	}

	#linkInput {
		bottom: 190px;
		position: absolute;
	}
	

socialTagButton.js:

	Features: Adds a tag button on profiles. If clicked, it tags the user (if tagged it doesn't untag), also reports user with clipboard content and puts profile link and    clipboard content into a text file for logging purpose. Also has a button whcih opens reports section, opens every report and highlights every link.
	Usage: First, open source code file and change the path to your logs file. After that's done copy evidence into clipboard, press the button. Thats it.
	Toggleable: no
	Issues: If you don't open a players profile link but instead go on market, hub, etc. first, then click on a profile, the button doesn't appear. It might also disappear after a tag has been executed, but it doesn't really matter.
	WARNING: No promt to confirm or anything, pressing the button tags. Be careful.


Enjoy :) 
