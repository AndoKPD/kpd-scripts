const { clipboard } = require('electron');
const path = 'C:\\Users\\example\\Desktop\\banlog.txt'; //path to your desktop on windows, replace "example" *optional*
const fs = require('fs');
let playerName;


function pasteEvidence() { //waits until report text area is loaded, gets evidence from clipboard, pastes it and sends the report
	if(!!document.getElementById("reportTxt")) {
		let clipContent = clipboard.readText();
		if(clipContent != null && clipContent != '' && !(clipContent.includes('https://krunker.io/social.html?p=profile&q='))) {
			document.getElementById("reportTxt").value = clipboard.readText();
		}
		setTimeout(function() { reportUser() }, 20);
		return clipContent;
	} else {
		setTimeout(function() { pasteEvidence }, 20);
	}
}

function tag() { //if the user is not tagged, tag. else do nothing
	if(document.getElementById("hackText").style.display == 'none') {
		flagUser();
	}
}


function logTag(evidence) { //log player link and evidence to text file
	const text = '\n\nhttps://krunker.io/social.html?p=profile&q=' + playerName + '\n' + evidence;
	fs.appendFile(path, text, (err) => {
		if (err) {
			throw err;
		}
		console.log("Tag logged.");
	});
}

function reportProfile() { //opens the report window, pastes evidence and sends report, tags, logs evidence
	reportPopup();
	let evidence = pasteEvidence();
	tag();
	logTag(evidence);
}

function openAllReports() { //opens every report on report page for faster viewing
	openProfileTab('reports');
	let divs = document.getElementsByClassName('reportHolder');
	for(let i = 0; i < divs.length; i++) {
		openReport(divs[i]);
	}
}

function divAppender (divElem) {
	if (document.getElementsByClassName('rightBottomHolder').length != 0) {
		document.getElementsByClassName('rightBottomHolder')[0].appendChild(divElem);
	} else {
		setTimeout(function() {
			divAppender(divElem);		
		}, 100);
	}
}


function spanAppender (spanElem) {
	if (document.getElementsByClassName('rightTopHolder').length != 0) {
		document.getElementsByClassName('rightTopHolder')[0].appendChild(spanElem);
	} else {
		setTimeout(function() {
			spanAppender(spanElem);		
		}, 100);
	}
}



function applyCSS() { //puts the needed styling in the css
	document.head.appendChild(Object.assign(document.createElement('style'), {
			innerText: `#tagBtn {
							color: black;
							pointer-events: all;
							cursor: pointer;
							-webkit-transition: all .2s;
							transition: all .2s;
							font-size: 32px;
							text-shadow: 0 0 3px white;
						}
						#tagBtn:hover {
							-webkit-transform: scale(.95);
							transform: scale(.95);
							filter: contrast(1.5);
							-webkit-filter: contrast(1.5);
						}
						#openRptBtn {
							color: var(--red);
							border-color: var(--red);
						}
						.reportText > a[href^="https://krunker.io/"] {
							color: white;
						}
						.reportText > a {
							color: red;
						}`
	}))
}




module.exports = {
	name: 'Show tag button on profile',
	author: 'Ando',
	version: '1.0.0',
	locations: ['social'],
	run: () => {
		document.addEventListener('DOMContentLoaded', () => { //waits until page is loaded, then starts execution
			let profUrl = window.location.href; //gets current link
			if(profUrl.includes('https://krunker.io/social.html?p=profile&q=')) { //checks if link is a players profile
				if(profUrl.includes('&autoTrade')) { //figures out players name
					playerName = profUrl.slice(43,-10);
				} else if(profUrl.includes('&autoReport')) {
					playerName = profUrl.slice(43,-11);
				} else {
					playerName = profUrl.slice(43);
				}
			}
			let span = document.createElement('span'); //creates new span element and labels it
			span.id = 'tagBtn';
			span.innerHTML = 'tag';
			span.className = 'material-icons';
			span.onmouseover = function() { SOUND.play('tick_0',0.1) }
			span.onclick = function() { reportProfile(); }
			
			let div = document.createElement('div');
			div.id = 'openRptBtn';
			div.innerHTML = 'Open All Reports';
			div.className = 'bottomBtn';
			div.onmouseover = function() { SOUND.play('tick_0',0.1) }
			div.onclick = function() { openAllReports(); }
			applyCSS(); //adds the css
			spanAppender(span); //adds the element to the page
			divAppender(div);
		})
	}
}
