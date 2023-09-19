import React from 'react'

import { Box, Button, Input } from '@pexip/components'

export const Participants = (): JSX.Element => {
  return (
    <Box className='Participants' colorScheme='light'>
      <h3>Participants</h3>
      <Input id='participantName' name='text' className='textInput' readOnly={true} title='ParticipantID' placeholder='Participant Name' label={''} />
      <Button>Admit</Button>
      <Button>Disconnect</Button>
      <Button>Unmute Audio</Button>
      <Button >Mute Audio</Button>
      <Button hidden id='unmuteVideoButton' >Unmute Video</Button>
      <Button hidden id='muteVideoButton' >Mute Video</Button>
      <Button id='lowerHandButton' >Lower Hand</Button>
      <Button id='addToStageButton' onClick={() => {}}>Add to Stage</Button>
      <br />
      <select className='Button information' id='participantFeatureList' title='participantFeatureList'></select>
      <Button id='applyParticipantButton' className='Button information'>Apply</Button>
      <Input id='overlayNameInput' name='text' className='textInput' placeholder='Overlay Name' label={''} />
      <Input id='transferInput' name='text' className='textInput' placeholder='Transfer URI' label={''} />
      <Input id='dtmfInput' name='text' className='textInput' placeholder='DTMF' label={''} />#
    </Box>
  )
}
