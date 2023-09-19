import React from 'react'

import { Button, Form, Icon, IconTypes, Input, Modal, ModalCloseButton, Tooltip } from '@pexip/components'

import './Settings.scss'

interface Config {
  node: string
  conference: string
  displayName: string
  hostPin: string
  webAppUrl: string
  logoUrl: string
}

interface SettingsProps {
  onClose: () => void
}

export const Settings = (props: SettingsProps): JSX.Element => {
  const save = (event: React.FormEvent<HTMLFormElement>): void => {
    // const config = getConfigFromEvent(event)
  }

  const clear = (): void => {

  }

  const importConfig = (): void => {
    alert('Not Implemented yet!')
  }

  const downloadConfig = (): void => {
    const config = getConfigFromEvent(event)
    const a = document.createElement('a')
    const file = new Blob([JSON.stringify(config)], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = 'config.json'
    a.click()
  }

  const getConfigFromEvent = (event: any): Config => {
    const target = event.target
    const config = {
      node: target.node?.value ?? '',
      conference: target.conference?.value ?? '',
      displayName: target.displayName?.value ?? '',
      hostPin: target.hostPin?.value ?? '',
      webAppUrl: target.webAppUrl?.value ?? '',
      logoUrl: target.logoUrl?.value ?? ''
    }
    return config
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
        <Input type='text' required placeholder='Conference Node' label='Pexip Node' name='conferenceNode' />
        <Input type='text' required placeholder='Pexip Meeting Uri' label='Pexip Meeting Room' name='conference' />
        <Input type='text' required placeholder='API user name' label='API Name' name='displayName' />
        <Input type='password' required placeholder='****' label='Host Pin' name='hostPin' />
        <Input type='url' required placeholder='Pexip Connect Weblink' label='WebApp link' name='webAppUrl' />
        <Input type='url' required placeholder='Logo Image Uri (e.g. 500x500 png)' label='Logo Uri' name='logoUrl' />
      </div>
      <div className='ButtonContainer'>
        <Tooltip text='Save' colorScheme='dark'>
          <Button type='submit'>
            <Icon source={IconTypes.IconCheckmark} />
          </Button>
        </Tooltip>
        <Tooltip text='Clear' colorScheme='dark'>
          <Button onClick={clear}>
            <Icon source={IconTypes.IconTrash} />
          </Button>
        </Tooltip>
        <Tooltip text='Download config' colorScheme='dark'>
          <Button onClick={downloadConfig}>
            <Icon source={IconTypes.IconExport} />
          </Button>
        </Tooltip>
        <Tooltip text='Import config' colorScheme='dark'>
          <Button onClick={importConfig}>
            <Icon source={IconTypes.IconImport} />
          </Button>
        </Tooltip>
        </div>
      </Form>
    </Modal>
  )
}
