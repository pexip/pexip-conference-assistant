import React from 'react'

import './LayoutSelector.scss'
import { LayoutItem } from './LayoutItem/LayoutItem'
import { layoutsSpeakerFocused } from './layouts/layoutsSpeakerFocused'

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
      {/* <h3>Equal</h3>
      <span>Highlight</span>
      <span>2 x 2</span>
      <span>3 x 3</span>
      <span>4 x 4</span> */}
    </div>
  )
}
