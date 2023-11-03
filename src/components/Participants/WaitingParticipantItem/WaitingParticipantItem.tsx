import React from 'react'

import type { InfinityClient, Participant } from '@pexip/infinity'
import { Icon, IconTypes } from '@pexip/components'

import './WaitingParticipantItem.scss'

interface WaitingParticipantProps {
  participant: Participant
  infinityClient: InfinityClient
}

export const WaitingParticipantItem = (props: WaitingParticipantProps): JSX.Element => {
  const handleAdmit = (): void => {
    props.infinityClient.admit({ participantUuid: props.participant.uuid }).catch((e) => { console.error(e) })
  }

  const handleReject = (): void => {
    props.infinityClient.kick({ participantUuid: props.participant.uuid }).catch((e) => { console.error(e) })
  }

  return (
    <div className='WaitingParticipantItem'>
    <span className='DisplayName'>
      {props.participant.displayName}
    </span>
    <button className='admit' onClick={handleAdmit}><Icon source={IconTypes.IconCheckmark}/></button>
    <button className='reject' onClick={handleReject}><Icon source={IconTypes.IconClose}/></button>
  </div>)
}
