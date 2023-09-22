import React from 'react'

import {
  Box,
  BoxHeader,
  FontVariant,
  Icon,
  IconTypes,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContent,
  TableHead,
  TableHeadCell,
  TableRow,
  TableSection,
  Text,
  Tooltip,
  notificationToastSignal
} from '@pexip/components'

import type { InfinityClient, Participant } from '@pexip/infinity'

import './Participants.scss'

interface ParticipantsProps {
  infinityClient: InfinityClient
  participants: Participant[]
  me: Participant | undefined
}

interface Option {
  id: string
  isDisabled?: boolean | undefined
  label: string
}

enum Action {
  NoAction = 'no-action',
  Admit = 'admit',
  SetSpotlight = 'set-spotlight',
  RemoveSpotlight = 'remove-spotlight',
  LowerHand = 'lower-hand',
  MuteAudio = 'mute-audio',
  UnmuteAudio = 'unmute-audio',
  MuteVideo = 'mute-video',
  UnmuteVideo = 'unmute-video',
  MakeHost = 'make-host',
  MakeGuest = 'make-guest',
  Disconnect = 'disconnect'
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
  const createBodyCell = (content: JSX.Element | string): JSX.Element => (
    <TableCell className='TableBodyCell'>
      <Text
        variant='inherit'
        fontVariant={FontVariant.Body}
      >
        {content}
      </Text>
    </TableCell>
  )

  const createSelectCell = (participant: Participant): JSX.Element => {
    let options: Option[] = [
      {
        id: Action.NoAction,
        isDisabled: true,
        label: 'Select action'
      }
    ]

    if (participant.isWaiting) {
      options.push({
        id: Action.Admit,
        label: 'Admit'
      })
    }

    if (participant.callType === 'video') {
      options.push({
        id: participant.isSpotlight ? Action.RemoveSpotlight : Action.SetSpotlight,
        label: participant.isSpotlight ? 'Remove spotlight' : 'Spotlight'
      })
    }

    if (participant.raisedHand) {
      options.push({
        id: Action.LowerHand,
        label: 'Lower hand'
      })
    }

    if (participant.protocol !== 'api') {
      options = options.concat([{
        id: participant.isMuted ? Action.UnmuteAudio : Action.MuteAudio,
        label: participant.isMuted ? 'Unmute audio' : 'Mute audio'
      }, {
        id: participant.isCameraMuted ? Action.UnmuteVideo : Action.MuteVideo,
        label: participant.isCameraMuted ? 'Unmute video' : 'Mute video'
      }])
    }

    if (props.me != null && props.me.uuid !== participant.uuid) {
      options.push({
        id: participant.role === 'chair' ? Action.MakeGuest : Action.MakeHost,
        label: participant.role === 'chair' ? 'Make guest' : 'Make host'
      })
    }

    options.push({
      id: Action.Disconnect,
      label: 'Disconnect'
    })

    options.forEach((option) => {
      option.id = participant.uuid + '&' + option.id
    })

    return (
      <TableCell>
        <Select
          value={''}
          label={''}
          placeholder='Select action'
          onValueChange={onAction}
          options={options} />
      </TableCell>
    )
  }

  const createHeaderCell = (content: string): JSX.Element => (
    <TableCell className='TableHeadCell'>
      <TableHeadCell>
        <Text
          fontVariant={FontVariant.SmallBold}
          variant='inherit'
        >
          {content}
        </Text>
      </TableHeadCell>
    </TableCell>
  )

  const onAction = (actionInfo: string): void => {
    const [participantUuid, action] = actionInfo.split('&')
    const participant = props.participants.find((participant: Participant) => participant.uuid === participantUuid)

    if (participant == null) {
      console.error(`Cannot find the user with uuid ${participantUuid}`)
      return
    }

    switch (action) {
      case Action.Admit: {
        admit(participant)
        break
      }
      case Action.SetSpotlight: {
        const enable = true
        spotlight(participant, enable)
        break
      }
      case Action.RemoveSpotlight: {
        const enable = false
        spotlight(participant, enable)
        break
      }
      case Action.LowerHand: {
        lowerHand(participant)
        break
      }
      case Action.MuteAudio: {
        const mute = true
        toggleMuteAudio(participant, mute)
        break
      }
      case Action.UnmuteAudio: {
        const mute = false
        toggleMuteAudio(participant, mute)
        break
      }
      case Action.MuteVideo: {
        const mute = true
        toggleMuteVideo(participant, mute)
        break
      }
      case Action.UnmuteVideo: {
        const mute = false
        toggleMuteVideo(participant, mute)
        break
      }
      case Action.MakeHost: {
        const role = 'chair'
        changeRole(participant, role)
        break
      }
      case Action.MakeGuest: {
        const role = 'guest'
        changeRole(participant, role)
        break
      }
      case Action.Disconnect: {
        disconnect(participant)
        break
      }
      case Action.NoAction:
      default:
        break
    }
  }

