//https://cssgrid-generator.netlify.app/

let participantCounter;
let participantID;

let call_type= "none";                                  		// API only user
let node ="au.pexipdemo.com";									// Pexip Conference node(s)
let bandwidth = 1048;                                 			// Not Used! Bandwidth only if escalated api -> video call
let conference = "pextv.lobby@pexipdemo.com";         			// Pexip meeting 
let pin = "11111";												// Chairperson (Host) PIN
let alias = "api_user";                       					// Name of API user
let call_tag = "";												// Optional Call_tag information (applied by WebRTC user)
let logo;
let weblink;

let defaultLogo = "assets/media/logo_200x200.png";
let defaultWebLink = "https://au.pexipdemo.com/webapp/m/pextv.lobby@pexipdemo.com";

let currentRoster;
let actors;
let stageActors;
let layoutActors;

//Get user settings
getSettings();

let table = document.getElementById("table");

let tableContainerDiv = document.getElementById("tableContainerDiv");

let connectionButton = document.getElementById("connectSwitch");

let lockConference = document.getElementById('lockList');

let layoutList = document.getElementById('layoutList');
let indicatorsList = document.getElementById('indicatorsList');
let participantFeatureList = document.getElementById('participantFeatureList');

let disconnectButton = document.getElementById('disconnectButton');;
let admitButton = document.getElementById('admitButton');

let muteAudioButton = document.getElementById('muteAudioButton');
let unmuteAudioButton = document.getElementById('unmuteAudioButton');

let muteVideoButton = document.getElementById('muteVideoButton');
let unmuteVideoButton = document.getElementById('unmuteVideoButton');

let muteAllGuestsAudioButton = document.getElementById('muteAllGuestsAudioButton');
let unmuteAllGuestsAudioButton = document.getElementById('unmuteAllGuestsAudioButton');

let lowerHandButton = document.getElementById('lowerHandButton');
let addToStageButton =  document.getElementById('addToStageButton');

let applyConferenceButton = document.getElementById('applyConferenceButton');
let applyParticipantButton = document.getElementById('applyParticipantButton');

let weblinkLauncher = document.getElementById("weblinkLauncher");
weblinkLauncher.href = localStorage.getItem("weblink") || defaultWebLink;
weblinkLauncher.innerHTML = localStorage.getItem("conference") || conference;

let logoImage = document.getElementById("logoImage");
logoImage.src = localStorage.getItem("logo") ||  defaultLogo;

let participantName = document.getElementById("participantName");
let overlayNameInput = document.getElementById("overlayNameInput");
let dialOutInput = document.getElementById("dialOutInput");
let transferInput = document.getElementById("transferInput");
let dtmfInput = document.getElementById("dtmfInput");



// Instantiate PexRTC
var pexRTC = new PexRTC();

applyConferenceButton.addEventListener('click', () => {
	let selector = conferenceFeatureList.value;
	let dialOutString = dialOutInput.value || "";

	console.log("Apply Conference button clicked (selector):", selector);
	if (selector==="startConference") {pexRTC.startConference();}
	else if (selector==="endConference") {pexRTC.disconnectAll();}
	else if (selector==="dialOutAuto") {pexRTC.dialOut(dialOutString, "auto", "host");}
	else if (selector==="dialOutSip") {pexRTC.dialOut(dialOutString, "sip", "guest");}
})



applyParticipantButton.addEventListener('click', () => {
	let selector = participantFeatureList.value;
	let overlayString = overlayNameInput.value || "";
	let transferString = transferInput.value || "";
	let dtmfString = dtmfInput.value + "#"|| "";

	console.log("Apply Participant button clicked (selector):", selector);
    if (selector==="addSpotlight") {pexRTC.setParticipantSpotlight(participantID, true);}
	else if (selector==="removeSpotlight") {pexRTC.setParticipantSpotlight(participantID, false);}
	else if (selector==="removeAllSpotlights") {removeAllSpotlights();}
	else if (selector==="overlay") {pexRTC.setParticipantText(participantID, overlayString);}
	else if (selector==="transfer") {pexRTC.transferParticipant(participantID, transferString);}
	else if (selector==="dtmf") {pexRTC.sendDTMF(dtmfString, participantID);}
	else if (selector==="addHost") {pexRTC.setRole(participantID, "chair");}
	else if (selector==="removeHost") {pexRTC.setRole(participantID, "guest");}
});


