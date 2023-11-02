import React, { useEffect, useState } from 'react'

import './LayoutSelector.scss'
import { LayoutItem } from './LayoutItem/LayoutItem'
import { layoutsSpeakerFocused } from './layouts/layoutsSpeakerFocused'
import { layoutsEqual } from './layouts/layoutsEqual'
import type { InfinityClient, LayoutEvent } from '@pexip/infinity'

interface LayoutSelectorProps {
  infinityClient: InfinityClient
  layoutStatus: LayoutEvent | undefined
}

export const LayoutSelector = (props: LayoutSelectorProps): JSX.Element => {
  const [selectedLayout, setSelectedLayout] = useState('')

  useEffect(() => {
    setSelectedLayout(props.layoutStatus?.requested_layout.primary_screen.chair_layout ?? '')
  }, [props.layoutStatus])

  return (
    <div className='LayoutSelector'>
      <div className='Container'>
        <h4>Speaker focused</h4>
        {layoutsSpeakerFocused.map((layoutInfo) => (
          <LayoutItem
            key={layoutInfo.code}
            selected={layoutInfo.code === selectedLayout}
            onSelect={(code: string) => {
              props.infinityClient.setLayout({
                transforms: {
                  layout: layoutInfo.code as any
                }
              }).catch((e) => { console.error(e) })
              setSelectedLayout(layoutInfo.code)
            }}
            {...layoutInfo}
          />
        ))}
        <h4>Equal</h4>
        {layoutsEqual.map((layoutInfo) => (
          <LayoutItem
            key={layoutInfo.code}
            selected={layoutInfo.code === selectedLayout}
            onSelect={(code: string) => {
              props.infinityClient.setLayout({
                transforms: {
                  layout: layoutInfo.code as any
                }
              }).catch((e) => { console.error(e) })
              setSelectedLayout(layoutInfo.code)
            }}
            {...layoutInfo}
          />
        ))}
      </div>
    </div>
  )
}
