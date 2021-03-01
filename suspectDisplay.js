const { clipboard } = require('electron');
const fs = require('fs');
const path = 'C:\\Users\\example\\Desktop\\banlog.txt'; //path to your desktop on windows, replace "example" *optional*

function remSessStorage() { //removes caller and suspect data, also clears suspectFocusm if active
	if(window.focusInterval != undefined && window.focusInterval != 'undefined'){
		window.clearInterval(window.focusInterval);
		console.log('focusInterval cleared');
	}
	sessionStorage.removeItem('caller');
	sessionStorage.removeItem('suspect');
	sessionStorage.removeItem('initSpec');
}


const kpdObserver = new MutationObserver(() => {
	if(document.getElementById('specKPDTxt').innerHTML.includes('Profile URL')) { //detects tag
		let profName = sessionStorage.getItem('suspect');
		openURL('/social.html?p=profile&q='+profName); //opens suspects profile page *optional, can be commented out*
		remSessStorage(); 
		/*const text = '\nhttps://krunker.io/social.html?p=profile&q=' + profName + '\n'; //optional log 
		fs.appendFile(path, text, (err) => {
			if (err) {
				throw err;
			}
			console.log("Tag logged.");
		});*/
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Case submitted!') { //detects deny
		console.log('not cheating');
		remSessStorage();
		document.exitPointerLock(); //exits to main menu
		setTimeout( function() { shoPolicePop(); }, 200); //shows kpd window *optional*
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Is ' + sessionStorage.getItem('suspect') + ' hacking? Caller: ' + sessionStorage.getItem('caller')) { //detects if suspect was already inserted to prevent loop
		if(sessionStorage.getItem('suspect') == null) document.getElementById('specKPDTxt').innerHTML = 'Suspect left the game'; //if suspect left, display that
	}else if(document.getElementById('specKPDTxt').innerHTML.includes('Is Suspect hacking?') || (document.getElementById('specKPDTxt').innerHTML.includes('Is') && document.getElementById('specKPDTxt').innerHTML.includes('hacking?'))) { //detects default text
		document.getElementById('specKPDTxt').innerHTML = 'Is ' + sessionStorage.getItem('suspect') + ' hacking? Caller: ' + sessionStorage.getItem('caller'); //insert data
	}
});


module.exports = {
    name: 'suspectDisplay',
    version: '1.0.0',
    author: 'Ando',
    description: 'Shows caller and suspect in KPD mode',
    locations: ['game'],
    settings: {
        suspectDisplay: {
            name: 'Suspect display',
            id: 'suspectDisplay',
            cat: 'Suspect Display',
            type: 'checkbox',
			val: true,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
                if (value){
                    return kpdObserver.observe(specKPDTxt, { childList: true }); //observes changes in the area where suspect is displayed
                }
                kpdObserver.disconnect()
            }
        }
    }
}