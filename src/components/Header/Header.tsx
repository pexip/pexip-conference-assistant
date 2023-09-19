import React from 'react'

import { Box, Button, Icon, IconTypes, PexipLogo } from '@pexip/components'

import './Header.scss'

interface HeaderProps {
  onSettingsClick: () => void
}

export const Header = (props: HeaderProps): JSX.Element => {
  return (
    <Box className='Header' colorScheme='dark'>
      <PexipLogo className='Logo'/>
      <h2 className='Title'>Meeting Assistance</h2>
      <Button className='Button' colorScheme='dark' onClick={props.onSettingsClick}>
        <Icon source={IconTypes.IconSettings} />
        <span className='ButtonText'>Settings</span>
      </Button>
    </Box>
  )
}