connectionButton.addEventListener('change', (event) => {
	if (event.currentTarget.checked) {
	console.log('Connecting...');


	pexRTC.call_tag = call_tag;
    pexRTC.fecc_supported = true;   //Needs Video
	
	pexRTC.makeCall(node, conference, alias, bandwidth, call_type);
  
	} else {
	console.log('Disconnecting...');
	disconnect();
	
	  
	}
  })


  // Run when the page loads
window.addEventListener('load', function (e) {
	// Link the callSetup method to the onSetup callback
	pexRTC.onSetup = callSetup;
	// Link the callConnected method to the onConnect callback
	pexRTC.onConnect = callConnected;
	// Link the callDisconnected method to the onError callback
	pexRTC.onError = callDisconnected;
	// Link the callDisconnected method to the onDisconnect callback
	pexRTC.onDisconnect = callDisconnected;
	// Link the callDisconnected method to the onError callback
	pexRTC.onError = callError;
	// Link the Roster List callback
	pexRTC.onRosterList = rosterList;
	// Link the Conference Update callback
	pexRTC.onConferenceUpdate = conferenceUpdate;
	// Link the Layout Update callback
	pexRTC.onLayoutUpdate = layoutUpdate;
	// Link the Stage Update callback
	pexRTC.onStageUpdate = stageUpdate;

	// Link the onFECC
	//pexRTC.onFECC = callFECC;

	//Link to Application message
	//pexRTC.onApplicationMessage = applicationMessage;

	//Link to Direct message
	//pexRTC.onApplicationMessage = directMessage;
 });
 
 window.addEventListener('beforeunload', function (e) {
   pexRTC.disconnect();
 
 });


// This method is called when the call is setting up
function callSetup(stream, pinStatus) {
 
	// If no pin is required, connect to the call with no pin
	if (pinStatus === 'none') {
	  // Connect to the call without a pin
	  pexRTC.connect();
  
	} else {
	  // The pin is optional
	  if (pinStatus === 'optional') {
		// Set the title of the pin entry to reflect its requirement
		console.log("PIN is optional:", "using PIN");
		pexRTC.connect(pin);
	 
	  } else {
		// Set the title of the pin entry to reflect its requirement
		console.log("PIN is required:", "using PIN");
		pexRTC.connect(pin);
	  }
	  // Show the pin popup
	}
  }
  
// This method hangs up the call
function disconnect() {
	console.log ("Ending the call...");
	pexRTC.disconnect();
	tableContainerDiv.hidden = true;
	connectionButton.checked = false;
	
	controlPanel.hidden = true;
	controlIndicators.hidden = true;
	notifyMe("You have left the conference");
  }
  
  
// When the call is connected
function callConnected(stream) {
	// Clear the pin, if we don't do this it will be cached for the next call
	pexRTC.pin = null;
	pexRTC.unlockParticipant(pexRTC.uuid)
	
	tableContainerDiv.hidden = false;
	controlPanel.hidden = false;
	controlIndicators.hidden = false;
  }
  
function callDisconnected(reason) {  
	console.log("callDisconnected:", reason);
	tableContainerDiv.hidden = true;
	controlPanel.hidden = true;
	controlIndicators.hidden =true;
	connectionButton.checked = false;
	notifyMe(reason);
	
  }
  
function callError(reason) {
	console.log("callError:", reason);
	tableContainerDiv.hidden = true;
	controlPanel.hidden = true
	connectionButton.checked = false;
	controlIndicators.hidden = false;
	
  }

