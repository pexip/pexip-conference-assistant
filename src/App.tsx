import React, { useState } from 'react'

import { Header } from './components/Header/Header'

import { Box, Button, Spinner, ThemeProvider } from '@pexip/components'
import { Conference } from './components/Conference/Conference'
import { Participants } from './components/Participants/Participants'
import { Settings } from './components/Settings/Settings'

import './App.scss'

enum AppState {
  Disconnected,
  Connecting,
  Connected
}

export const App = (): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppState.Disconnected)
  const [settingsOpened, setSettingsOpened] = useState<boolean>(false)

  return (
    <div className='App'>
      <ThemeProvider colorScheme='light'>
        <Header onSettingsClick={() => { setSettingsOpened(true) }}/>
        <div className='Container'>

          {appState === AppState.Disconnected &&
            <Box className='NotConnected' colorScheme='dark'>
              <h2>Not connected to conference</h2>
              <Button onClick={() => { setAppState(AppState.Connecting) }} colorScheme='dark'>Connect</Button>
            </Box>
          }
          {appState === AppState.Connecting && <Spinner colorScheme='dark'/>}
          {appState === AppState.Connected && <>
            <Conference />
            <Participants />
          </>}
          {settingsOpened &&
            <Settings onClose={() => { setSettingsOpened(false) }} />
          }
        </div>
      </ThemeProvider>
    </div>
  )
}
