import React, { useState } from 'react'

import type { InfinityClient, Participant } from '@pexip/infinity'
import { Accordion, Icon, IconTypes } from '@pexip/components'

import './Participants.scss'
import { ParticipantItem } from './ParticipantItem/ParticipantItem'

interface ParticipantsProps {
  infinityClient: InfinityClient
  participants: Participant[]
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
  const [muteAllGuests, setMuteAllGuests] = useState(false)

  const participantsWaitingRoom = props.participants.filter((participant) => participant.isWaiting)
  const participantsRaisedHand = props.participants.filter((participant) => participant.raisedHand)
  const participantInMeeting = props.participants.filter((participant) => !participant.raisedHand && !participant.isWaiting)

  const handleMuteAllGuests = (): void => {
    props.infinityClient.muteAllGuests({ mute: !muteAllGuests }).catch((e) => { console.error(e) })
    setMuteAllGuests(!muteAllGuests)
  }

  const handleDisconnectAll = (): void => {
    props.infinityClient.disconnectAll({}).catch((e) => { console.error(e) })
  }

  return (
    <div className='Participants'>
      <div className='ButtonSet'>
        <button onClick={handleMuteAllGuests}>
          <Icon source={IconTypes.IconMicrophoneOn}/>
          <span>{muteAllGuests ? 'Unmute' : 'Mute'} all guests</span>
        </button>
        <button className='danger' onClick={handleDisconnectAll}>
          <Icon source={IconTypes.IconClose} />
          <span>Disconnect all</span>
        </button>
      </div>
      <div className='ParticipantsList'>
        <div className='Container'>

          {participantsWaitingRoom.length > 0 &&
            <Accordion title={'Waiting in lobby'} isExpanded={true}>
              {participantsWaitingRoom.map((participant) => (
                <ParticipantItem key={participant.uuid} participant={participant} />
              ))}
              <button className='AdmitAllButton'>Admit all</button>
            </Accordion>
          }

          {participantsRaisedHand.length > 0 &&
            <Accordion title={'Raised a hand'} isExpanded={true}>
              {participantsRaisedHand.map((participant) => (
                <ParticipantItem key={participant.uuid} participant={participant} />
              ))}
            </Accordion>
          }

          {participantInMeeting.length > 0 &&
            <Accordion title={'In this meeting'} isExpanded={true}>
              {participantInMeeting.map((participant) => (
                <ParticipantItem key={participant.uuid} participant={participant} />
              ))}
            </Accordion>
          }
        </div>
      </div>
    </div>
  )
}
