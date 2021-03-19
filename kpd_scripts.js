/*Constants*/
const fs = require('fs');
const path = 'C:\\Users\\example\\Desktop\\banlog.txt'; //path to your desktop on windows, replace "example" *optional*
const { clipboard } = require('electron');
const minLVL = 75; //configure to your liking
const highlightColor = 'red'; //configure to your liking
const profName = sessionStorage.getItem('suspect');
const profLVL = sessionStorage.getItem('suspectLVL');
const caller = sessionStorage.getItem('caller');

/*Global Variables*/

let activeTab;
let nametagState = true;
let senior;
let cssApplied = false;

/*Mutation Observers*/

const popupObserver = new MutationObserver(() => {
	if(document.getElementById('confPop').childNodes[0].innerHTML.includes('Are you sure you want to take action on') && document.getElementsByClassName('takeActionBtn tag').length == 1) {
		document.getElementById('confPop').childNodes[0].style.textAlign = 'center';
		let pnshBtn1 = document.getElementById('confPop').childNodes[1].appendChild(genPunishButton(1));
		let pnshBtn2 = document.getElementById('confPop').childNodes[1].appendChild(genPunishButton(2));
		pnshBtn1.style.backgroundColor = '#414a6d';
		pnshBtn2.style.backgroundColor = '#ed4242';
	}  
});

const kpdObserver = new MutationObserver(() => {
	console.log('mutation observed');
    let kpdHolder = document.getElementById('policePopC');
	activeTab = determineActiveTab(kpdHolder); 
	console.log('tab: ' + activeTab);
	if (activeTab != 0 && document.getElementById('kpdCalls').length != 0) { 
		if(activeTab == 1) { 
			console.log('highlight');
			highlight(); 
			joinButtonHook();
			if(!document.getElementById('kpdSearch')) { 
				let node = genSearchBar(activeTab);
				addSearchBar(node); 
			}
		} else if(activeTab == 2) {
			if(!document.getElementById('kpdSearch')) {
				let node = genSearchBar(activeTab);
				addSearchBar(node);
			}
			copyInit();
		} else {
			if(!document.getElementById('kpdSearch')) {
				let node = genSearchBar(activeTab);
				addSearchBar(node);
			}
		}
	}
});

const specObserver = new MutationObserver(() => {
	if(window.focusInterval != undefined && window.focusInterval != 'undefined'){
		window.clearInterval(window.focusInterval);
		console.log('focusInterval cleared');
	}
	console.log('spec mutation observed');
	let divs0 = document.getElementsByClassName('specPlayerHolder0');
	let divs1 = document.getElementsByClassName('specPlayerHolder1');
	if(divs0.length != 0) {
		console.log('divs0');
		specHighlighter(divs0);
	}
	if(divs1.length != 0) {
		console.log('divs1');
		specHighlighter(divs1);
	}
});

const callInfoObserver = new MutationObserver(() => {
	if(document.getElementById('specKPDTxt').innerHTML.includes('Profile URL')) {
		if(profName != null && profLVL != null && caller != null) {
			if(senior) {
				if(profLVL < 15) {
					const text = '\n\nhttps://krunker.io/social.html?p=profile&q=' + profName;
					writeToFile(text);
					remSessStorage();
					openKPDMenu();
				} else {
					remSessStorage();
					openURL('/social.html?p=profile&q='+profName);
				}
			} else {
				remSessStorage();
				openURL('/social.html?p=profile&q='+profName);
			}
		}
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Case submitted!') {
		console.log('not cheating');
		remSessStorage();
		openKPDMenu();
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Is ' + profName + ' hacking? Caller: ' + caller) {
		//if(sessionStorage.getItem('suspect') == null) document.getElementById('specKPDTxt').innerHTML = 'Suspect left the game';
	}else if(document.getElementById('specKPDTxt').innerHTML.includes('Is Suspect hacking?') || (document.getElementById('specKPDTxt').innerHTML.includes('Is') && document.getElementById('specKPDTxt').innerHTML.includes('hacking?'))) {
		document.getElementById('specKPDTxt').innerHTML = 'Is ' + profName + ' hacking? Caller: ' + caller;
	}
});

/*Element Generation & Appending*/

function genPunishButton(number) {
	let span = document.createElement('span');
	if(number == 1) {
		span.innerHTML = 'Log';
		span.className = 'takeActionBtn log';
		span.onclick = function() { logProfile(); };
	} else {
		span.innerHTML = 'AIO';
		span.className = 'takeActionBtn aio';
		span.onclick = function() { aioPunish(); };
	}
	return span;
}

function genSearchBar() {
	let input = document.createElement('input');
	input.id = 'kpdSearch';
	input.placeholder = 'Search Name';
	input.onkeyup = function() { searchCalls(); }
	console.log('generated searchbar');
	return input;
}

