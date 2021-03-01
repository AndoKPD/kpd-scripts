let i = 0;

function isEven(n) { //checks if number is even
   return n % 2 == 0;
}

function applyCSS() { //style to your liking
	document.head.appendChild(Object.assign(document.createElement('style'), {
			innerText: `#chatItem_toggle {
							background-color: rgba(0, 0, 0, 0.4);
						}
						#chatMsg_toggle {
							color: #fc03ec;
						}`
	}))
}

function genChatMsg(state) { //generate text message in chat with current status
	let messageHolder = document.createElement('div');
	messageHolder.id = 'chatMsgHolder_toggle';
	let chatItem = document.createElement('div');
	chatItem.id = 'chatItem_toggle';
	chatItem.className = 'chatItem';
	chatItem.style
	let chatMsg = document.createElement('span');
	chatMsg.id = 'chatMsg_toggle';
	chatMsg.className = 'chatMsg';
	chatMsg.innerHTML = 'Suspect focus is ' + state;
	chatItem.appendChild(chatMsg);
	messageHolder.appendChild(chatItem);
	applyCSS();
	document.getElementById('chatList').appendChild(messageHolder).scrollIntoView({ behavior: "smooth", block: "end" }); //add to chat, scroll all the way down
	console.log('generated message');
}

function toggleFocus() { //set preference to interact with other scripts
	if(isEven(i)) {
		sessionStorage.setItem('suspectFocus', 'on');
		genChatMsg('on');
		console.log('on');
	} else {
		sessionStorage.removeItem('suspectFocus');
		if(window.focusInterval != undefined && window.focusInterval != 'undefined'){ //remove interval when turned off
			window.clearInterval(window.focusInterval);
			console.log('focusInterval cleared');
		}	
		genChatMsg('off');
		console.log('off');
	}
	i++;
}



module.exports = {
    name: "Suspect Focus",
    version: "1.0.0",
    author: "Ando",
    description: "automatically focusses the suspect in kpd mode",
    locations: ["game"],
    settings: {
        suspectFocus: {
            name: "Suspect Focus",
            id: "suspectFocus",
            cat: "KPD Spec",
            type: 'text',
            val: '',
            placeholder: 'F1',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
        },		
    },
	run: config => {
		let hotkey = config.get("suspectFocus", true)
		if (hotkey !== "") {
			document.addEventListener("keydown", (e) => ((e.key === hotkey) && (toggleFocus())));
		}
	}
};