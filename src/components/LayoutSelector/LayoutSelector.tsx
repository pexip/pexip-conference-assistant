import React from 'react'

import './LayoutSelector.scss'
import { LayoutItem } from './LayoutItem/LayoutItem'
import { layoutsSpeakerFocused } from './layouts/layoutsSpeakerFocused'
import { layoutsEqual } from './layouts/layoutsEqual'

export const LayoutSelector = (): JSX.Element => {
  return (
    <div className='LayoutSelector'>
      <h3>Speaker focused</h3>
      {layoutsSpeakerFocused.map((layoutInfo) => (
        <LayoutItem
          key={layoutInfo.code}
          selected={false}
          onSelect={(code: string) => {}}
          {...layoutInfo}
        />
      ))}
      <h3>Equal</h3>
      {layoutsEqual.map((layoutInfo) => (
        <LayoutItem
          key={layoutInfo.code}
          selected={false}
          onSelect={(code: string) => {}}
          {...layoutInfo}
        />
      ))}
    </div>
  )
}