function addSearchBar(searchBar) {
	if(document.getElementById('policePopC').childNodes.length != 0) {
		applyCSS();
		let elem = document.getElementById('policePopC').insertBefore(searchBar, document.getElementById('policePopC').childNodes[3]);
		elem.oncontextmenu = function() { elem.value = clipboard.readText(); searchCalls(); };
		console.log('insert');
	} else {
		setTimeout(function() { addSearchBar(searchBar) }, 20);
	}
}

function genRegion(attrib) {
	let span = document.createElement('span');
	span.className = 'callRegion';
	span.innerHTML = attrib;
	console.log('generated region');
	return span;
}


function addRegion(joinButton) {
	if(joinButton.parentElement.childNodes[1].className != 'classRegion') {
		let region = joinButton.getAttribute('onclick').slice(12).split(':')[0];
		let regionSpan = genRegion(region);
		joinButton.parentElement.insertBefore(regionSpan, joinButton.parentElement.childNodes[1]);
		console.log('insert region');
	}
}

function genChatMsg(text) {
	let messageHolder = document.createElement('div');
	messageHolder.id = 'chatMsgHolder_toggle';
	let chatItem = document.createElement('div');
	chatItem.id = 'chatItem_toggle';
	chatItem.className = 'chatItem';
	chatItem.style
	let chatMsg = document.createElement('span');
	chatMsg.id = 'chatMsg_toggle';
	chatMsg.className = 'chatMsg';
	chatMsg.innerHTML = text;
	chatItem.appendChild(chatMsg);
	messageHolder.appendChild(chatItem);
	applyCSS();
	document.getElementById('chatList').appendChild(messageHolder).scrollIntoView({ behavior: "smooth", block: "end" });;
	console.log('generated message');
}

/*CSS Application*/

function applyCSS() {
	if(cssApplied) return;
	document.head.appendChild(Object.assign(document.createElement('style'), {
			innerText: `#kpdSearch {
							background-color: transparent;
							box-shadow: 0 0 7px 1px var(--accent);
							padding: 4px;
							width: 100%;
							text-align: left;
							font-size: 17px;
							box-sizing: border-box;
							border-radius: 4px;
							padding-right: 10px;
							padding-left: 10px;
							pointer-events: all;
							margin-bottom: 10px;
						}
						.callRegion {
							margin-right: 12px;
                        }
                        #chatItem_toggle {
							background-color: rgba(0, 0, 0, 0.4);
						}
						#chatMsg_toggle {
							color: #fc03ec;
						}
						#specKPDCaller {
							display: inline-block !important; 
							color: rgb(19, 93, 216) !important;
							font-size: 49px!important;
							vertical-align: middle;
							text-shadow: -1px -1px 0 #202020, 1px -1px 0 #202020, -1px 1px 0 #202020, 1px 1px 0 #202020;
							position: absolute;
							top: 1px;
							left: 12px;
						}
						.specPlayerHolder1 #specKPDCaller {
							left: 2px;
						}`
	}))
	cssApplied = true;
}

/*Custom Functions*/

function writeToFile(text) {
	fs.appendFile(path, text, (err) => {
		if (err) {
			throw err;
		}
		console.log("Tag logged.");
	});
}

function getAltMenuLogText() {
	let profLink = 'https://krunker.io/social.html?p=profile&q=';
	profLink += document.getElementById('confPop').childNodes[0].innerHTML.split(' ').reverse()[0].slice(0, -1);
	return '\n\n' + profLink;
}

function logProfile() {
	const text = getAltMenuLogText();
	writeToFile(text);
	document.getElementsByClassName('takeActionBtn log')[0].style.backgroundColor = 'green';
}

function aioPunish() {
	let playerID = document.getElementById('confPop').childNodes[1].childNodes[1].getAttribute('onclick').toString().split('"')[1];
	const text = getAltMenuLogText();
	flagPlayerConfirmed(playerID);
	banPlayerConfirmed(playerID);
	writeToFile(text);
	document.getElementsByClassName('takeActionBtn aoi')[0].style.backgroundColor = 'green';
}

function determineActiveTab(kpdHolder) {
	console.log('determineActiveTab');
	if(kpdHolder.children[2].children[0].className == 'menuTabNew tabANew') return 1;
	else if(kpdHolder.children[2].children[1].className == 'menuTabNew tabANew') return 2;
	return 0;
}