function conferenceUpdate(properties) {
	console.log ("🍏 Conference Update:", properties);
	//console.log("Locked state:", properties.locked);
	if (properties.locked === true ) 
	{
		lockConference.selectedIndex = 1;
		lockConference.style.background = "orangered";
	} else {
		lockConference.selectedIndex = 0;
		lockConference.style.background = "";
	}
	}

	function stageUpdate(stage) {
		console.log("🍏 Stage Update:", stage);
		stageActors = stage;
	}

function layoutUpdate (properties) {
	console.log("🍏 Layout Update:", properties);
	layoutActors = properties;
	let currentLayout = properties.requested_layout.primary_screen.guest_layout;
	
	var text = currentLayout;
	if (text==="5:7") {text="ac";}
	
	const options = Array.from(layoutList.options);
	const optionToSelect = options.find(item => item.text === text);
	optionToSelect.selected = true;  
}

//Participant Functions
disconnectButton.onclick = function() { 
    console.log("Disconnect participant button clicked:", participantID);
    pexRTC.disconnectParticipant(participantID);
};

admitButton.onclick = function() { 
   console.log("Admit participant button clicked", participantID);
    pexRTC.unlockParticipant(participantID);
};

muteAudioButton.onclick = function() { 
	console.log("🎙️ Mute audio button clicked:", participantID);
	 pexRTC.setParticipantMute(participantID, true);
 };

 unmuteAudioButton.onclick = function() { 
	console.log("🎙️ Unmute audio button clicked:", participantID);
	 pexRTC.setParticipantMute(participantID, false);
 };

 muteVideoButton.onclick = function() { 
	console.log("📹 Mute video button clicked:", participantID);
	 pexRTC.videoMuted(participantID);
 };

 unmuteVideoButton.onclick = function() { 
	console.log("📹 Unmute video button clicked:", participantID);
	 pexRTC.videoUnmuted(participantID);
 };

 muteAllGuestsAudioButton.onclick = function() { 
	console.log("🎙️ Mute All Guests button clicked:");
	 pexRTC.setMuteAllGuests(true);
 };

 unmuteAllGuestsAudioButton.onclick = function() { 
	console.log("🎙️ Unmute All Guests button clicked:");
	 pexRTC.setMuteAllGuests(false);
 };

 lowerHandButton.onclick = function() { 
	console.log("✋ Lower hand button clicked:", participantID);
	 pexRTC.clearBuzz(participantID);
 };

function callFECC(signal) {
  console.log("callFECC signal", signal);
}

function applicationMessage(message) {
console.log ("Conference message: ", message)
};

function directMessage(message) {
  console.log ("Direct message: ", message)
  };

