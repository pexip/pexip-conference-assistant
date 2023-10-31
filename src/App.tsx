import React, { useEffect, useState } from 'react'

import { Header } from './components/Header/Header'

import { Button, NotificationToast, Spinner, Tab, Tabs, ThemeProvider } from '@pexip/components'
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
  type ExtendedInfinityErrorMessage,
  type Participant,
  type Message
} from '@pexip/infinity'

import './App.scss'
import { ErrorPanel } from './components/ErrorPanel/ErrorPanel'
import { Chat } from './components/Chat/Chat'

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
  const [participants, setParticipants] = useState<Participant[]>([])
  const [me, setMe] = useState<Participant>()
  const [messages, setMessages] = useState<Message[]>([])

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

    const onConnected = (): void => {
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

    const onParticipants = (event: any): void => {
      if (event.id === 'main') {
        setParticipants(event.participants)
      }
    }

    const onMe = (event: any): void => {
      if (event.id === 'main') {
        setMe(event.participant)
      }
    }

    const onMessage = (message: Message): void => {
      messages.push(message)
      setMessages([...messages])
    }

    window.addEventListener('beforeunload', disconnectBrowserClosed)
    infinityClientSignals.onError.add(onError)
    infinityClientSignals.onDisconnected.add(onDisconnected)
    infinityClientSignals.onConnected.add(onConnected)
    infinityClientSignals.onConferenceStatus.add(onConferenceStatus)
    infinityClientSignals.onLayoutUpdate.add(onLayoutUpdate)
    infinityClientSignals.onParticipants.add(onParticipants)
    infinityClientSignals.onMe.add(onMe)
    infinityClientSignals.onMessage.add(onMessage)
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
      infinityClientSignals.onError.remove(onError)
      infinityClientSignals.onDisconnected.remove(onDisconnected)
      infinityClientSignals.onConnected.remove(onConnected)
      infinityClientSignals.onConferenceStatus.remove(onConferenceStatus)
      infinityClientSignals.onLayoutUpdate.remove(onLayoutUpdate)
      infinityClientSignals.onParticipants.remove(onParticipants)
      infinityClientSignals.onMe.remove(onMe)
      infinityClientSignals.onMessage.remove(onMessage)
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
        <NotificationToast timeout={3000} position='topCenter' />
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
            <div className='NotConnected'>
              <h2>Not connected to conference</h2>
              <Button onClick={() => { connect().catch((e) => { console.error(e) }) }} colorScheme='dark'>Connect</Button>
            </div>
          }
          {appState === AppState.Connecting && <Spinner colorScheme='dark' className='Connecting' />}
          {appState === AppState.Connected &&
            <div className='Connected'>
              <Tabs className='Tabs'>
                <Tab title='Chat'>
                  <Chat messages={messages}/>
                </Tab>
                <Tab title='Participants'>
                  <Participants
                    infinityClient={infinityClient}
                    participants={participants}
                    me={me}
                  />
                </Tab>
                <Tab title='Layout'>
                <Conference
                    infinityClient={infinityClient}
                    conferenceStatus={conferenceStatus}
                    layoutStatus={layoutStatus}
                  />
                </Tab>
              </Tabs>
            </div>
          }
          {appState === AppState.Error && <ErrorPanel message={error} onClose={() => { setAppState(AppState.Disconnected) }}/>}
          {settingsOpened &&
            <Settings onClose={() => { setSettingsOpened(false) }} />
          }
        </div>
      </ThemeProvider>
    </div>
  )
}
