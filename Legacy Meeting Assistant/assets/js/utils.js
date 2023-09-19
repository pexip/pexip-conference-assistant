https://www.codehim.com/vanilla-javascript/javascript-drag-and-drop-reorder-list/



function sortGrid(colNum, type) {
	let tbody = table.querySelector('tbody');
	let rowsArray = Array.from(tbody.rows);
	// compare(a, b) compares two rows, need for sorting
	let compare;
	switch (type) {
	  case 'number':
		compare = function(rowA, rowB) {
		  return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
		};
		break;
	  case 'string':
		compare = function(rowA, rowB) {
		  return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
		};
		break;
	}
	rowsArray.sort(compare);
	tbody.append(...rowsArray);
  }


function removeAllSpotlights() {
console.log ("Remove All Spotlights");

Array.from(tbodyRows).forEach(elem => {
	var uuid = elem.cells[0].innerHTML;
	pexRTC.setParticipantSpotlight(uuid, false);
	console.log("Unspotlight User", uuid);
})

}

let openSettings = document.getElementById("openSettings");
let modal = document.getElementById("myModal");

openSettings.addEventListener('click', function() {
    console.log('Open settings...');
    modal.style.display = "block";

	//Open Modal with Settings
	getSettings();

});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
	  modal.style.display = "none";
	}
}

function saveSettings () {
	console.log ("Save settings...");
	localStorage.setItem("system", document.getElementById("nodeSetting").value);
	localStorage.setItem("apiName", document.getElementById("apiNameSetting").value);
	localStorage.setItem("vmr", document.getElementById("vmrSetting").value);
	localStorage.setItem("pin", document.getElementById("pinSetting").value);
	localStorage.setItem("weblink", document.getElementById("weblinkSetting").value);
	localStorage.setItem("logo", document.getElementById("logoSetting").value);
	location.reload();
};


function clearSettings () {
	console.log ("Clear settings...");
	localStorage.clear();
	location.reload();
};


function getSettings () {
//Open Modal with Settings
//console.log ("Get settings...");

node = localStorage.getItem("system");								                          		
conference = localStorage.getItem("vmr");         			
pin = localStorage.getItem("pin");											
alias = localStorage.getItem("apiName");                     														
logo = localStorage.getItem("logo");
webLink = localStorage.getItem("weblink");

document.getElementById("nodeSetting").value = node;
document.getElementById("apiNameSetting").value = alias;
document.getElementById("vmrSetting").value = conference;
document.getElementById("pinSetting").value = pin;
document.getElementById("weblinkSetting").value = webLink;
document.getElementById("logoSetting").value = logo;

node = localStorage.getItem("system");								                          		
conference = localStorage.getItem("vmr");         			
pin = localStorage.getItem("pin");											
alias = localStorage.getItem("apiName") || "api_user";                     														
logo = localStorage.getItem("logo");
webLink = localStorage.getItem("weblink");
};

function exportSettings () {

var obj = new Object(); 
obj.node = document.getElementById("nodeSetting").value;
obj.conference = document.getElementById("vmrSetting").value;
obj.pin = document.getElementById("pinSetting").value;
obj.alias = document.getElementById("apiNameSetting").value;
obj.logo = document.getElementById("logoSetting").value;
obj.weblink = document.getElementById("weblinkSetting").value;

let json = JSON.stringify(obj);
console.log("json", json);

downloadConfig(json, 'config.txt', 'text/plain');

};

function importSettings () {

	alert ("Not Implemented!")

};


