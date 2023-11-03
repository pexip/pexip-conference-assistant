import React, { useEffect, useState } from 'react'

import { NotificationToast, Spinner, Tab, Tabs, ThemeProvider } from '@pexip/components'
import { Participants } from './components/Participants/Participants'
import { ConnectForm } from './components/ConnectForm/ConnectForm'
import {
  type InfinityClient,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type ExtendedInfinityErrorCode,
  type ExtendedInfinityErrorMessage,
  type Participant,
  type Message,
  type LayoutEvent
} from '@pexip/infinity'

import { ErrorPanel } from './components/ErrorPanel/ErrorPanel'
import { Chat } from './components/Chat/Chat'
import { LayoutSelector } from './components/LayoutSelector/LayoutSelector'
import { RaiseHandButton } from './components/RaiseHandButton/RaiseHandButton'

import './App.scss'

enum AppState {
  Disconnected,
  Connecting,
  Connected,
  Error
}

const infinityClientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])

export const App = (): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppState.Disconnected)
  const [error, setError] = useState('')
  const [layoutStatus, setLayoutStatus] = useState<LayoutEvent>()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [me, setMe] = useState<Participant>()
  const [messages, setMessages] = useState<Message[]>([])
  const [infinityClient, setInfinityClient] = useState<InfinityClient>()

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
      // setConferenceStatus(event.status)
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

  useEffect(() => {
    window.addEventListener('beforeunload', disconnectBrowserClosed)
    infinityClientSignals.onError.add(onError)
    infinityClientSignals.onDisconnected.add(onDisconnected)
    infinityClientSignals.onConnected.add(onConnected)
    infinityClientSignals.onConferenceStatus.add(onConferenceStatus)
    infinityClientSignals.onLayoutUpdate.add(onLayoutUpdate)
    infinityClientSignals.onParticipants.add(onParticipants)
    infinityClientSignals.onMe.add(onMe)
    infinityClientSignals.onMessage.add(onMessage)

    setInfinityClient(createInfinityClient(infinityClientSignals, callSignals))

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

  return (
    <div className='App'>
      <ThemeProvider colorScheme='light'>
        <NotificationToast timeout={3000} position='topCenter' />

        {infinityClient != null &&
          <div className='Container'>

            {appState === AppState.Disconnected &&
              <div className='NotConnected'>
                <ConnectForm
                  infinityClient={infinityClient}
                  onConnecting={() => { setAppState(AppState.Connecting) }}
                  onConnected={() => { setAppState(AppState.Connected) }}
                />
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
                      onDisconnected={() => {
                        setAppState(AppState.Disconnected)
                        setMessages([])
                      }}
                    />
                  </Tab>
                  <Tab title='Layout'>
                    <LayoutSelector infinityClient={infinityClient} layoutStatus={layoutStatus}/>
                  </Tab>
                </Tabs>
                <RaiseHandButton infinityClient={infinityClient} me={me}/>
              </div>
            }
            {appState === AppState.Error && <ErrorPanel message={error} onClose={() => { setAppState(AppState.Disconnected) }}/>}
          </div>
        }
      </ThemeProvider>
    </div>
  )
}
