/*---------------------------------------------------------------------------By ando#6372---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------Constants---------------------------------------------------------------------------*/

const fs = require('fs');
const os = require('os');
const { clipboard } = require('electron');
const logPath = os.homedir() + '\\Documents\\KPD\\banlog.txt';
const detailedPath = os.homedir() + '\\Documents\\KPD\\detailed_log.txt';

/*---------------------------------------------------------------------------Global Variables---------------------------------------------------------------------------*/

/*User Set*/
let senior = false;
let executive = false;
let detailedLog = false;
let autoOpenMenu = false;
let persistentClipboard = false;
let minLVL = 75;
let highlightColor = '#63de26';
let antiHighlightColor = '#fc3232';

/*Code Set*/

let suspect;
let suspectLVL;
let caller;
let suspectID;
let activeTab;
let gameRegion;
let kpdJoin = false;
let frozen = false;
let oldTr;
let oldDate;
let oldClipboard;
let banMap = new Map();
let minLevelCap = 15;

/*---------------------------------------------------------------------------Chat Message Generation---------------------------------------------------------------------------*/

function removeElement(element) {
	setTimeout(function () { element.remove() }, 2250);
}

function genChatMsg(text) {
	let messageHolder = document.createElement('div');
	messageHolder.className = 'chatMsgHolder_toggle';
	let chatItem = document.createElement('div');
	chatItem.id = 'chatItem_toggle';
	chatItem.className = 'chatItem';
	let chatMsg = document.createElement('span');
	chatMsg.id = 'chatMsg_toggle';
	chatMsg.className = 'chatMsg';
	chatMsg.innerHTML = text;
	chatItem.appendChild(chatMsg);
	messageHolder.appendChild(chatItem);
	let elem = document.getElementById('chatHolder').insertBefore(messageHolder, document.getElementById('chatList'));
	elem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    removeElement(elem);
	console.log('generated message');
}

/*---------------------------------------------------------------------------CSS Application---------------------------------------------------------------------------*/

function applyCSS() {
	document.head.appendChild(Object.assign(document.createElement('style'), {
			innerText: `
						#chatList::-webkit-scrollbar {
							display: none;
						}
						.chatItem {
							margin-left: 0px
						}
						#linkInput {
							background: #414a6d!important;
    						color: white;
						}
						#linkOpener {
							background-color: #414a6d!important;
							box-shadow: inset 0 -7px 0 0 #252a3d!important;
						}
						#settingsTabLayout {
							grid-template-columns: auto auto auto auto auto auto auto;
						}
						#specKPDContr {
							width: auto;
						}
						#kpdSearch {
							background-color: transparent;
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
                        #chatItem_toggle {
							background-color: rgba(0, 0, 0, 0.4);
						}
						#chatMsg_toggle {
							color: #fc03ec;
						}
						#specKPDSuspect {
							display: inline-block !important; 
							color: #c00000!important;
							font-size: 49px!important;
							vertical-align: middle;
							text-shadow: -1px -1px 0 #202020, 1px -1px 0 #202020, -1px 1px 0 #202020, 1px 1px 0 #202020;
							position: absolute;
							top: 1px;
							left: 12px;
						}
						.specPlayerHolder1 #specKPDCaller, .specPlayerHolder1 #specKPDSuspect {
							left: 2px;
						}
						.customPunishHolder {
							display: table;
							table-layout: fixed;
							width: 100%;
							border-spacing: 7px;
							border-collapse: separate;
						}
						#menuWindow > table > tbody > tr:hover {
							border-bottom: 3px solid #fc3232;
						}
						.punishButton.kpd {
							background-color: #414a6d;
							position: relative;
						}
						.pListName {
							padding-left: unset;
						}`
	}));
}

/*---------------------------------------------------------------------------Logging---------------------------------------------------------------------------*/

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
		genChatMsg('Tag logged');
		console.log('Tag logged.');
	});
}

function webhookLog(text) {
	var request = new XMLHttpRequest();
	request.open('POST', sessionStorage.getItem('webhookLink'));

	request.setRequestHeader('Content-type', 'application/json');

	var params = {
	  username: localStorage.getItem('username'),
	  avatar_url: sessionStorage.getItem('webhookPfp'),
	  content: text
	}
	request.send(JSON.stringify(params));
  }

function logProfile(text) {
	dirCheck();
	if(sessionStorage.getItem('webhookLink') != null){
		webhookLog(text);
	}
	writeToFile(logPath, text);
	if(detailedLog) {
		let d = new Date();
		writeToFile(detailedPath, text + '\n' + d.toUTCString());
	}
}

