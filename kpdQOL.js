let activeTab;

const minLVL = 75; //configure to your liking
const highlightColor = 'red'; //configure to your liking

function highlight() { //highlights calls
	if(document.getElementsByClassName('kpdRepLvl').length != 0) { //if data is present
		console.log('highlighting');
		let lvl = document.getElementsByClassName('kpdRepLvl');
		for(let i = 0; i < lvl.length; i++){
			if(lvl[i].innerHTML.includes('/')) continue; //if current div is not a level, skip
			if(lvl[i].innerHTML < minLVL) continue; //if current div is a level but below configured minimum, skip
			lvl[i].style.color = highlightColor; //highlight the number
		}
	}else {
		setTimeout(highlight, 20); //try again
	}	
}

function joinKPD(joinFunc, caller, suspect) { //stores data so its not lost upon join
	console.log(joinFunc);
	console.log(caller);
	console.log(suspect);
	sessionStorage.setItem('caller', caller);
	sessionStorage.setItem('suspect', suspect);
	sessionStorage.setItem('initSpec', 'true');
	const f = new Function(joinFunc); //hook original join
	f(); //join game
}

function genRegion(attrib) { //generate region
	let span = document.createElement('span');
	span.className = 'callRegion';
	span.innerHTML = attrib;
	console.log('generated region');
	return span;
}


function addRegion(joinButton) { //find region name and add it
	if(joinButton.parentElement.childNodes[1].className != 'classRegion') {
		let region = joinButton.getAttribute('onclick').slice(12).split(':')[0];
		let regionSpan = genRegion(region);
		joinButton.parentElement.insertBefore(regionSpan, joinButton.parentElement.childNodes[1]);
		console.log('insert region');
	}
}


function joinButtonHook() { //overwrites onclick to fetch data before joining
	if(document.getElementsByClassName('policeJoinB').length != 0) {
		console.log('hooking join button');
		let jBtns = document.getElementsByClassName('policeJoinB');
		for(let i = 0; i < jBtns.length; i++){
			if(jBtns[i].parentElement.childNodes[1].className != 'callRegion') addRegion(jBtns[i]); //add region
			jBtns[i].onclick = function() { joinKPD(jBtns[i].getAttribute('onclick'), jBtns[i].parentElement.parentElement.childNodes[2].innerHTML, jBtns[i].parentElement.parentElement.childNodes[5].innerHTML) };
		}
	}else {
		setTimeout(joinButtonHook, 20);
	}	
}


function searchCalls() { //might break when no data is present, cant test it
	console.log('searching');
    let inputVal = document.getElementById('kpdSearch').value //gets input valie
    let divs = document.getElementById('kpdCalls').childNodes; //gets data
      
    for (i = 0; i < divs.length; i++) { 
		if(activeTab == 1) { //procedure if user searches calls
			let caller = divs[i].childNodes[2].innerHTML;
			let suspect = divs[i].childNodes[5].innerHTML;
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
				divs[i].style.display="none"; // removes items that dont match    
			} 
		}
		if(activeTab == 2) { //procedure if user searches logs
			let tagger = divs[i].outerHTML.split('=')[5].split('>')[0];
			let hacker = divs[i].outerHTML.split('=')[10].split('>')[0];
			if (tagger.includes(inputVal) || hacker.includes(inputVal)) { 
				divs[i].style.display="block";			
			} 
			else { 
				divs[i].style.display="none"; // removes items that dont match  
			} 
		}
    } 
} 

function applyCSS() { //styles the input bar, configure to your liking
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
						}`
	}))
}

function genSearchBar() {
	let input = document.createElement('input');
	input.id = 'kpdSearch';
	input.placeholder = 'Search Name';
	input.onkeyup = function() { searchCalls(); }
	console.log('generated searchbar');
	return input;
}

function addSearchBar(searchBar) { //adds input to the window
	if(document.getElementById('policePopC').childNodes.length != 0) { //if loaded
		applyCSS();
		document.getElementById('policePopC').insertBefore(searchBar, document.getElementById('policePopC').childNodes[3]); //insert at right position
		console.log('insert');
	} else {
		setTimeout(function() { addSearchBar(searchBar) }, 20); //try again if not loaded
	}
}

function determineActiveTab(kpdHolder) { //returns 1 or 2 based on which tab the user is on
	console.log('determineActiveTab');
	if(kpdHolder.children[2].children[0].className == 'menuTabNew tabANew') return 1; 
	else if(kpdHolder.children[2].children[1].className == 'menuTabNew tabANew') return 2;
	return 0;
}

const kpdObserver = new MutationObserver(() => {
	console.log('mutation observed');
    let kpdHolder = document.getElementById('policePopC');
	activeTab = determineActiveTab(kpdHolder); //finds current tab
	console.log('tab: ' + activeTab);
	if (activeTab != 0 && document.getElementById('kpdCalls').length != 0) { //checks if data exists
		if(activeTab == 1) { //if user is on call tab
			console.log('highlight');
			highlight(); //highlights players based on preference
			joinButtonHook(); //hook to join button to prepare data for suspectDisplay
			if(!document.getElementById('kpdSearch')) { //if searchbar doesnt exist, create it
				let node = genSearchBar(activeTab);
				addSearchBar(node); 
			}
		}
		else { //if user is on ban log tab
			if(!document.getElementById('kpdSearch')) {//if searchbar doesnt exist, create it
				let node = genSearchBar(activeTab);
				addSearchBar(node);
			}
		}
	}
});


module.exports = {
	name: 'kpdMenuQOL',
	version: '1.0.0',
	author: 'Ando',
	description: 'Adds a highlighter to call list and a searchbar to Ban Logs',
	locations: ['game'],
	settings: {
		kpdMenuQOL: {
			name: 'KPD QOL',
			id: 'kpdMenuQOL',
			cat: 'KPD Window',
			type: 'checkbox',
			val: true,
			html: function () { return window.clientUtil.genCSettingsHTML(this) },
			set: value => {
                if (value){
                    return kpdObserver.observe(policePopC, { childList: true }); //observes the kpd window
                }
                kpdObserver.disconnect()
            }
        }
    }
}