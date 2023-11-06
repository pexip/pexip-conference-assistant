import React, { useEffect, useState } from 'react'

import { Box, Button, Form, Input } from '@pexip/components'
import { conferenceKey, displayNameKey, hostPinKey, nodeKey } from '../../constants'
import { ClientCallType, type InfinityClient } from '@pexip/infinity'

import './ConnectForm.scss'

interface ConnectFormProps {
  infinityClient: InfinityClient
  onConnecting: () => void
  onConnected: () => void
}

let needManualInputGlobal = false

export const ConnectForm = (props: ConnectFormProps): JSX.Element => {
  const [node, setNode] = useState('')
  const [conference, setConference] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [hostPin, setHostPin] = useState('')
  const [needManualInput, setNeedManualInput] = useState(false)

  const save = (event: any): void => {
    const node = event.target.node.value
    localStorage.setItem(nodeKey, node)

    const conference = event.target.conference.value
    localStorage.setItem(conferenceKey, conference)

    const displayName = event.target.displayName.value
    localStorage.setItem(displayNameKey, displayName)

    const hostPin = event.target.hostPin.value
    localStorage.setItem(hostPinKey, hostPin)
  }

  const connect = async (): Promise<void> => {
    props.onConnecting()
    const node = localStorage.getItem(nodeKey)
    const conference = localStorage.getItem(conferenceKey)
    const displayName = localStorage.getItem(displayNameKey)
    const hostPin = localStorage.getItem(hostPinKey)

    if (
      node == null ||
      conference == null ||
      displayName == null ||
      hostPin == null
    ) {
      alert('Not configured')
    } else {
      await props.infinityClient.call({
        host: `https://${node}`,
        conferenceAlias: conference,
        displayName,
        bandwidth: 0,
        callType: ClientCallType.None,
        pin: hostPin
      })
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    const node = params.get('node')
    const conference = params.get('conference')
    const displayName = params.get('name')
    const hostPin = params.get('pin')

    if (
      !needManualInputGlobal &&
      node != null &&
      conference != null &&
      displayName != null &&
      hostPin != null
    ) {
      localStorage.setItem(nodeKey, node)
      localStorage.setItem(conferenceKey, conference)
      localStorage.setItem(displayNameKey, displayName)
      localStorage.setItem(hostPinKey, hostPin)

      connect().catch((e) => { console.error(e) })
    } else {
      const node = localStorage.getItem(nodeKey) ?? ''
      const conference = localStorage.getItem(conferenceKey) ?? ''
      const displayName = localStorage.getItem(displayNameKey) ?? ''
      const hostPin = localStorage.getItem(hostPinKey) ?? ''

      setNode(node)
      setConference(conference)
      setDisplayName(displayName)
      setHostPin(hostPin)
    }
    needManualInputGlobal = true
    setNeedManualInput(true)
  }, [])

  return (
    <>
      {needManualInput &&
        <Box className='ConnectForm' padding='medium'>
          {needManualInput &&
            <Form onSubmit={e => {
              e.preventDefault()
              save(e)
              connect().catch((e) => { console.error(e) })
            }}>
              <Input type='text' required label='Conferencing Node' placeholder='Domain or IP' name='node'
                value={node} onChange={(event) => { setNode(event.target.value) }} />
              <Input type='text' required label='Conference' placeholder='Room name' name='conference'
                value={conference} onChange={(event) => { setConference(event.target.value) }} />
              <Input type='text' required label='Display name' placeholder='e.g. API connection' name='displayName'
                value={displayName} onChange={(event) => { setDisplayName(event.target.value) }} />
              <Input type='password' label='Host PIN' placeholder='e.g. 7645' name='hostPin'
                value={hostPin} onChange={(event) => { setHostPin(event.target.value) }} />
              <Button type='submit'>Connect</Button>
            </Form>
          }
        </Box>
      }
    </>
  )
}
