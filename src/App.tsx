import React, { useEffect, useState } from 'react'

import { Header } from './components/Header/Header'

import { Box, Button, Cell, Grid, Spinner, ThemeProvider, Wrapper } from '@pexip/components'
import { Conference } from './components/Conference/Conference'
import { Participants } from './components/Participants/Participants'
import { Settings } from './components/Settings/Settings'
import { conferenceKey, displayNameKey, hostPinKey, nodeKey } from './constants'
import {
  ClientCallType,
  type InfinityClient,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type ExtendedInfinityErrorCode,
  type ExtendedInfinityErrorMessage
} from '@pexip/infinity'

import './App.scss'
import { ErrorPanel } from './components/ErrorPanel/ErrorPanel'

enum AppState {
  Disconnected,
  Connecting,
  Connected,
  Error
}

let infinityClient: InfinityClient
const infinityClientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])

export const App = (): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppState.Disconnected)
  const [settingsOpened, setSettingsOpened] = useState<boolean>(false)
  const [error, setError] = useState('')
  const [conferenceStatus, setConferenceStatus] = useState()
  const [layoutStatus, setLayoutStatus] = useState()

  useEffect(() => {
    const disconnectBrowserClosed = (): void => {
      infinityClient?.disconnect({ reason: 'Browser closed' }).catch((e) => { console.error(e) })
    }

    const onError = (e: {
      error: ExtendedInfinityErrorMessage
      errorCode: ExtendedInfinityErrorCode
    }): void => {
      setAppState(AppState.Error)
      setError(e.error)
    }

    const onAuthenticatedWithConference = (): void => {
      setAppState(AppState.Connected)
    }

    const onDisconnected = (): void => {
      setAppState(AppState.Disconnected)
    }

    const onConferenceStatus = (event: any): void => {
      if (event.id === 'main') {
        setConferenceStatus(event.status)
      }
    }

    const onLayoutUpdate = (event: any): void => {
      setLayoutStatus(event)
    }

    window.addEventListener('beforeunload', disconnectBrowserClosed)
    infinityClientSignals.onError.add(onError)
    infinityClientSignals.onDisconnected.add(onDisconnected)
    infinityClientSignals.onAuthenticatedWithConference.add(onAuthenticatedWithConference)
    infinityClientSignals.onConferenceStatus.add(onConferenceStatus)
    infinityClientSignals.onLayoutUpdate.add(onLayoutUpdate)
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
      infinityClientSignals.onError.remove(onError)
      infinityClientSignals.onDisconnected.remove(onDisconnected)
      infinityClientSignals.onAuthenticatedWithConference.remove(onAuthenticatedWithConference)
      infinityClientSignals.onConferenceStatus.remove(onConferenceStatus)
      infinityClientSignals.onLayoutUpdate.remove(onLayoutUpdate)
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
      infinityClient = createInfinityClient(infinityClientSignals, callSignals)
      await infinityClient.call({
        host: `https://${node}`,
        conferenceAlias: conference,
        displayName,
        bandwidth: 0,
        callType: ClientCallType.None,
        pin: hostPin
      })
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
                  <Conference
                    infinityClient={infinityClient}
                    conferenceStatus={conferenceStatus}
                    layoutStatus={layoutStatus}
                  />
                </Cell>
                <Cell xs={9} className='HorizontalCell'>
                  <Participants />
                </Cell>
              </Grid>
            </Wrapper>
          </>}
          {appState === AppState.Error && <ErrorPanel message={error} onClose={() => { setAppState(AppState.Disconnected) }}/>}
          {settingsOpened &&
            <Settings onClose={() => { setSettingsOpened(false) }} />
          }
        </div>
      </ThemeProvider>
    </div>
  )
}
