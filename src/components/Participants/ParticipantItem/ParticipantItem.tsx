import React from 'react'

import type { Participant } from '@pexip/infinity'

import './ParticipantItem.scss'
import { Icon, IconTypes, Tooltip } from '@pexip/components'

interface ParticipantItemProps {
  participant: Participant
  onClick: () => void
}

export const ParticipantItem = (props: ParticipantItemProps): JSX.Element => {
  return (
    <div className='ParticipantItem' onClick={props.onClick}>
      <span className='DisplayName'>
        {props.participant.displayName}
      </span>
      {props.participant.isSpotlight &&
        <Tooltip text='Spotlighted' position='topLeft'>
          <Icon source={IconTypes.IconStar} />
        </Tooltip>
      }
      {props.participant.isPresenting &&
        <Tooltip text='Presenting' position='topLeft'>
          <Icon source={IconTypes.IconPresentationOn} />
        </Tooltip>
      }
      {props.participant.isCameraMuted &&
        <Tooltip text='Video muted' position='topLeft'>
          <Icon source={IconTypes.IconVideoOff} />
        </Tooltip>
      }
      {props.participant.isMuted &&
        <Tooltip text='Audio muted' position='topLeft'>
          <Icon source={IconTypes.IconMicrophoneOff} />
        </Tooltip>
      }
    </div>
  )
}