/*---------------------------------------------------------------------------FEATURES---------------------------------------------------------------------------*/




/*---------------------------------------------------------------------------KPD Menu QOL---------------------------------------------------------------------------*/

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
			banlogInit();
		} else {
			if(!document.getElementById('kpdSearch')) {
				let node = genSearchBar(activeTab);
				addSearchBar(node);
			}
		}
	}
});

function determineActiveTab(kpdHolder) {
	if(document.getElementById('kpdCalls').childNodes.length != 0) { //if data is present
		console.log('determineActiveTab');
		if(kpdHolder.children[2].children[0].className == 'menuTabNew tabANew') return 1;
		else if(kpdHolder.children[2].children[1].className == 'menuTabNew tabANew') return 2;
		return 0;
	} else {
		setTimeout(highlight, 20); //try again
	}
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
				divs[i].style.display='block';			
			} else { 
				divs[i].style.display='none';        
			} 
		}
		if(activeTab == 2) {
			let tagger = divs[i].outerHTML.split('=')[5].split('>')[0].toLowerCase();
			let hacker = divs[i].outerHTML.split('=')[10].split('>')[0].toLowerCase();
			if (tagger.includes(inputVal) || hacker.includes(inputVal)) { 
				divs[i].style.display='block';			
			} 
			else { 
				divs[i].style.display='none';        
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
			if(senior || executive) {
				if(lvl[i].childNodes[4].innerHTML < minLevelCap) {
					console.log('highlighting green');
					lvl[i].childNodes[4].style.color = highlightColor;
				} else {
					lvl[i].childNodes[4].style.color = antiHighlightColor;
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
	sessionStorage.setItem('kpdJoin', 'true');
	const f = new Function(joinFunc);
	f();
}

function joinButtonHook() {
	if(document.getElementsByClassName('policeJoinB').length != 0) {
		console.log('hooking join button');
		let jBtns = document.getElementsByClassName('policeJoinB');
		for(let i = 0; i < jBtns.length; i++){
			jBtns[i].onclick = function() { joinKPD(jBtns[i].getAttribute('onclick'), jBtns[i].parentElement.parentElement.childNodes[2].innerHTML, jBtns[i].parentElement.parentElement.childNodes[5].innerHTML, jBtns[i].parentElement.parentElement.childNodes[4].innerHTML) };
		}
	}else {
		setTimeout(joinButtonHook, 20);
	}	
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
		let elem = document.getElementById('policePopC').insertBefore(searchBar, document.getElementById('policePopC').childNodes[3]);
		elem.oncontextmenu = function() { elem.value = clipboard.readText(); searchCalls(); };
		console.log('insert');
	} else {
		setTimeout(function() { addSearchBar(searchBar) }, 20);
	}
}

function banlogInit(){
	console.log('banlogInit');
	if(document.getElementById('kpdCalls').childNodes[0].childNodes.length == 6) { //if data is present
		let divs = document.getElementById('kpdCalls').childNodes;
		for(let i = 0; i < divs.length; i++){
			divs[i].childNodes[0].oncontextmenu = function() { execCopy(divs[i].childNodes[0])	}
			divs[i].childNodes[4].oncontextmenu = function() { execCopy(divs[i].childNodes[4])	}
			divs[i].onmouseover = function() {
				oldDate = divs[i].lastChild.innerHTML;
				let currentDate = new Date();
				let currentUTC = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
				let logDate = new Date(oldDate)
				divs[i].lastChild.innerHTML = minsToTimeString((currentUTC - logDate) / 1000 / 60);
			}
			divs[i].onmouseout = function() {
				divs[i].lastChild.innerHTML = oldDate;
			}
		}
	}else {
		setTimeout(banlogInit, 20); //try again
	}	
}

function minsToTimeString(minutes) {
	let m1 = parseInt(minutes);
	if (isNaN(m1)) m1 = 0;
	let t3 = Math.floor(m1);
	let t4= Math.floor(t3/1440);
	let t5= t3-(t4*1440);
	let t6= Math.floor(t5/60);
	let t7= t5-(t6*60);

	return getDateString(t4, t6, t7);
}

function getDateString(days, hours, minutes) {
	let dayString = days + ' days';
	let hourString = hours + ' hours';
	let minuteString = minutes + ' minutes';

	if(days == 0) {
		dayString = '';
	}

	if(hours == 0) {
		hourString = '';
	}

	if(days == 1) {
		dayString = dayString.slice(0, -1);
	}

	if(hours == 1) {
		hourString = hourString.slice(0, -1);
	}

	if(minutes == 1) {
		minuteString = minuteString.slice(0, -1);
	}

	return 'Tagged ' + dayString + ' ' + hourString + ' ' + minuteString + ' ago';
}

function execCopy(elem) {
	console.log('copyExec')
	let name = elem.innerHTML;
	clipboard.writeText(name);
	elem.innerHTML = 'Copied'
	setTimeout(function() { elem.innerHTML = name }, 800);
}

/*---------------------------------------------------------------------------Spectate QOL---------------------------------------------------------------------------*/

const specObserver = new MutationObserver(() => {
	suspectObserver.disconnect();
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

const suspectObserver = new MutationObserver((mutationList) => {
	console.log('suspect observer');
	mutationList.forEach(function(mutation) {
		if(mutation.oldValue == 'specPlayerIcon silhouette') {
			let specNr = mutation.target.parentElement.childNodes[3].innerHTML;
			console.log('specNr ' + specNr);
			if(specNr == '') {
				clickToPlayer(mutation.target.parentElement);
			} else {
				focusPlayer(specNr);
			}
		}
	});
});



function specHighlighter(divs) {
	if(suspect == null) return;
	console.log('specHighlight');
	for(let i = 0; i < divs.length; i++) {
		if(divs[i].childNodes[2].innerHTML == suspect) {
			divs[i].childNodes[2].style.color = '#c00000';
			divs[i].childNodes[2].style.textShadow = 'none';
			divs[i].childNodes[0].setAttribute('style', 'outline: solid 4px #c00000;')
			if(sessionStorage.getItem('suspect') == null){
				divs[i].childNodes[5].id = 'specKPDSuspect';
				divs[i].childNodes[5].innerHTML = 'search';
			} 
			if(localStorage.getItem('suspectFocus') != null) {
				suspectObserver.observe(divs[i].firstChild, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
				if(divs[i].firstChild.className != 'specPlayerIcon') break;
				let specNr = divs[i].childNodes[3].innerHTML;
				console.log('specNr ' + specNr);
				if(specNr == '') {
					clickToPlayer(divs[i]);
				} else {
					focusPlayer(specNr);
				}
				
			} else {
				genChatMsg('Suspect Focus is disabled');
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

function clickToPlayer(elem) {
	for(let i = 0; i < 100; i++) {
		setTimeout(() => {
			if(elem.childNodes[4].getAttribute('style').includes('display: inline-block;')) return;
			if(elem.childNodes[4].getAttribute('style').includes('display: none;')) spectMode(1);
		}, i * 5);
	}
}

/*---------------------------------------------------------------------------Alt Menu Buttons---------------------------------------------------------------------------*/

const menuObserver = new MutationObserver(() => {
	console.log('menu observing');
	if(document.getElementById('menuWindow').firstChild.outerHTML.includes('Player List')) {
		document.getElementById('menuWindow').firstChild.insertBefore(genFreezeSpan(), document.getElementById('menuWindow').firstChild.childNodes[2]).style.marginTop = '8px';
		document.getElementById('menuWindow').firstChild.insertBefore(genTagSpan(), document.getElementById('menuWindow').firstChild.childNodes[2]).style.marginTop = '8px';
		document.getElementById('menuWindow').firstChild.insertBefore(document.createElement('br'), document.getElementById('menuWindow').firstChild.childNodes[2]);
		document.getElementById('menuWindow').firstChild.insertBefore(document.createElement('br'), document.getElementById('menuWindow').firstChild.lastChild);
		if(frozen) {
			console.log('menu frozen');
			document.getElementById('menuWindow').lastChild.firstChild.remove();
			document.getElementById('menuWindow').lastChild.appendChild(oldTr);
		} else {
			console.log('player list');
			let trList = document.getElementById('menuWindow').getElementsByTagName('tr');
			let i = 0;
			if(trList[0].outerHTML.includes('Kick Spec')) i++;
			for(i; i < trList.length; i++) {
				let tempPunish = trList[i].insertBefore(genPunishButton(), trList[i].firstChild);
				let tempSpec = trList[i].insertBefore(genSpecButton(), trList[i].firstChild);
				let tmpSuspect;
				let tmpSuspectName;
				let tmpID;
				if(document.getElementsByClassName('pListName')[i].childNodes[0].tagName != 'A') {
					tmpSuspect = document.getElementsByClassName('pListName')[i].childNodes[1].getAttribute('href').split('=').reverse()[0];
					tmpID = document.getElementsByClassName('pListName')[i].childNodes[1].getAttribute('oncontextmenu').split('"')[1];
				} else {
					tmpSuspect = document.getElementsByClassName('pListName')[i].childNodes[0].getAttribute('href').split('=').reverse()[0];
					tmpID = document.getElementsByClassName('pListName')[i].childNodes[0].getAttribute('oncontextmenu').split('"')[1];
				}
				if(document.getElementsByClassName('pListName')[i].innerText.charAt(document.getElementsByClassName('pListName')[i].innerText.length - 6) == '[') {
					tmpSuspectName = document.getElementsByClassName('pListName')[i].innerText.slice(0, -7);
				} else {
					tmpSuspectName = document.getElementsByClassName('pListName')[i].innerText;
				}
							
				if(tmpSuspectName == suspect) {
					tempSpec.firstChild.innerHTML = 'visibility_off';
					tempSpec.style.color = 'red';
					tempSpec.onclick = function() { unfocusPlayer(); tempSpec.childNodes[0].innerHTML = 'visibility'; };
					trList[i].style.outline = '3px solid ' + antiHighlightColor;
					tempPunish.firstChild.innerHTML = 'person_remove_alt_1';
				} else {
					tempSpec.onclick = function() { altfocusPlayer(tmpSuspectName, tmpID) };
				}

				if(banMap.has(tmpSuspect)) {
					tempPunish.firstChild.setAttribute('style', 'color: ' + antiHighlightColor + ' !important;');
					tempPunish.firstChild.innerHTML = 'person_remove_alt_1';
					tempPunish.onclick = function() { banMap.delete(tmpSuspect); showWindow(23); showWindow(23); };
				} else {
					tempPunish.firstChild.style.color = 'inherit';
					tempPunish.firstChild.innerHTML = 'person_add_alt_1';
					tempPunish.onclick = function() { banMap.set(tmpSuspect, tmpID); showWindow(23); showWindow(23); };	
				}
			}
			oldTr = document.getElementById('menuWindow').lastChild.firstChild;
		}
	}  
});

function genFreezeSpan() {
	let spanBtn = document.createElement('span');
	let spanText = document.createElement('span');
	spanBtn.id = 'freezeMenu';
	spanBtn.className = 'punishButton kpd';
	spanText.className = 'takeAction';
	if(frozen) spanText.innerHTML = 'Unfreeze';
	else spanText.innerHTML = 'Freeze';
	spanBtn.onmouseenter = function() { playTick(); };
    spanBtn.onclick = () => freeze();
	spanBtn.appendChild(spanText);
	return spanBtn;
}

function genTagSpan() {
	let spanBtn = document.createElement('span');
	let spanIcon = document.createElement('span');
	spanBtn.id = 'tagMenu';
	spanBtn.className = 'punishButton kpd';
	spanIcon.className = 'takeAction';
	spanIcon.innerHTML = 'Tag';
	spanBtn.onmouseenter = function() { playTick(); };
    spanBtn.onclick = function() { multiPunish(); }
	spanBtn.appendChild(spanIcon);
	return spanBtn;
}


function genSpecButton() {
	let spanBtn = document.createElement('span');
	let spanIcon = document.createElement('span');
	spanBtn.className = 'punishButton kpd';
	spanIcon.className = 'takeAction material-icons';
	spanIcon.innerHTML = 'visibility';
	spanBtn.onmouseenter = function() { playTick(); };
	spanBtn.appendChild(spanIcon);
	return spanBtn;
}

function genPunishButton() {
	let spanBtn = document.createElement('span');
	let spanIcon = document.createElement('span');
	spanBtn.className = 'punishButton kpd';
	spanIcon.className = 'takeAction material-icons';
	spanIcon.innerHTML = 'person_add_alt_1';
	spanBtn.onmouseenter = function() { playTick(); };
	spanBtn.appendChild(spanIcon);
	return spanBtn;
}

function freeze() {
	if(frozen) {
		console.log('unfreezing');
		frozen = false;
		showWindow(23);
		showWindow(23);
	} else {
		console.log('freezing');
		document.getElementById('freezeMenu').innerHTML = 'Unfreeze';
		frozen = true;
	}
}

function multiPunish() {
	let i = -1;
	if(banMap.size == 0 && suspect == null) {
		genChatMsg('List empty');
		return;
	} else if(banMap.size == 0 && suspect != null) {
		multiTagHandler(suspect, suspectID);
		return;
	}
	banMap.forEach(function(value, key) {
		i++;
		setTimeout(function() { multiTagHandler(key, value) }, i * 200);
	});
}

function multiTagHandler(name, id) {
	console.log('tag');
	flagPlayerConfirmed(id);
	banPlayerConfirmed(id);
	if(name.includes('Guest_')) {
		if(!(isNaN(parseInt(name.split('_')[1])))) {
			console.log('Guest tag')
			return;
		}
	}
	logProfile('https://krunker.io/social.html?p=profile&q=' + name + '\n');
	banMap.delete(name);
}

function altfocusPlayer(focusName, focusID) {
	console.log('focusPlayer ' + focusName + ' ID ' +focusID);
	if(suspect != null) unfocusPlayer();
	kpdJoin = false;
	suspect = focusName;
	suspectID = focusID;
	genChatMsg('Suspect set: ' + suspect);
	toggleSpect(true);
	showWindow(23);
	let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent ('mousedown', true, true);
    document.getElementsByTagName('canvas')[4].dispatchEvent (clickEvent);
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
	/*console.log('contr display');
	document.getElementById('specKPDContr').style.display = 'block';
	document.getElementById('specKRHid').style.display = 'block';
	document.getElementById('specKPDTxt').innerHTML = 'Is ' + suspect + ' hacking?';
	console.log('kpd text edited focus');
	document.addEventListener('keydown', banHandler);*/
}

/*function banHandler(e) {
	console.log('banfunc eventlistener ' + e.key);
		if(document.activeElement.tagName === 'INPUT') return;
		switch(e.key) {
			case 'y':
				flagPlayerConfirmed(suspectID);
				banPlayerConfirmed(suspectID);
				if(!(suspect.includes('Guest_')) && !(isNaN(parseInt(suspect.split('_')[1])))) logProfile('https://krunker.io/social.html?p=profile&q=' + suspect + '\n');
				unfocusPlayer();
				break;

			case 'n': 
				pressButton(78);
				unfocusPlayer();
				break;
		}
}*/

function unfocusPlayer() {
	console.log('unfocusPlayer');
	suspectObserver.disconnect();
	//document.removeEventListener('keydown', banHandler);
	document.getElementById('specKPDContr').style.display = 'none';
	genChatMsg('Suspect removed: ' + suspect);
	let divs0 = document.getElementsByClassName('specPlayerHolder0');
	let divs1 = document.getElementsByClassName('specPlayerHolder1');
	if(divs0.length != 0) {
		stopHighlight(divs0);
	}
	if(divs1.length != 0) {
		stopHighlight(divs1);
	}
	suspect = null;
	suspectID = null;
	caller = null;
	suspectLVL = null;
	remSessStorage();
	document.exitPointerLock();
	showWindow(23);
	showWindow(23);
	toggleSpect(false);
}

function stopHighlight(divs) {
	for(let i = 0; i < divs.length; i++) {
		if(divs[i].childNodes[2].innerHTML == suspect) {
			divs[i].childNodes[2].style.color = 'white';
			divs[i].childNodes[2].style.textShadow = 'none';
			divs[i].childNodes[0].setAttribute('style', 'outline: none;');
			divs[i].childNodes[2].style.textShadow = 'unset';
			divs[i].childNodes[5].id = 'specKPD';
			console.log('suspect removed');
		}
	}
}

/*---------------------------------------------------------------------------Extra call info---------------------------------------------------------------------------*/

const callInfoObserver = new MutationObserver(() => {
	gameRegion = getGameRegion();
	if(!kpdJoin) return;
	if(document.getElementById('specKPDTxt').innerHTML.includes('Profile URL')) {
		if(suspect != null && suspectLVL != null && caller != null) {
			if(executive && suspectLVL < 20 || senior && suspectLVL < 15) {
				if(document.getElementById('chatList').outerText.includes(suspect + ' left the game') || document.getElementById('chatList').outerText.includes(suspect + ' was vote kicked')) openURL('/social.html?p=profile&q=' + suspect);
				const text = 'https://krunker.io/social.html?p=profile&q=' + suspect + '\n';
				logProfile(text);
				remSessStorage();
				if(autoOpenMenu) openKPDMenu();
			} else {
				remSessStorage();
				openURL('/social.html?p=profile&q='+suspect);
			}
			if(persistentClipboard) {
				let clipboardInterval = window.setInterval(function() {
					console.log('clipboardInterval ' + oldClipboard)
					if(clipboard.readText() == oldClipboard) {
						return;
					} else {
						console.log('else');
						window.clearInterval(clipboardInterval);
						clipboard.writeText(oldClipboard);
					}
				}, 10);
			}
		}
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Case submitted!') {
		console.log('not cheating');
		remSessStorage();
		if(autoOpenMenu) openKPDMenu();
	}else if(document.getElementById('specKPDTxt').innerHTML == 'Is ' + suspect + ' hacking? Caller: ' + caller) {
		//if(sessionStorage.getItem('suspect') == null) document.getElementById('specKPDTxt').innerHTML = 'Suspect left the game';
	}else if(document.getElementById('specKPDTxt').innerHTML.includes('Is Suspect hacking?') || (document.getElementById('specKPDTxt').innerHTML.includes('Is') && document.getElementById('specKPDTxt').innerHTML.includes('hacking?'))) {
		document.getElementById('specKPDTxt').innerHTML = 'Is ' + suspect + ' hacking? Caller: ' + caller;
		document.getElementById('specKRHid').childNodes[3].innerHTML = gameRegion;
		document.getElementById('specKRHid').childNodes[3].id = 'specKPDRegion';
		document.getElementById('specKRHid').childNodes[3].setAttribute('style', 'width: auto; display: inline-block; color: white; margin-left: 15px;');
	} else if(document.getElementById('specKPDTxt').innerHTML.includes('Are you 100% sure?') && persistentClipboard) {
		oldClipboard = clipboard.readText();
	}
});

function getGameRegion() {
	let region = document.getElementById('menuRegionLabel').innerHTML
	if(region != '...') { //if data is present
		return region;
	}else {
		setTimeout(getGameRegion, 20); //try again
	}	
}

function remSessStorage() {
	suspectObserver.disconnect();
	sessionStorage.removeItem('caller');
	sessionStorage.removeItem('suspect');
	sessionStorage.removeItem('suspectLVL');
	kpdJoin = false;
}

/*---------------------------------------------------------------------------Link Opener---------------------------------------------------------------------------*/

function openProfLink (suspect) {
	window.open('https://krunker.io/social.html?p=profile&q=' + suspect)
}

function remove_non_ascii(str) {
  
	if ((str===null) || (str===''))
		 return false;
   else
	 str = str.toString();
	
	return str.replace(/[^\x20-\x7E]/g, '');
}

function openLink () {
	let clipContent = remove_non_ascii(clipboard.readText());
	let profLink = document.getElementById("linkInput").value;
	if(clipContent.includes('https://krunker.io/social.html?p=profile&q=') && profLink.length == 0) openProfLink(clipContent.slice(43));
	else {
		if (profLink != '') {
		  if(profLink.length > 43) openProfLink(profLink.slice(43));
		  else openProfLink(profLink);
		}
	}
	document.getElementById("linkInput").value = '';
}

function altOpenLink () {
	let clipContent = remove_non_ascii(clipboard.readText());
	if(clipContent.includes('https://krunker.io/social.html?p=profile&q=')) openProfLink(clipContent.slice(43));
	else {
		if (clipContent != '') {
		  if(clipContent.length > 43) openProfLink(clipContent.slice(43));
		  else openProfLink(clipContent);
		}
	}
}

/*---------------------------------------------------------------------------Open KPD---------------------------------------------------------------------------*/

function openKPDMenu() {
	if(document.activeElement.tagName === 'INPUT') return;
	document.exitPointerLock();
	showWindow(1);
	showWindow(1);
	setTimeout( function() { shoPolicePop(); }, 200);
}

/*---------------------------------------------------------------------------Suspect Focus---------------------------------------------------------------------------*/

function toggleFocus() {
	if(document.activeElement.tagName === 'INPUT') return;
	if(localStorage.getItem('suspectFocus') == null) {
		localStorage.setItem('suspectFocus', 'on');
		genChatMsg('Suspect focus is on');
        console.log('on');
        focusState = false;
	} else {
		localStorage.removeItem('suspectFocus');
		suspectObserver.disconnect();
		genChatMsg('Suspect focus is off');
        console.log('off');
        focusState = true;
	}
}

/*---------------------------------------------------------------------------Hide Nametag Hotkey---------------------------------------------------------------------------*/

function toggleXray() {
	if(document.activeElement.tagName === 'INPUT') return;
	let xrayState = localStorage.getItem('kro_setngss_hideNames');
	if(xrayState == 3) {
		setSetting('hideNames', 0);
		genChatMsg('X-Ray is on');
        console.log('on');
        xrayState = false
	} else if(xrayState == 0){
		setSetting('hideNames', 3);
		genChatMsg('X-Ray is off');
        console.log('off');
        xrayState = true;
	}
}

/*---------------------------------------------------------------------------Case Resolved Detector---------------------------------------------------------------------------*/

const caseObserver = new MutationObserver(() => {	
	if(document.getElementById('instructionsUpdate').outerHTML.includes('Case already Resolved')) {
		window.location.href = "https://krunker.io/";
	}
});

/*---------------------------------------------------------------------------Counter Hider---------------------------------------------------------------------------*/

const counterObserver = new MutationObserver((mutationList) => {
	console.log('counter observer');
	mutationList.forEach(function(mutation) {
		if(mutation.oldValue == 'display: none;') {
			document.getElementById('topRight').childNodes[4].style.display = 'none';
		} else {
			document.getElementById('topRight').childNodes[4].style.display = 'block';
		}
	});
});

/*---------------------------------------------------------------------------Modules---------------------------------------------------------------------------*/

module.exports = {
    name: 'KPD Scripts',
    version: '1.0.0',
    author: 'Ando',
    description: 'Collection of QOL Changes for KPD Officers',
    locations: ['game'],
    settings: {
		seniorSet: {
			name: 'Senior Officer',
			id: 'senior',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                senior = value;
            }
		},
		executiveSet: {
			name: 'Executive Officer',
			id: 'executive',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                executive = value;
				if(executive) {
					senior = false;
					minLevelCap = 20;
				} else {
					minLevelCap = 15;
				}
            }
		},
        kpdMenuQOL: {
			name: 'KPD Menu Features',
			id: 'kpdMenuQOL',
			cat: 'KPD',
			type: 'checkbox',
			val: true,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
                if (value){
                    return kpdObserver.observe(policePopC, { childList: true });
                }
                kpdObserver.disconnect();
            }
        },
        specQOL: {
            name: 'Spectate Features',
            id: 'specQOL',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
				if (value){
					console.log('specQOL started');
					specObserver.observe(specTeam0, { childList: true });
					specObserver.observe(specTeam1, { childList: true });
					return;
				}
				specObserver.disconnect();
            }
        },
		altButtons: {
            name: 'Alt Menu Buttons',   
            id: 'altButtons',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                if (value){
					menuObserver.observe(menuWindow, { childList: true });
					return;
                }
				menuObserver.disconnect();
            }
        },
        extraCallInfo: {
            name: 'Show Additional Call Info',
            id: 'extraCallInfo',
            cat: 'KPD',
            type: 'checkbox',
			val: true,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                if (value){
                    return callInfoObserver.observe(specKPDTxt, { childList: true });
                }
                callInfoObserver.disconnect();
            }
        },
		linkOpener: {
			name: 'Show Open Link Button',
			id: 'linkOpener',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
				let linkOpener = document.getElementById('linkOpener')
				let linkInput = document.getElementById('linkInput')
				if (linkOpener) { 
					linkOpener.style.display = value ? '' : 'none' 
					linkInput.style.display = value ? '' : 'none' 
				}
			}
		},
		alternativeLinkOpener: {
			name: 'Alternative Open Link',
			id: 'alternativeLinkOpener',
			cat: 'KPD',
			type: 'checkbox',
			val: true,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
				if(value) {
					document.getElementById('policeButton').oncontextmenu = () => { altOpenLink(); };
				} else {
					document.getElementById('policeButton').oncontextmenu = () => { return false; };
				}
			}
		},
		detailedLog: {
			name: 'Generate Detailed Logfile',
			id: 'detailedLog',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                detailedLog = value;
            }
		},
		autoOpenMenu: {
			name: 'Open KPD Menu after Call',
			id: 'autoOpenMenu',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                autoOpenMenu = value;
            }
		},
		persistentClipboard: {
			name: 'Persistent Clipboard',
			id: 'persistentClipboard',
			cat: 'KPD',
			type: 'checkbox',
			val: false,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                persistentClipboard = value;
            }
		},
		caseResolvedRefresh: {
			name: 'Refresh when Case Resolved',
			id: 'caseResolvedRefresh',
			cat: 'KPD',
			type: 'checkbox',
			val: true,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                if(value) {
					return caseObserver.observe(instructionsUpdate, { childList: true });
				}
				caseObserver.disconnect();
            }
		},
		counterHider: {
			name: 'Don\'t show Counters in spec',
			id: 'counterHider',
			cat: 'KPD',
			type: 'checkbox',
			val: true,
            html: function() { return clientUtil.genCSettingsHTML(this) },
            set: value => {
                if(value) {
					return counterObserver.observe(spectateUI, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
				}
				counterObserver.disconnect();
            }
		},
        suspectFocus: {
            name: 'Suspect Focus Toggle',
            id: 'suspectFocus',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = F1',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value === '') {
					document.addEventListener('keydown', (e) => ((e.key === 'F1' ) && (toggleFocus())));
				} else {
					document.addEventListener('keydown', (e) => ((e.key === value || e.key === value.toLowerCase()) && (toggleFocus())));
				}
			}
        },
		xrayToggle: {
            name: 'X-Ray Toggle',
            id: 'xrayToggle',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = F2',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value === '') {
					document.addEventListener('keydown', (e) => ((e.key === 'F2' ) && (toggleXray())));
				} else {
					document.addEventListener('keydown', (e) => ((e.key === value || e.key === value.toLowerCase()) && (toggleXray())));
				}
			}
        },
		openKPD: {
			name: 'KPD Menu Hotkey',
			id: 'openKPD',
			cat: 'KPD',
			type: 'text',
            val: '',
            placeholder: 'Empty = F3',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value === '') {
					document.addEventListener('keydown', (e) => ((e.key === 'F3' ) && (openKPDMenu())));
				} else {
					document.addEventListener('keydown', (e) => ((e.key === value || e.key === value.toLowerCase()) && (openKPDMenu())));
				}
			}
		},
		lvlHighlight: {
            name: 'Highlighting Minimum Level',
            id: 'lvlHighlight',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = 75',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value !== '') {
					minLVL = parseInt(value);
				}
			}
        },
		colorHighlight: {
            name: 'Highlighting Color',
            id: 'colorHighlight',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = Green',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value !== '' && /^#[A-F0-9]+$/.test(value)) {
					highlightColor = value;
				}
			}
        },
		antiColorHighlight: {
            name: 'Anti Highlighting Color',
            id: 'antiColorHighlight',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = Red',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value !== '' && /^#[A-F0-9]+$/.test(value)) {
					antiHighlightColor = value;
				}
			}
        },
		webhookLink: {
            name: 'Webhook Link',
            id: 'webhookLink',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = Off',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value !== '') {
					sessionStorage.setItem('webhookLink', value);
				} else {
					if(sessionStorage.getItem('webhookLink') != null) sessionStorage.removeItem('webhookLink');
				}
			}
        },
		webhookPfp: {
            name: 'Webhook Profile Picture',
            id: 'webhookPfp',
            cat: 'KPD',
            type: 'text',
            val: '',
            placeholder: 'Empty = KPD Logo',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
			set: value => {
				if (value !== '') {
					sessionStorage.setItem('webhookPfp', value);
				} else {
					sessionStorage.setItem('webhookPfp', 'https://cdn.discordapp.com/attachments/777223017004662804/823959430998655106/a942b33ff309c9c1b98ea18581b9d470.png')
				}
			}
        }
	},
	run: () => {
		window.addEventListener('DOMContentLoaded', (event) => {
			if(sessionStorage.getItem('kpdJoin') == 'true') {
				kpdJoin = true;
				suspect = sessionStorage.getItem('suspect');
				suspectLVL = sessionStorage.getItem('suspectLVL');
				caller = sessionStorage.getItem('caller');
				sessionStorage.removeItem('kpdJoin');
				let clickEvent = document.createEvent('MouseEvents');
				clickEvent.initEvent ('mousedown', true, true);
				let kpdSpawn = window.setInterval(function() {
					console.log('kpdJoinInterval')
					if(document.getElementById('uiBase').className == '') {
						return;
					} else if(document.getElementById('uiBase').className == 'onMenu'){
						document.getElementsByTagName('canvas')[4].dispatchEvent(clickEvent);
					} else {
						window.clearInterval(kpdSpawn);
						if(suspectLVL < 20) {
							for(let i = 0; i < 8; i++) {
								setTimeout(function() { genChatMsg(7-i) }, i*1080);
							}
						}
					}
				}, 100);
			} else {
				suspect = null;
				suspectLVL = null;
				caller = null;
				remSessStorage();
			}
			if(localStorage.getItem('username') == null) {
				let timer = window.setInterval(function() {
					if (document.getElementById('menuAccountUsername').innerHTML != '?') {
						window.clearInterval(timer);
						showWindow(5);
						showWindow(0);
						localStorage.setItem('username', document.getElementsByClassName('settName')[0].innerText.slice(4));
					}
				}, 100);
			}
			console.log(localStorage.getItem('username'));
			suspectID = null;
			gameRegion = getGameRegion();
			console.log(caller);
			console.log(suspect);
			console.log(kpdJoin);
			applyCSS();
			let div = document.createElement('div');
			div.id = 'linkOpener';
			div.innerHTML = 'Open Link';
			div.className = 'button';
			div.onmouseover = function() { playTick(); }
			div.onclick = function() { openLink(); }
			let input = document.createElement('input');
			input.id = 'linkInput';
			input.placeholder = 'Link';
			input.className = 'formInput';
			let divElem = document.getElementById('menuClassContainer').appendChild(div);
			let inputElem = document.getElementById('menuClassContainer').appendChild(input);
			divElem.oncontextmenu = function() { inputElem.value = clipboard.readText(); openLink(); };
			inputElem.oncontextmenu = function() { inputElem.value = clipboard.readText(); };
		});
	}
}