//On Roster List (Full list)
function rosterList(roster) {
	rosterList = roster;
	console.log ("🍏 Roster Update:", roster);	

	currentRoster = roster;

	var apiCounter = 0;
	var hostCounter = 0;
	var guestCounter = 0;
	var unknownCounter = 0;
	var inLobbyCounter = 0;

	let placeholder = document.querySelector("#data-output");
	let out = "";
	
	 for(let item of roster){
	var roomAlias;
	var encryptionStatus;
	var is_audio_call;
	var is_video_call;
	var is_fecc_supported;
	var participantRole;
	var participantProtocol;
	var participantUrgent;
	var participantHold;
	var participantNotes;
	var participantServiceType;
	var participantSpotlight;
	var participantBuzz;
	var participantAlias;
	var participantName;
	var participantPresenting;
	var participantCallDirection;
	
  
  if (item.encryption === "On") {
	encryptionStatus = '<i class="fa-solid fa-shield-halved"></i>';
  } else{
	encryptionStatus = '';
  }
  
  if (item.is_video_call === "YES") {
	if (item.is_video_muted === false) {
	  is_video_call = '<i class="fa-solid fa-video"></i>';
	} else {
	  is_video_call = '<i class="fa-solid fa-video-slash"></i>';
	}
	
  } else {
	is_video_call = '';
  }
  
  if (item.has_media === true && item.is_muted === "NO"  ) {
	is_audio_call = '<i class="fa-solid fa-microphone"></i>';
  } else if (item.has_media === true && item.is_muted === "YES"  ) {
	is_audio_call = '<i class="fa-solid fa-microphone-slash redIcon"></i>';
  } else {
	is_audio_call = '';
  }
  
  if (item.fecc_supported === "NO") {
	is_fecc_supported = '';
  } else {
	is_fecc_supported = '<i class="fa-solid fa-up-down-left-right"></i>';
  }
  
  if (item.role === "chair" && item.protocol !== "api") {
	participantRole = '<i class="fa-solid fa-user-tie"></i>';
	hostCounter++;
   } else if (item.role === "chair" && item.protocol === "api") {
	participantRole = '<i class="fa-solid fa-code"></i>';
  }  else if (item.role === "unknown") {
	participantRole = '<i class="fa-solid fa-question redIcon"></i>';
	unknownCounter++;
	//notifyMe("Conference participants are waiting in lobby");
  }
   else {
	participantRole = '';
	guestCounter++;
  }
  
  if (item.service_type  === "waiting_room" || item.service_type  === "ivr") {
	participantServiceType = '<p class="redIcon" style="background-color:yellow;">Waiting in Lobby</p>';
	inLobbyCounter++;
  } else {
	participantServiceType = '<p style="background-color:greenyellow;">In Conference</p>';
  }

  if (item.call_direction === "in") {
	participantCallDirection = '<i class="fa-solid fa-arrow-right greyIcon"></i>';
} else { 
	participantCallDirection = '<i class="fa-solid fa-arrow-left redIcon"></i>';
  }
  
  if (item.protocol === "api") {
	participantProtocol = '<i class="fa-solid fa-code"></i>';
	apiCounter++;
  } else if (item.protocol === "webrtc") {
	participantProtocol = '<i class="fa-brands fa-chrome"></i>';
  } else if (item.protocol === "sip") {
	participantProtocol = '<i class="fa-solid fa-tv"></i>';
  } else {
	participantProtocol = '';
  }
  
  if  (item.overlay_text.includes('"urgent\":true') === true) {
	participantUrgent='<i class="fa-solid fa-circle-exclamation"></i>';
   } else {
	participantUrgent='';
  }
  
  if  (item.local_alias.includes("pextv.lobby.hold@pexipdemo.com") === true) {
	participantHold='<i class="fa-solid fa-circle-pause"></i>';
   } else {
	participantHold='';
  }
  
  if (item.spotlight  === 0) {
	participantSpotlight = ' ';
  } else {
	participantSpotlight = '<i class="fa-solid fa-crosshairs"></i>';
  }
  
  if (item.display_name  === "") {
	participantName = item.uri.replace("sip:","");
  } else {
	participantName = item.display_name.replace("sip:","");
  }
  
  if (item.buzz_time  === 0) {
	participantBuzz = ' ';
  } else {
	participantBuzz = '<i class="fa-regular fa-hand"></i>';
  }

  if (item.is_presenting === "YES") {
	participantPresenting='<i class="fa-solid fa-chart-line"></i>';
  } else {
	participantPresenting=' ';
  }
  
  if (item.local_alias.includes('@pexipdemo.com') === true) {
	participantAlias = item.local_alias.replace("@pexipdemo.com","");
  } else {
	participantAlias = item.local_alias.replace("sip:","");
  }
  
  try {
  participantNotes= item.overlay_text;
  
  } catch (error) {
	participantNotes='';
  }

  	var x = document.createElement("INPUT");
	x.setAttribute("type", "checkbox");
  
		out += `
		   <tr>
		  	  <td hidden id="pid">${item.uuid}</td>
			  <td id="pName">${participantName}</td>
			  <td class="td-truncate">${item.overlay_text}</td>
			  <td hidden>${participantAlias}</td>
			  <td class="center">${participantCallDirection}</td>
			  <td>${participantServiceType}</td>
			  <td>${new Date(item.start_time * 1000).toLocaleTimeString()}</td>
			  <td hidden >${item.room_id}</td>
			  <td class="greyIcon center">${participantRole}</td>
			  <td class="greyIcon center">${participantProtocol}</td>
			  <td class="greyIcon center">${encryptionStatus}</td>
			  <td class="greyIcon center">${is_audio_call}</td>
			  <td class="greyIcon center">${is_video_call}</td>
			  <td class="greyIcon center">${is_fecc_supported}</td>
			  <td class="redIcon center">${participantSpotlight}</td>
			  <td class="redIcon center">${participantBuzz}</td>
			  <td class="redIcon center">${participantPresenting}</td>
			  <td hidden class="greyIcon center">${item.spotlight}</td>
		   </tr>
		`;
	 }
   
	 placeholder.innerHTML = out;

	 document.getElementById("apiCounter").innerText = apiCounter;
	 document.getElementById("guestCounter").innerText = guestCounter;
	 
	 if (hostCounter > 0 ) { 
		document.getElementById("hostCounter").innerText = hostCounter;
		document.getElementById("hostCounter").classList.remove("redIcon");
		document.getElementById("hostIndicatorIcon").classList.remove("redIcon");
	 } else {
		document.getElementById("hostCounter").innerText = "No Hosts in Meeting";
		document.getElementById("hostCounter").classList.add("redIcon");
		document.getElementById("hostIndicatorIcon").classList.add("redIcon");
		
	 }

	 if (inLobbyCounter > 0 ) {
		lobbyIndicatorIcon.classList.add("redIcon");
		lobbyCounter.classList.add("redIcon");
		document.getElementById("lobbyCounter").innerText = inLobbyCounter + " (Waiting In Lobby)";
	} else {
		lobbyIndicatorIcon.classList.remove("redIcon");
		lobbyCounter.classList.remove("redIcon");
		document.getElementById("lobbyCounter").innerText = inLobbyCounter;
	}

}