function searchCalls() { 
	console.log('searching');
    let inputVal = document.getElementById('kpdSearch').value.toLowerCase(); 
    let divs = document.getElementById('kpdCalls').childNodes; 
      
    for (i = 0; i < divs.length; i++) {
		if(activeTab == 1) {
			let caller = divs[i].childNodes[2].innerHTML.toLowerCase(); 
			let suspect = divs[i].childNodes[5].innerHTML.toLowerCase(); 
			let cLevel = divs[i].childNodes[1].innerHTML;
			let sLevel = divs[i].childNodes[4].innerHTML;
			let timeAgo = divs[i].childNodes[7].childNodes[0].innerHTML;
			let region = divs[i].childNodes[7].childNodes[1].innerHTML;
			if (caller.includes(inputVal) || suspect.includes(inputVal) ||
			cLevel.includes(inputVal) || sLevel.includes(inputVal) || 
			timeAgo.includes(inputVal) || region.toLowerCase().includes(inputVal.toLowerCase())) { 
				divs[i].style.display="block";			
			} 
			else { 
				divs[i].style.display="none";        
			} 
		}
		if(activeTab == 2) {
			let tagger = divs[i].outerHTML.split('=')[5].split('>')[0].toLowerCase();
			let hacker = divs[i].outerHTML.split('=')[10].split('>')[0].toLowerCase();
			if (tagger.includes(inputVal) || hacker.includes(inputVal)) { 
				divs[i].style.display="block";			
			} 
			else { 
				divs[i].style.display="none";        
			} 
		}
    } 
} 

function highlight() { //highlights calls
	if(document.getElementById('kpdCalls').childNodes.length != 0 && document.getElementsByClassName('kpdRepLvl').length != 0) { //if data is present
		console.log('highlighting');
		let lvl = document.getElementById('kpdCalls').childNodes;
		for(let i = 0; i < lvl.length; i++){
			if(lvl[i].childNodes[1].innerHTML >= minLVL) lvl[i].childNodes[1].style.color = highlightColor; //highlight the number
			if(senior) {
				if(lvl[i].childNodes[4].innerHTML < 15) {
					lvl[i].childNodes[4].style.color = '#63de26';
				} else {
					lvl[i].childNodes[4].style.color = '#fc3232';
				}
			}
		}
	}else {
		setTimeout(highlight, 20); //try again
	}	
}

function joinKPD(joinFunc, caller, suspect, suspectLVL) {
	console.log(joinFunc);
	console.log(caller);
	console.log(suspect);
	console.log(suspectLVL);
	sessionStorage.setItem('caller', caller);
	sessionStorage.setItem('suspect', suspect);
	sessionStorage.setItem('suspectLVL', suspectLVL);
	sessionStorage.setItem('initSpec', 'true');
	const f = new Function(joinFunc);
	f();
}

function joinButtonHook() {
	if(document.getElementsByClassName('policeJoinB').length != 0) {
		console.log('hooking join button');
		let jBtns = document.getElementsByClassName('policeJoinB');
		for(let i = 0; i < jBtns.length; i++){
			if(jBtns[i].parentElement.childNodes[1].className != 'callRegion') addRegion(jBtns[i]);
			jBtns[i].onclick = function() { joinKPD(jBtns[i].getAttribute('onclick'), jBtns[i].parentElement.parentElement.childNodes[2].innerHTML, jBtns[i].parentElement.parentElement.childNodes[5].innerHTML, jBtns[i].parentElement.parentElement.childNodes[4].innerHTML) };
		}
	}else {
		setTimeout(joinButtonHook, 20);
	}	
}

function toggleNames() {
	if(nametagState) {
		setSetting("hideNames", 0);
		genChatMsg('Nametags are on');
        console.log('on');
        nametagState = false
	} else {
		setSetting("hideNames", 3);
		genChatMsg('Nametags are off');
        console.log('off');
        nametagState = true;
	}
}

function toggleFocus() {
	if(localStorage.getItem('suspectFocus') == null) {
		localStorage.setItem('suspectFocus', 'on');
		genChatMsg('Suspect focus is on');
        console.log('on');
        focusState = false;
	} else {
		localStorage.removeItem('suspectFocus');
		if(window.focusInterval != undefined && window.focusInterval != 'undefined'){
			window.clearInterval(window.focusInterval);
			console.log('focusInterval cleared');
		}	
		genChatMsg('Suspect focus is off');
        console.log('off');
        focusState = true;
	}
}

function specHighlighter(divs) {
	console.log('specHighlight');
	for(let i = 0; i < divs.length; i++) {
		if(divs[i].childNodes[2].innerHTML == sessionStorage.getItem('caller')) {
			console.log('caller found');
			divs[i].childNodes[2].style.color = '#135DD8';
			divs[i].childNodes[2].style.textShadow = 'none';
			divs[i].childNodes[5].innerHTML = 'call';
			divs[i].childNodes[5].id = 'specKPDCaller';
			divs[i].childNodes[0].setAttribute('style', 'outline: solid 4px #135DD8;')
			applyCSS();
		}else if(divs[i].childNodes[2].innerHTML == sessionStorage.getItem('suspect')) {
			divs[i].childNodes[2].style.color = '#c00000';
			divs[i].childNodes[2].style.textShadow = 'none';
			divs[i].childNodes[0].setAttribute('style', 'outline: solid 4px #c00000;')
			if(localStorage.getItem('suspectFocus') != null) {
				window.focusInterval = setInterval(function() { focusPlayer(divs[i].childNodes[3].innerHTML); }, 1000);	
			}
			console.log('suspect found');
		}
	}
}

