import React, { useEffect, useState } from 'react'

import { Header } from './components/Header/Header'

import { Box, Button, Cell, Grid, Spinner, ThemeProvider, Wrapper } from '@pexip/components'
import { Conference } from './components/Conference/Conference'
import { Participants } from './components/Participants/Participants'
import { Settings } from './components/Settings/Settings'
import { conferenceKey, displayNameKey, hostPinKey, nodeKey } from './constants'
import { ClientCallType, type InfinityClient, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'

import './App.scss'

enum AppState {
  Disconnected,
  Connecting,
  Connected
}

let infinityClient: InfinityClient

export const App = (): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppState.Disconnected)
  const [settingsOpened, setSettingsOpened] = useState<boolean>(false)

  useEffect(() => {
    const disconnectBrowserClosed = (): void => {
      infinityClient?.disconnect({ reason: 'Browser closed' }).catch((e) => { console.error(e) })
    }
    window.addEventListener('beforeunload', disconnectBrowserClosed)
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
    }
  }, [])

  const connect = async (): Promise<void> => {
    setAppState(AppState.Connecting)
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
      const infinityClientSignals = createInfinityClientSignals([])
      const callSignals = createCallSignals([])
      infinityClient = createInfinityClient(infinityClientSignals, callSignals)
      await infinityClient.call({
        host: `https://${node}`,
        conferenceAlias: conference,
        displayName,
        bandwidth: 0,
        callType: ClientCallType.None,
        pin: hostPin
      })
      setAppState(AppState.Connected)
    }
  }

  return (
    <div className='App'>
      <ThemeProvider colorScheme='light'>
        <Header
          isConnected={appState === AppState.Connected}
          onDisconnectClick={() => {
            infinityClient?.disconnect({}).catch((e) => { console.error(e) })
            setAppState(AppState.Disconnected)
          }}
          onSettingsClick={() => { setSettingsOpened(true) }}
        />
        <div className='Container'>

          {appState === AppState.Disconnected &&
            <Box className='NotConnected' colorScheme='dark'>
              <h2>Not connected to conference</h2>
              <Button onClick={() => { connect().catch((e) => { console.error(e) }) }} colorScheme='dark'>Connect</Button>
            </Box>
          }
          {appState === AppState.Connecting && <Spinner colorScheme='dark' className='Connecting' />}
          {appState === AppState.Connected && <>
            <Wrapper className='Connected'>
              <Grid className='Grid'>
                <Cell xs={3} className='HorizontalCell'>
                  <Conference />
                  {/* <Layout /> */}
                </Cell>
                <Cell xs={9} className='HorizontalCell'>
                  <Participants />
                </Cell>
              </Grid>
            </Wrapper>
          </>}
          {settingsOpened &&
            <Settings onClose={() => { setSettingsOpened(false) }} />
          }
        </div>
      </ThemeProvider>
    </div>
  )
}