//Sort table columns (string data type)
table.onclick = function(e) {
	if (e.target.tagName != 'TH') return;
	let th = e.target;
	sortGrid(th.cellIndex, th.dataset.type);
	//console.log("Table sort:");
  };


// Make row selectable
var tbody = table.getElementsByTagName("tbody")[0];
var tbodyRows = table.getElementsByTagName("tr");

  tbody.onclick = function (e) {
      e = e || window.event;
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }    

    Array.from(tbodyRows).forEach(elem => {
        elem.classList.remove('active')
    })
    target.classList.add('active');
    participantID= target.cells[0].innerHTML;
	participantAlias = target.cells[1].innerHTML
    console.log("name:", participantAlias);
    console.log("participantId:", participantID);
    participantName.value = participantAlias;
	participantName.title = "uuid:" +participantID;
    // document.getElementById("pUUID").value = target.cells[0].innerHTML;  
}


document.addEventListener('change', function (event) {
	//console.log("Selection:", event.target.id);
	// Only run on our selected menus

	if (event.target.id === 'lockList') {
		console.log("🔒 Conference Lock:", event.target.value);
		if (event.target.value === "true"){
			pexRTC.setConferenceLock(true);
		} else {
			pexRTC.setConferenceLock(false);
		}
	}
	
	if (event.target.id === 'layoutList' || event.target.id === 'indicatorsList') {
		console.log("🎪 Conference Transform:", event.target.value);
  		var obj = JSON.parse(event.target.value);
  		pexRTC.transformLayout(obj);
	}

	if (event.target.id === 'participantFeatureList') {
		console.log("Participant Feature List:", event.target.value);
//
	}

	

});


