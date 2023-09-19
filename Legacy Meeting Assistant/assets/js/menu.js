lockItems = [
  {
  "name": "Unlocked",
  "value": false
},
{
  "name": "Locked",
  "value": true
}
];

conferenceFeatureItems = [
  {
  "name": "Start Conference",
  "value": "startConference"
},
{
  "name": "End Conference",
  "value": "endConference"
},
{
  "name": "Dial Out",
  "value": "dialOutAuto"
}
];

participantFeatureItems = [
  {
    "name": "Make Host",
    "value": "addHost"
  },
  {
    "name": "Make Guest",
    "value": "removeHost"
  },
{
  "name": "Add Spotlight",
  "value": "addSpotlight"
},
{
  "name": "Remove Spotlight",
  "value": "removeSpotlight"
},
{
  "name": "Remove All Spotlights",
  "value": "removeAllSpotlights"
},
{
  "name": "Add Overlay Text",
  "value": "overlay"
},
{
  "name": "Transfer Participant",
  "value": "transfer"
},
{
  "name": "DTMF Participant",
  "value": "dtmf"
}
];

layoutItems = [
  {
    "name": "Default Layout",
    "value": '{}'
  },
   {
    "name": "1:0",
    "value": '{"layout": "1:0"}'
  },
  {
    "name": "1:7",
    "value": '{"layout": "1:7"}'
  },
  {
    "name": "4:0",
    "value": '{"layout": "4:0"}'
  },
  {
    "name": "9:0",
    "value": '{"layout": "9:0"}'
  },
  {
    "name": "16:0",
    "value": '{"layout": "16:0"}'
  },
  {
    "name": "25:0",
    "value": '{"layout": "25:0"}'
  },
  {
    "name": "1:21",
    "value": '{"layout": "1:21"}'
  },
  {
    "name": "2:21",
    "value": '{"layout": "2:21"}'
  },
  {
    "name": "1:33",
    "value": '{"layout": "1:33"}'
  },
  {
    "name": "ac",
    "value": '{"layout": "ac"}'
  },
  {
    "name": "extended ac",
    "value": '{"layout": "ac", "enable_extended_ac": true}'
  },
  {
    "name": "teams",
    "value": '{"layout": "teams"}'
  }
];


indicatorsItems = [
  {
    "name": "Conference Indicators",
    "value": '{"":""}'
  },
  {
    "name": "Overlay Text Enable",
    "value": '{"enable_overlay_text": true}'
  },
  {
    "name": "Overlay Text Disable",
    "value": '{"enable_overlay_text": false}'
  },
  {
    "name": "Active Speaker Indication Enable",
    "value": '{"enable_active_speaker_indication": true}'
  },
  {
    "name": "Active Speaker Indication Disable",
    "value": '{"enable_active_speaker_indication": false}'
  },
  {
    "name": "PIP Counter Indicator Enable",
    "value": '{"plus_n_pip_enabled": true}'
  },
  {
    "name": "PIP Counter Indicator Disable",
    "value": '{"plus_n_pip_enabled": false}'
  },
  {
    "name": 'Recording Indicator Enable',
    "value": '{"recording_indicator": true}'
  },
  {
    "name": "Recording Indicator Disable",
    "value": '{"recording_indicator": false}'
  },
  {
    "name": "Transcription Indicator Enable",
    "value": '{"transcribing_indicator": true}'
  },
  {
    "name": "Transcription Indicator Disable",
    "value": '{"transcribing_indicator": false}'
  },
  {
    "name": "Streaming Indicator Enable",
    "value": '{"streaming_indicator": true}'
  },
  {
    "name": "Streaming Indicator Disable",
    "value": '{"streaming_indicator": false}'
  },
  {
    "name": "Enable All Indicators",
    "value": '{"streaming_indicator": true, "transcribing_indicator" : true, "recording_indicator": true}'
  },
  {
    "name": "Disable All Indicators",
    "value": '{"streaming_indicator": false, "transcribing_indicator" : false, "recording_indicator": false}'
  },
];

//Layout List
//console.log("layoutList", layoutItems);
let layoutDropdown = document.getElementById('layoutList');
layoutDropdown.classList.add("right");

let overrideLayoutDropdown = document.getElementById('overrideLayoutList');
overrideLayoutDropdown.classList.add("right");

for (let i = 0; i < layoutItems.length; i++) {
    layoutOption = document.createElement('option');
    layoutOption.style.backgroundColor="#a0a0a0";
    layoutOption.text = layoutItems[i].name;
    layoutOption.value = layoutItems[i].value;
    layoutDropdown.add(layoutOption);
  }

  for (let i = 1; i < layoutItems.length; i++) {
    layoutOption = document.createElement('option');
    layoutOption.style.backgroundColor="#a0a0a0";
    layoutOption.text = layoutItems[i].name;
    layoutOption.value = layoutItems[i].value;
    overrideLayoutDropdown.add(layoutOption);
  }
  //Default Override Layout Selection  
  overrideLayoutDropdown.options[2].selected = true

 // Indicators list 
 // console.log("indicatorsList", indicatorsItems);
  let indicatorsDropdown = document.getElementById('indicatorsList');
  indicatorsDropdown.classList.add("right");
  
  for (let i = 0; i < indicatorsItems.length; i++) {
      indicatorsOption = document.createElement('option');
      indicatorsOption.style.backgroundColor="#a0a0a0";
      indicatorsOption.text = indicatorsItems[i].name;
      indicatorsOption.value = indicatorsItems[i].value;
      indicatorsDropdown.add(indicatorsOption);
    }

//Lock List
//console.log("lockList", lockItems);
  let lockDropdown = document.getElementById('lockList');
  lockDropdown.classList.add("right");
  
  for (let i = 0; i < lockItems.length; i++) {
      lockOption = document.createElement('option');
      lockOption.style.backgroundColor="#a0a0a0";
      lockOption.text = lockItems[i].name;
      lockOption.value = lockItems[i].value;
      lockDropdown.add(lockOption);
    }

//Conference List
//console.log("conferenceFeatureItems", conferenceFeatureItems);
let conferenceFeatureDropdown = document.getElementById('conferenceFeatureList');
conferenceFeatureDropdown.classList.add("right");

for (let i = 0; i < conferenceFeatureItems.length; i++) {
    conferenceFeatureOption = document.createElement('option');
    conferenceFeatureOption.style.backgroundColor="#a0a0a0";
    conferenceFeatureOption.text = conferenceFeatureItems[i].name;
    conferenceFeatureOption.value = conferenceFeatureItems[i].value;
    conferenceFeatureDropdown.add(conferenceFeatureOption);
  }
  
//participantFeatureItems
//console.log("Participant Feature Items", participantFeatureItems);
  
  let participantFeatureDropdown = document.getElementById('participantFeatureList');
  participantFeatureDropdown.classList.add("right");
  
  for (let i = 0; i < participantFeatureItems.length; i++) {
    participantFeatureOption = document.createElement('option');
    participantFeatureOption.style.backgroundColor="#a0a0a0";
    participantFeatureOption.text = participantFeatureItems[i].name;
    participantFeatureOption.value = participantFeatureItems[i].value;
    participantFeatureDropdown.add(participantFeatureOption);
    }