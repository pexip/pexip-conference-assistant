import React from 'react'

import { Icon, type IconSource } from '@pexip/components'

import './ParticipantDetailsButton.scss'

interface ParticipantDetailsButtonProps {
  label: string
  icon: IconSource
  onClick: () => void
  color?: string
}

export const ParticipantDetailsButton = (props: ParticipantDetailsButtonProps): JSX.Element => {
  let style = {}

  if (props.color != null) {
    style = { color: props.color }
  }

  return (
    <button className='ParticipantDetailsButton' onClick={props.onClick} style={style}>
      <Icon source={props.icon} />
      <span>{props.label}</span>
    </button>
  )
}
