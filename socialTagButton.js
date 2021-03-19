/*---------------------------------------------------------------------------By ando#6372---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------Constants---------------------------------------------------------------------------*/

const fs = require('fs');
const os = require('os');
const { clipboard } = require('electron');
const logPath = os.homedir() + '\\Documents\\KPD\\banlog.txt';
const detailedPath = os.homedir() + '\\Documents\\KPD\\detailed_log.txt';

/*---------------------------------------------------------------------------Variables---------------------------------------------------------------------------*/

let playerName;

/*---------------------------------------------------------------------------File IO---------------------------------------------------------------------------*/

function dirCheck() {
	if (!fs.existsSync(os.homedir() + '\\Documents\\KPD')){
		fs.mkdirSync(os.homedir() + '\\Documents\\KPD');
	}
}

function writeToFile(path, text) {
	fs.appendFile(path, text, (err) => {
		if (err) {
			throw err;
		}
		console.log('Tag logged.');
	});
}

function logProfile(text) {
	let printText = '\n\nhttps://krunker.io/social.html?p=profile&q=' + playerName + '\n' + text;
	dirCheck();
	writeToFile(logPath, printText);
	let d = new Date();
	writeToFile(detailedPath, printText + '\n' + d.toUTCString());
}

/*---------------------------------------------------------------------------FEATURES---------------------------------------------------------------------------*/

function pasteEvidence() {
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

function tag() {
	if(document.getElementById("hackText").style.display == 'none') {
		flagUser();
	}
}

function reportProfile() {
	reportPopup();
	let evidence = pasteEvidence();
	tag();
	logProfile(evidence);
	document.head.appendChild(Object.assign(document.createElement('style'), {
		innerText: `#tagBtn {
						color: green !important;
					}`
		}));
}


function openAllReports() {
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

/*---------------------------------------------------------------------------CSS Application---------------------------------------------------------------------------*/

function applyCSS() {
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
							color: rgba(0,0,0,.5);
						}
						.reportText > a {
							color: red;
						}
						.reportFrom, .reportText {
							user-select: text;
						}`
	}))
}

/*---------------------------------------------------------------------------Module---------------------------------------------------------------------------*/


module.exports = {
	name: 'Show tag button on profile',
	author: 'Ando',
	version: '1.0.0',
	locations: ['social'],
	run: () => {
		document.addEventListener('DOMContentLoaded', () => { 
			let profUrl = window.location.href;
			if(profUrl.includes('https://krunker.io/social.html?p=profile&q=')) {
				if(profUrl.includes('&autoTrade')) {
					playerName = profUrl.slice(43,-10);
				} else if(profUrl.includes('&autoReport')) {
					playerName = profUrl.slice(43,-11);
				} else {
					playerName = profUrl.slice(43);
				}
			}
			let span = document.createElement('span');
			span.id = 'tagBtn';
			span.innerHTML = 'gavel';
			span.className = 'material-icons';
			span.onmouseover = function() { SOUND.play('tick_0',0.1) }
			span.onclick = function() { reportProfile(); }
			
			
			let div = document.createElement('div');
			div.id = 'openRptBtn';
			div.innerHTML = 'Open All Reports';
			div.className = 'bottomBtn';
			div.onmouseover = function() { SOUND.play('tick_0',0.1) }
			div.onclick = function() { openAllReports(); }
			applyCSS();
			spanAppender(span);
			divAppender(div);
		});
	}
}