function downloadConfig(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


function notifyMe(text) {

	const options = {
		body: 'Meeting Assist - Powered by Pexip',
		icon: './assets/media/logo_200x200.png',
		silent: true,
	};


	if (!("Notification" in window)) {
	  // Check if the browser supports notifications
	  console.log("This browser does not support desktop notification");
	} else if (Notification.permission === "granted") {
	  // Check whether notification permissions have already been granted;
	  // if so, create a notification
	  const notification = new Notification(text, options);
	  // …
	} else if (Notification.permission !== "denied") {
	  // We need to ask the user for permission
	  Notification.requestPermission().then((permission) => {
		// If the user accepts, let's create a notification
		if (permission === "granted") {
		  //const notification = new Notification(text);
		  //console.log("Notification Message:", text);
		  // …
		}
	  });
	}
  
	// At last, if the user has denied notifications, and you
	// want to be respectful there is no need to bother them anymore.
  }


	function layoutOverride() {
		var positionIds = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'];
		var selectedLayout = document.getElementById("overrideLayoutList");
		var selectedPlusIndicator = document.getElementById("showPlusIndicatorInput");
		var selectedOverrideIndicator = document.getElementById("showOverrideIndicatorInput");
		var audience = [];

		actors =[];
		var ul = document.getElementById("sortlist");
		let items = ul.getElementsByTagName("li")
		for(let i = 0; i < items.length ; i++){
			actors.push(items[i].id);
	  	}
	  	console.log("Setting stage actors:", actors);
		

		var override = {
			"layouts": [
				{
					"audience": audience,
					"actors": actors,
					"layout": selectedLayout.options[selectedLayout.selectedIndex].text,
					"plus_n": selectedPlusIndicator.value,
					"vad_backfill": !document.getElementById("vadBackfillInput").checked,
					"actors_overlay_text": document.getElementById("showPositionsInput").value,
					"indicators": selectedOverrideIndicator.value,
					"remove_self": !document.getElementById("includeSelfInput").checked,
					"positional_overlay_text": positionIds
				}
			]
		};

		console.log("➕ Add Layout Overrides:", override);
		pexRTC.overrideLayout(override);
	}


	//https://code-boxx.com/drag-drop-sortable-list-javascript/
	//https://codepen.io/code-boxx/pen/jOGjLeE

	function slist (target) {
		// (A) SET CSS + GET ALL LIST ITEMS
		target.classList.add("slist");
		let items = target.getElementsByTagName("li"), current = null;
	  
		// (B) MAKE ITEMS DRAGGABLE + SORTABLE
		for (let i of items) {
		  // (B1) ATTACH DRAGGABLE
		  i.draggable = true;
		  
		  // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
		  i.ondragstart = e => {
			current = i;
			for (let it of items) {
			  if (it != current) { it.classList.add("hint"); }
			}
		  };
		  
		  // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
		  i.ondragenter = e => {
			if (i != current) { i.classList.add("active"); }
		  };
	  
		  // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
		  i.ondragleave = () => i.classList.remove("active");
	  
		  // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
		  i.ondragend = () => { for (let it of items) {
			  it.classList.remove("hint");
			  it.classList.remove("active");
		  }};
	   
		  // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
		  i.ondragover = e => e.preventDefault();
	   
		  // (B7) ON DROP - DO SOMETHING
		  i.ondrop = e => {
			e.preventDefault();
			if (i != current) {
			  let currentpos = 0, droppedpos = 0;
			  for (let it=0; it<items.length; it++) {
				if (current == items[it]) { currentpos = it; }
				if (i == items[it]) { droppedpos = it; }
			  }
			  if (currentpos < droppedpos) {
				i.parentNode.insertBefore(current, i.nextSibling);
			  } else {
				i.parentNode.insertBefore(current, i);
			  }
			}
		  };
		}
	  }

	 

	  function getActors() {
		console.log("Current available actors from roster:", currentRoster)
		var ul = document.getElementById("sortlist");
		ul.innerHTML = "";

		currentRoster.forEach((item) => {
			console.log(item.participant_uuid);
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(item.overlay_text));
			li.setAttribute("id", item.uuid); 
			ul.appendChild(li);
		});

		slist(document.getElementById("sortlist"));
		
	  }

	  function searchTable() {
		var input, filter, tr, td, i, txtValue;
		input = document.getElementById("searchTableInput");
		filter = input.value.toUpperCase();
		tr = table.getElementsByTagName("tr");
		for (i = 0; i < tr.length; i++) {
		  td = tr[i].getElementsByTagName("td")[1];
		  if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
			  tr[i].style.display = "";
			} else {
			  tr[i].style.display = "none";
			}
		  }       
		}
	  }
   

function getStage() {
	var ul = document.getElementById("sortlist");
	ul.innerHTML = "";
	console.log("Get current stage actors:", stageActors);
	console.log("Get current layout actors:", layoutActors);
	console.log ("Current Roster", currentRoster);

	var layoutParticipants = layoutActors.participants;

	layoutParticipants.forEach((item) => {
		// console.log(item.participant_uuid);
		var searchUuid = item;
		var result = currentRoster.find(({ uuid }) => uuid === searchUuid);

		var li = document.createElement("li");
		li.appendChild(document.createTextNode(result.overlay_text));
		li.setAttribute("id", searchUuid);
		li.setAttribute("title", searchUuid); 
		ul.appendChild(li);
	});

	slist(document.getElementById("sortlist"));

}


//Context Menu for right-click delete of stage participant
document.getElementById("sortlist").addEventListener("contextmenu", removeStageParticipant);
document.getElementById("sortlist").addEventListener("contextmenu", (e) => {e.preventDefault()});

function removeStageParticipant(event) {
console.log("Item delete;", event.target.innerText, event.target.id, )
var child = document.getElementById(event.target.id);
child.remove();
}

function addToStage() {
	console.log ("Checking participant to stage:", participantID);
	
	var list = document.getElementById("sortlist").childNodes;

	//Don't duplicate entires
	var array =[];
	for (let item of list) {
		var arrValue = item.id;
		array.push(arrValue);
	  }

	if (array.findIndex((e => e === participantID)) === -1) {
		var ul = document.getElementById("sortlist");
		var li = document.createElement("li");
		var participantName = document.getElementById("participantName").value;
	
		console.log ("Adding new participant:", participantName, participantID)
		li.appendChild(document.createTextNode(participantName));
		li.setAttribute("id", participantID); 
		ul.appendChild(li);
	
		slist(document.getElementById("sortlist"));

	} else {
		console.log ("Duplicate participant:", participantName, participantID)
	}




	

}