function focusPlayer(number) {
	console.log('focussing player ' + number);
	let keycode = 48 + parseInt(number);
	pressButton(keycode);
}

function remSessStorage() {
	if(window.focusInterval != undefined && window.focusInterval != 'undefined'){
		window.clearInterval(window.focusInterval);
		console.log('focusInterval cleared');
	}
	sessionStorage.removeItem('caller');
	sessionStorage.removeItem('suspect');
	sessionStorage.removeItem('suspectLVL');
	sessionStorage.removeItem('initSpec');
}

function copyInit(){
	if(document.getElementById('kpdCalls').childNodes[0].childNodes.length == 6) { //if data is present
		let divs = document.getElementById('kpdCalls').childNodes;
		for(let i = 0; i < divs.length; i++){
			divs[i].childNodes[0].oncontextmenu = function() { execCopy(divs[i].childNodes[0])	}
			divs[i].childNodes[4].oncontextmenu = function() { execCopy(divs[i].childNodes[4])	}
		}
	}else {
		setTimeout(copyInit, 20); //try again
	}	
}

function execCopy(elem) {
	let name = elem.innerHTML;
	clipboard.writeText(name);
	elem.innerHTML = 'Copied'
	setTimeout(function() { elem.innerHTML = name }, 800);
}

function openKPDMenu() {
	document.exitPointerLock();
	setTimeout( function() { shoPolicePop(); }, 200);
}

/*Modules*/

module.exports = {
    name: 'KPD Scripts',
    version: '1.0.0',
    author: 'Ando',
    description: 'Collection of QOL Changes for KPD Officers',
    locations: ['game'],
    settings: {
        altLog: {
            name: 'Alt Menu Logger',   
            id: 'altLog',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
                if (value){
                    return popupObserver.observe(confPop, { childList: true });
                }
                popupObserver.disconnect()
            }
        },
        kpdMenuQOL: {
			name: 'KPD QOL',
			id: 'kpdMenuQOL',
			cat: 'KPD',
			type: 'checkbox',
			val: true,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
                if (value){
                    return kpdObserver.observe(policePopC, { childList: true });
                }
                kpdObserver.disconnect()
            }
        },
        nametagHider: {
            name: "Nametag Hider",
            id: "nametagHider",
            cat: "KPD",
            type: 'text',
            val: '',
            placeholder: 'F2',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
        },
        specQOL: {
            name: 'Spectate QOL',
            id: 'specQOL',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
				if (value && sessionStorage.getItem('initSpec') == 'true'){
					console.log('specQOL started');
					document.addEventListener('DOMContentLoaded', () => {
						let cnvs = document.getElementById('game-overlay');
						let att = document.createAttribute("tabindex"); 
						att.value = "1";
						cnvs.setAttributeNode(att);
					})
					specObserver.observe(specTeam0, { childList: true });
					specObserver.observe(specTeam1, { childList: true });
					return;
				}
				specObserver.disconnect();
            }
        },
        suspectDisplay: {
            name: 'Suspect Display',
            id: 'suspectDisplay',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
                if (value){
                    return callInfoObserver.observe(specKPDTxt, { childList: true });
                }
                callInfoObserver.disconnect()
            }
        },
        suspectFocus: {
            name: "Suspect Focus",
            id: "suspectFocus",
            cat: "KPD",
            type: 'text',
            val: '',
            placeholder: 'F1',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
        },
		seniorSet: {
			name: 'Senior',
			id: 'senior',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() {
                return clientUtil.genCSettingsHTML(this)
            },
            set: value => {
                senior = value;
            }
		},
		openKPD: {
		name: "Open KPD",
            id: "openKPD",
            cat: "KPD",
            type: 'checkbox',
            val: true,
            placeholder: 'F3',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
                if(value) {
						document.addEventListener("keydown", (e) => ((e.key === 'i' || e.key === 'I') && (openKPDMenu())));
				}
            }
		}
	},
    "run": config => {
        let hotkey1 = config.get("nametagHider", true)
        let hotkey2 = config.get("suspectFocus", true)
		if (hotkey1 !== "") {
			document.addEventListener("keydown", (e) => ((e.key === hotkey1) && (toggleNames())));
        }
        if (hotkey2 !== "") {
			document.addEventListener("keydown", (e) => ((e.key === hotkey2) && (toggleFocus())));
		}
    },
}
