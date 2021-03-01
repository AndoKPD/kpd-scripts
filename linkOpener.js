const { clipboard } = require('electron');

function openProfLink (profName) { //opens players profile
	window.open('https://krunker.io/social.html?p=profile&q=' + profName)
}

function openLink () { 
	let clipContent = clipboard.readText(); //get value from cliboard
	let profLink = document.getElementById("linkInput").value; //get value from input
	if(clipContent.includes('https://krunker.io/social.html?p=profile&q=') && profLink.length == 0) openProfLink(clipContent.slice(43)); //if clipboard includes profile link, open
	else {
		if (profLink != '') { 
		  if(profLink.length > 43) openProfLink(profLink.slice(43)); //opens profile based on input *case sensitive*
		  else openProfLink(profLink);
		}
	}
	document.getElementById("linkInput").value = ''; //clears input
}



document.addEventListener('DOMContentLoaded', function() { //adds elements to body
	let div = document.createElement('div');
	div.id = 'linkOpener';
	div.innerHTML = 'Open Link';
	div.className = 'button';
	let input = document.createElement('input');
	input.id = 'linkInput';
	input.placeholder = 'Link';
	input.className = 'formInput';
	document.getElementById('menuClassContainer').appendChild(div);
	document.getElementById('menuClassContainer').appendChild(input);
}, false);


module.exports = {
	name: 'Link Opener',
	version: '1.0.0',
	author: 'Ando',
	description: 'Adds an option to open a profile url either from clipboard or text.',
	locations: ['game'],
	settings: {
		linkOpener: {
			name: 'Show Open Link button',
			id: 'linkOpener',
			cat: 'Menu',
			type: 'checkbox',
			val: true,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
				let linkOpener = document.getElementById('linkOpener')
				let linkInput = document.getElementById('linkInput')
				if (linkOpener) { 
					linkOpener.style.display = value ? '' : 'none' //set display based on user choice, link functions
					linkInput.style.display = value ? '' : 'none' 
					linkOpener.onmouseover = function() { playTick(); }
					linkOpener.onclick = function() { openLink(); }
				}
			}
		}
	}
}




	