import React, { useEffect, useState } from 'react'

import { Button, Form, Input, Modal, ModalCloseButton } from '@pexip/components'

import './Settings.scss'
import { conferenceKey, displayNameKey, hostPinKey, nodeKey } from '../../constants'

interface SettingsProps {
  onClose: () => void
}

export const Settings = (props: SettingsProps): JSX.Element => {
  const [node, setNode] = useState('')
  const [conference, setConference] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [hostPin, setHostPin] = useState('')

  useEffect(() => {
    const node = localStorage.getItem(nodeKey) ?? ''
    setNode(node)

    const conference = localStorage.getItem(conferenceKey) ?? ''
    setConference(conference)

    const displayName = localStorage.getItem(displayNameKey) ?? ''
    setDisplayName(displayName)

    const hostPin = localStorage.getItem(hostPinKey) ?? ''
    setHostPin(hostPin)
  }, [])

  const save = (event: any): void => {
    const node = event.target.node.value
    localStorage.setItem(nodeKey, node)

    const conference = event.target.conference.value
    localStorage.setItem(conferenceKey, conference)

    const displayName = event.target.displayName.value
    localStorage.setItem(displayNameKey, displayName)

    const hostPin = event.target.hostPin.value
    localStorage.setItem(hostPinKey, hostPin)

    props.onClose()
  }

  return (
    <Modal isOpen={true} className='Settings'>
      <ModalCloseButton className='CloseButton' onClose={props.onClose}/>
      <h2>Settings</h2>
      <Form onSubmit={e => {
        e.preventDefault()
        save(e)
      }}>
      <div className='InputContainer'>
        <Input type='text' required label='Conferencing Node' placeholder='Domain or IP' name='node'
          value={node} onChange={(event) => { setNode(event.target.value) }} />
        <Input type='text' required label='Conference' placeholder='Room name' name='conference'
          value={conference} onChange={(event) => { setConference(event.target.value) }} />
        <Input type='text' required label='Display name' placeholder='e.g. API connection' name='displayName'
          value={displayName} onChange={(event) => { setDisplayName(event.target.value) }} />
        <Input type='password' label='Host PIN' placeholder='e.g. 7645' name='hostPin'
          value={hostPin} onChange={(event) => { setHostPin(event.target.value) }} />
      </div>
      <div className='ButtonContainer'>
        <Button type='submit'>Save</Button>
        <Button onClick={props.onClose}>Cancel</Button>
        </div>
      </Form>
    </Modal>
  )
}
