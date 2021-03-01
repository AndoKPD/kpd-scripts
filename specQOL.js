function specHighlighter(divs) { //searches the data
	console.log('specHighlight');
	for(let i = 0; i < divs.length; i++) {
		if(divs[i].childNodes[2].innerHTML == sessionStorage.getItem('caller')) {
			console.log('caller found');
			divs[i].childNodes[2].style.color = '#135DD8'; //highlight caller in blue
			divs[i].childNodes[2].style.textShadow = 'none'; //removes text shadow *optional*
		}else if(divs[i].childNodes[2].innerHTML == sessionStorage.getItem('suspect')) {
			divs[i].childNodes[2].style.color = 'red'; //highlight suspect in red
			divs[i].childNodes[2].style.textShadow = 'none';//removes text shadow *optional*
			if(sessionStorage.getItem('suspectFocus') != null) { //if suspectFocus is toggled on
				window.focusInterval = setInterval(function() { focusPlayer(divs[i].childNodes[3].innerHTML); }, 1000);	//switch to suspect every second
			}
			console.log('suspect found');
		}
	}
}

function focusPlayer(number) { //execute switch
	console.log('focussing player ' + number);
	let keycode = 48 + parseInt(number);
	pressButton(keycode);
}


const specObserver = new MutationObserver(() => {
	if(window.focusInterval != undefined && window.focusInterval != 'undefined'){ //clear interval if mutation is detected
		window.clearInterval(window.focusInterval);
		console.log('focusInterval cleared');
	}
	console.log('spec mutation observed');
	let divs0 = document.getElementsByClassName('specPlayerHolder0'); //get data
	let divs1 = document.getElementsByClassName('specPlayerHolder1');
	if(divs0.length != 0) {
		console.log('divs0');
		specHighlighter(divs0); //search through data
	}
	if(divs1.length != 0) {
		console.log('divs1');
		specHighlighter(divs1); //search through data
	}
});



module.exports = {
    name: 'specQOL',
    version: '1.0.0',
    author: 'Ando',
    description: 'Adds a few features to spec mode in kpd',
    locations: ['game'],
    settings: {
        specQOL: {
            name: 'Spectate QOL',
            id: 'specQOL',
            cat: 'Spectate QOL',
            type: 'checkbox',
			val: true,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
				if (value && sessionStorage.getItem('initSpec') == 'true'){ //if initated by going in kpd mode, start execution
					console.log('specQOL started');
					specObserver.observe(specTeam0, { childList: true }); //observe both teams
					specObserver.observe(specTeam1, { childList: true });
					return;
				}
				specObserver.disconnect();
            }
        }
    }
}