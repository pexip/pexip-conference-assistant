import React from 'react'

import { Box, Button, Icon, IconTypes, PexipLogo } from '@pexip/components'

import './Header.scss'

interface HeaderProps {
  isConnected: boolean
  onDisconnectClick: () => void
  onSettingsClick: () => void
}

export const Header = (props: HeaderProps): JSX.Element => {
  return (
    <Box className='Header' colorScheme='dark'>
      <PexipLogo className='Logo'/>
      <h2 className='Title'>Conference Assistance</h2>
      {props.isConnected &&
        <Button className='Button' colorScheme='dark' onClick={props.onDisconnectClick}>
          <Icon source={IconTypes.IconLeave} />
          <span className='ButtonText'>Disconnect</span>
        </Button>
}
      <Button className='Button' colorScheme='dark' onClick={props.onSettingsClick}>
        <Icon source={IconTypes.IconSettings} />
        <span className='ButtonText'>Settings</span>
      </Button>
    </Box>
  )
}
