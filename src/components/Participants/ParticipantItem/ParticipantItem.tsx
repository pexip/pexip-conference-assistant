import React from 'react'

import type { Participant } from '@pexip/infinity'

import './ParticipantItem.scss'
import { Icon, IconTypes } from '@pexip/components'

interface ParticipantItemProps {
  participant: Participant
}

export const ParticipantItem = (props: ParticipantItemProps): JSX.Element => {
  return (
    <div className='ParticipantItem'>
      <span className='DisplayName'>
        {props.participant.displayName}
      </span>
      {props.participant.isPresenting && <Icon source={IconTypes.IconPresentationOn} />}
      {props.participant.isCameraMuted && <Icon source={IconTypes.IconVideoOff} />}
      {props.participant.isMuted && <Icon source={IconTypes.IconMicrophoneOff} />}
    </div>
  )
}
