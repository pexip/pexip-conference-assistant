import React from 'react'

import './LayoutItem.scss'
import { Icon, IconTypes } from '@pexip/components'

interface LayoutItemProps {
  label: string
  icon: string
  code: string
  selected: boolean
  onSelect: (code: string) => void
}

export const LayoutItem = (props: LayoutItemProps): JSX.Element => {
  return (
    <button className='LayoutItem' onClick={() => { props.onSelect(props.code) }}>
      <img src={`img/${props.icon}`}/>
      <span>{props.label}</span>
      {props.selected && <Icon source={IconTypes.IconCheckmark} />}
    </button>
  )
}
