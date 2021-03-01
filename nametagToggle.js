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
	chatMsg.innerHTML = 'Nametags are ' + state;
	chatItem.appendChild(chatMsg);
	messageHolder.appendChild(chatItem);
	applyCSS();
	document.getElementById('chatList').appendChild(messageHolder).scrollIntoView({ behavior: "smooth", block: "end" }); //add to chat, scroll all the way down
	console.log('generated message');
}

function toggleNames() { //turn name tag setting on or off, first execution turns them on
	if(isEven(i)) {
		setSetting("hideNames", 0);
		genChatMsg('on');
		console.log('on');
	} else {
		setSetting("hideNames", 3);
		genChatMsg('off');
		console.log('off');
	}
	i++;
}



module.exports = {
    name: "nametag hider",
    version: "1.0.0",
    author: "Ando",
    description: "hides nametags by pressing a hotkey",
    locations: ["game"],
    settings: {
        nametagHider: {
            name: "Nametag Hider",
            id: "nametagHider",
            cat: "Game",
            type: 'text',
            val: '',
            placeholder: 'F2',
            html: function(){ return clientUtil.genCSettingsHTML(this); },
        },		
    },
	run: config => {
		let hotkey = config.get("nametagHider", true)
		if (hotkey !== "") {
			document.addEventListener("keydown", (e) => ((e.key === hotkey) && (toggleNames()))); //adds input detecting listener to document
		}
	}
};