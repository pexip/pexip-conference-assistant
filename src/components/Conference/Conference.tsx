import React, { useState } from 'react'

import { Box, BoxHeader, Button, Select, ToggleSwitch } from '@pexip/components'

import './Conference.scss'
import { layouts } from '../Layout/layouts'

export const Conference = (): JSX.Element => {
  const [locked, setLocked] = useState(false)
  const [layout, setLayout] = useState(layouts[0])
  return (
    <Box className='Conference'>
      <BoxHeader>
        <h3>Conference</h3>
      </BoxHeader>
      <div className='Container'>
        <ToggleSwitch label='Locked'
          onChange={() => {
            setLocked(!locked)
          }} checked={locked} name={''} />
        <Select
          value={layout}
          label={'Layout'}
          isFullWidth={true}
          onValueChange={(id: string) => {
            setLayout(id)
            // TODO: Send layout to Infinity
          }}
          options={layouts.map((layout) => {
            const option = {
              id: layout,
              label: layout
            }
            return option
          })}
        />
        <Button>Mute All Guests</Button>
        <Button>Unmute All Guests</Button>
      </div>
    </Box>
  )
}