  const admit = (participant: Participant): void => {
    props.infinityClient.admit({
      participantUuid: participant.uuid
    })
      .then(() => {
        const message = `Admitted participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const spotlight = (participant: Participant, enable: boolean): void => {
    props.infinityClient.spotlight({
      participantUuid: participant.uuid,
      enable
    })
      .then(() => {
        const message = enable
          ? `Spotlighted participant "${participant?.displayName ?? 'Unknown'}"`
          : `Removed spotlight from participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const lowerHand = (participant: Participant): void => {
    props.infinityClient.raiseHand({
      participantUuid: participant.uuid,
      raise: false
    })
      .then(() => {
        const message = `Lowered hand for participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const toggleMuteAudio = (participant: Participant, mute: boolean): void => {
    props.infinityClient.mute({
      participantUuid: participant.uuid,
      mute
    })
      .then(() => {
        const message = mute
          ? `Muted audio for participant "${participant?.displayName ?? 'Unknown'}"`
          : `Unmuted audio for participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const toggleMuteVideo = (participant: Participant, mute: boolean): void => {
    props.infinityClient.muteVideo({
      participantUuid: participant.uuid,
      muteVideo: mute
    })
      .then(() => {
        const message = mute
          ? `Muted video for participant "${participant?.displayName ?? 'Unknown'}"`
          : `Unmuted audio for participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const changeRole = (participant: Participant, role: 'chair' | 'guest'): void => {
    props.infinityClient.setRole({
      participantUuid: participant.uuid,
      role
    })
      .then(() => {
        const message = role === 'chair'
          ? `Set role to host for participant "${participant?.displayName ?? 'Unknown'}"`
          : `Set role to guest for participant "${participant?.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const disconnect = (participant: Participant): void => {
    props.infinityClient.kick({
      participantUuid: participant.uuid
    })
      .then(() => {
        const message = `Disconnected participant "${participant.displayName ?? 'Unknown'}"`
        notificationToastSignal.emit([{ message }])
      })
      .catch((e) => { console.log(e) })
  }

  const participantsRows = props.participants.map((participant) => (
    <TableRow key={participant.uuid}>
      {createBodyCell(participant.displayName ?? 'Unknown')}
      {/* {createBodyCell(<Text contentEditable={true}>{participant.}</Text>)} */}
      {createBodyCell(participant.role === 'chair' ? 'host' : 'guest')}
      {createBodyCell(participant.protocol)}
      {createBodyCell(participant.isWaiting
        ? <Tooltip text={'Waiting'}>
            <Icon source={IconTypes.IconClock} />
          </Tooltip>
        : '-'
      )}
      {createBodyCell(participant.isSpotlight
        ? <Tooltip text={'Spotlighted'}>
            <Icon source={IconTypes.IconStar} />
          </Tooltip>
        : '-'
      )}
      {createBodyCell(participant.raisedHand
        ? <Tooltip text={'Hand raised'}>
            <Icon source={IconTypes.IconRaiseHand} />
          </Tooltip>
        : '-'
      )}
      {createBodyCell(participant.isPresenting
        ? <Tooltip text={'Presentation active'}>
            <Icon source={IconTypes.IconPresentationOn} />
          </Tooltip>
        : '-'
      )}
      {createBodyCell(!['audio', 'video'].includes(participant.callType)
        ? '-'
        : participant.isMuted
          ? <Tooltip text={'Microphone Off'}>
              <Icon source={IconTypes.IconMicrophoneOff} />
            </Tooltip>
          : <Tooltip text={'Microphone On'}>
              <Icon source={IconTypes.IconMicrophoneOn} />
            </Tooltip>
      )}
      {createBodyCell(participant.callType !== 'video'
        ? '-'
        : participant.isCameraMuted
          ? <Tooltip text={'Camera Off'}>
              <Icon source={IconTypes.IconVideoOff} />
            </Tooltip>
          : <Tooltip text={'Camera On'}>
              <Icon source={IconTypes.IconVideoOn} />
            </Tooltip>
      )}
      {createSelectCell(participant)}
    </TableRow>
  ))

  return (
    <Box className='Participants' colorScheme='light'>
      <BoxHeader>
        <h3>Participants</h3>
      </BoxHeader>
      <div className='Container'>
        <Table>
          <TableContent>
            <TableSection>
              <TableHead>
                <TableRow>
                  {createHeaderCell('Display name')}
                  {/* {createHeaderCell('Overlay text')} */}
                  {createHeaderCell('Role')}
                  {createHeaderCell('Protocol')}
                  {createHeaderCell('In waiting room')}
                  {createHeaderCell('Spotlighted')}
                  {createHeaderCell('Hand raised')}
                  {createHeaderCell('Presenting')}
                  {createHeaderCell('Audio')}
                  {createHeaderCell('Video')}
                  {createHeaderCell('Actions')}
                </TableRow>
              </TableHead>
              <TableBody>
                {participantsRows}
              </TableBody>
            </TableSection>
          </TableContent>
        </Table>
      </div>
    </Box>
  )
}
