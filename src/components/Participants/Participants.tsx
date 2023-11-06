import React, { useEffect, useState } from 'react'

import type { InfinityClient, Participant } from '@pexip/infinity'
import { Accordion, Icon, IconTypes } from '@pexip/components'

import './Participants.scss'
import { ParticipantItem } from './ParticipantItem/ParticipantItem'
import { WaitingParticipantItem } from './WaitingParticipantItem/WaitingParticipantItem'
import { ParticipantDetails } from './ParticipantDetails/ParticipantDetails'

interface ParticipantsProps {
  infinityClient: InfinityClient
  participants: Participant[]
  onDisconnected: () => void
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
  const [muteAllGuests, setMuteAllGuests] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)

  const participantsWaitingRoom = props.participants.filter((participant) => participant.isWaiting)
  const participantsRaisedHand = props.participants.filter((participant) => participant.raisedHand)
  const participantsInMeeting = props.participants.filter((participant) => !participant.raisedHand && !participant.isWaiting)

  const handleMuteAllGuests = (): void => {
    props.infinityClient.muteAllGuests({ mute: !muteAllGuests }).catch((e) => { console.error(e) })
    setMuteAllGuests(!muteAllGuests)
  }

  const handleDisconnectAll = (): void => {
    props.infinityClient.disconnectAll({}).catch((e) => { console.error(e) })
    props.onDisconnected()
  }

  const handleAdmitAll = (): void => {
    participantsWaitingRoom.forEach((participant) => {
      props.infinityClient.admit({
        participantUuid: participant.uuid
      }).catch((e) => { console.error(e) })
    })
  }

  useEffect(() => {
    if (selectedParticipant != null) {
      const participant = props.participants.find((participant) => participant.uuid === selectedParticipant.uuid)
      setSelectedParticipant(participant ?? null)
    }
  }, [props.participants])

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
                <WaitingParticipantItem key={participant.uuid} participant={participant} infinityClient={props.infinityClient}/>
              ))}
              <button className='AdmitAllButton' onClick={handleAdmitAll}>Admit all</button>
            </Accordion>
          }

          {participantsRaisedHand.length > 0 &&
            <Accordion title={'Raised a hand'} isExpanded={true}>
              {participantsRaisedHand.map((participant) => (
                <ParticipantItem
                  key={participant.uuid}
                  participant={participant}
                  onClick={() => { setSelectedParticipant(participant) }}/>
              ))}
            </Accordion>
          }

          {participantsInMeeting.length > 0 &&
            <Accordion title={'In this meeting'} isExpanded={true}>
              {participantsInMeeting.map((participant) => (
                <ParticipantItem
                  key={participant.uuid}
                  participant={participant}
                  onClick={() => { setSelectedParticipant(participant) }}
                />
              ))}
            </Accordion>
          }
        </div>
      </div>
      {selectedParticipant != null &&
        <ParticipantDetails
          infinityClient={props.infinityClient}
          participant={selectedParticipant}
          onClose={() => { setSelectedParticipant(null) }}
        />
      }
    </div>
  )
}
