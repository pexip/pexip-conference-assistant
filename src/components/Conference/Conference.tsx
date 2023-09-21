import React, { useEffect, useState } from 'react'

import { Box, BoxHeader, Select, ToggleSwitch } from '@pexip/components'
import type {
  Transforms,
  InfinityClient,
  ConferenceStatus,
  LayoutEvent
} from '@pexip/infinity'

import './Conference.scss'

const layouts = ['1:0', '1:7', '1:21', '2:21', '1:33', '4:0', '9:0', '16:0', '25:0', '5:7'/*, 'ac_presentation_in_mix', 'ac_presentation_in_mix_group' */] as const
type Layout = typeof layouts[number]

interface ConferenceProps {
  infinityClient: InfinityClient
  conferenceStatus: ConferenceStatus | undefined
  layoutStatus: LayoutEvent | undefined
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  const [locked, setLocked] = useState(false)
  const [guestsMuted, setGuestMuted] = useState(false)
  const [layout, setLayout] = useState<Layout>()

  useEffect(() => {
    if (props.conferenceStatus != null) {
      if (props.conferenceStatus.locked !== locked) {
        setLocked(props.conferenceStatus.locked)
      }
      if (props.conferenceStatus.guestsMuted !== guestsMuted) {
        setGuestMuted(props.conferenceStatus.guestsMuted)
      }
    }
  }, [props.conferenceStatus])

  useEffect(() => {
    if (props.layoutStatus != null) {
      const newLayout = props.layoutStatus.requested_layout.primary_screen.chair_layout
      if (newLayout !== layout) {
        setLayout(newLayout as Layout)
      }
    }
  }, [props.layoutStatus])

  const onToggleLockConference = (): void => {
    props.infinityClient.lock({
      lock: !locked
    }).catch((e) => { console.error(e) })
    setLocked(!locked)
  }

  const onToggleMuteGuests = (): void => {
    props.infinityClient.muteAllGuests({
      mute: !guestsMuted
    }).catch((e) => { console.error(e) })
    setGuestMuted(!guestsMuted)
  }

  const onChangeLayout = (id: string): void => {
    const layout = id as Layout
    let transforms: Transforms
    if (layout != null && layout as any !== 'default') {
      transforms = { layout }
    } else {
      transforms = {}
    }
    props.infinityClient.setLayout({
      transforms
    }).catch((e) => { console.error(e) })
    setLayout(layout)
  }

  return (
    <Box className='Conference'>
      <BoxHeader>
        <h3>Conference</h3>
      </BoxHeader>
      <div className='Container'>
        <div className='TogglesContainer'>
          <ToggleSwitch label='Locked'
            onChange={onToggleLockConference}
            checked={locked} name={''}
            className='Toggle' />
          <ToggleSwitch label='All guest muted'
            onChange={onToggleMuteGuests}
            checked={guestsMuted} name={''}
            className='Toggle' />
        </div>
        <Select
          value={layout as Layout}
          label={'Layout'}
          isFullWidth={true}
          onValueChange={onChangeLayout}
          options={[{
            id: 'default',
            label: 'Default'
          }].concat(layouts.map((layout) => {
            const option = {
              id: layout,
              label: layout
            }
            return option
          }))}
        />
      </div>
    </Box>
  )
}
