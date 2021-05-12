KPD Scripts by ando#6372

USAGE:
These scripts ONLY work in idkr client.
Github link: https://github.com/Mixaz017/idkr


How to use:
Install idkr client, you will probably update after starting. Just set Auto Update Behaviour to skip in the idkr settings tab. Then enable userscripts. Close the client and reinstall the executable again. No need to uninstall first.


Launch the Client.
Almost everything is customizable, open the idkr settings tab and modify settings in the KPD Tab.

YOUR LOG FILES ARE LOCATED IN Documents/KPD/banlog.txt.

A new user will be greeted like this.

![image](https://user-images.githubusercontent.com/79867635/111874043-9ea8ea00-8993-11eb-82e8-34c37dbd753e.png)


Set your preferences and reload the window (F5 or F6).

Other idkr keyboard shortcuts are found here: https://github.com/Mixaz017/idkr#keyboard-shortcuts

UNDERSTANDING THE SETTINGS:

Senior: Set if you are Senior or not (Defaults to off).

KPD Menu Features: Adds a Searchbar to call list and ban logs. Supports pasting clipboard on right click. Highlights players based on your settings. Copies names out of Ban Logs via right click. Shows call region in call list.

![image](https://user-images.githubusercontent.com/79867635/111874129-02cbae00-8994-11eb-99c3-e53545376fec.png)



Spectate Features: Highlights both caller and suspect in the spectate ui. Follows the suspect in kpd mode if enabled.

![image](https://user-images.githubusercontent.com/79867635/111884523-708ece80-89c2-11eb-88d7-d0408a1df4a5.png)


Show Additional Call Info: Shows suspect and caller names in a call. After confirming it opens players profile based on your preferences. If you deny, it opens the KPD menu.

![image](https://user-images.githubusercontent.com/79867635/111884530-7be1fa00-89c2-11eb-80c8-5b065b17445f.png)

Show Open Link Button: Adds a 'Link' input element and a 'Open Link' button. Enter a players profile name and click 'Open Link' to quickly access it. If you have a profile link in your clipboard, it opens that instead.

![image](https://user-images.githubusercontent.com/79867635/111884545-99af5f00-89c2-11eb-837a-cb4550779ef0.png)

Detailed Logs: It is designed to save the time (UTC) when the tag was executed, if you want to keep the video file on pc and not upload it.


Hotkeys:

Suspect Focus: Toggle if the suspect is followed in KPD mode.

Hide Nametag: Toggles all nametags.

![image](https://user-images.githubusercontent.com/79867635/111884575-ce231b00-89c2-11eb-81e3-fac23c96ab86.png)

KPD Menu: Opens the KPD menu.

Preferences:

Minimum Level: Highlights players above this level in the call list.

Color: Set the color of the highlight.

Anti Color: Highlights players over level 15 if senior is set.
	
Additional Script	

socialTagButton.js:
	Features: Adds a tag button on profiles. If clicked, it tags the user (if tagged it doesn't untag), also reports user with clipboard content and puts profile link and    clipboard content into a text file for logging purpose. Also has a button which opens reports section, opens every report and highlights every link.
	
Usage: Copy evidence into clipboard, press the button. Thats it.
	
Issues: If you don't open a players profile link but instead go on market, hub, etc. first, then click on a profile, the button doesn't appear. It might also disappear after a tag has been executed, but it doesn't really matter.

WARNING: No promt to confirm or anything, pressing the button tags. Be careful.
	
![image](https://user-images.githubusercontent.com/79867635/111884653-52759e00-89c3-11eb-9fce-25830d087014.png)



Enjoy :)
