import React, { useEffect, useState } from 'react'

import type { InfinityClient, Participant } from '@pexip/infinity'

import './ParticipantDetails.scss'
import { IconTypes, Modal, ModalCloseButton } from '@pexip/components'
import { ParticipantDetailsButton } from './ParticipantDetailsButton/ParticipantDetailsButton'

interface ParticipantDetailsProps {
  infinityClient: InfinityClient
  participant: Participant
  onClose: () => void
}

export const ParticipantDetails = (props: ParticipantDetailsProps): JSX.Element => {
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [raisedHand, setRaisedHand] = useState(false)
  const [spotlight, setSpotlight] = useState(false)

  const handleMuteAudio = (): void => {
    props.infinityClient.mute({
      participantUuid: props.participant.uuid,
      mute: !props.participant.isMuted
    }).catch((e) => { console.error(e) })
    setAudioMuted(!audioMuted)
  }

  const handleMuteVideo = (): void => {
    props.infinityClient.muteVideo({
      participantUuid: props.participant.uuid,
      muteVideo: !props.participant.isCameraMuted
    }).catch((e) => { console.error(e) })
    setVideoMuted(!videoMuted)
  }

  const handleLowerHand = (): void => {
    props.infinityClient.raiseHand({
      participantUuid: props.participant.uuid,
      raise: false
    }).catch((e) => { console.error(e) })
    setRaisedHand(false)
  }

  const handleSpotlight = (): void => {
    props.infinityClient.spotlight({
      participantUuid: props.participant.uuid,
      enable: !spotlight
    }).catch((e) => { console.error(e) })
    setSpotlight(!spotlight)
  }

  const handleDisconnect = (): void => {
    props.infinityClient.kick({
      participantUuid: props.participant.uuid
    }).catch((e) => { console.error(e) })
  }

  useEffect(() => {
    setAudioMuted(props.participant.isMuted)
    setVideoMuted(props.participant.isCameraMuted)
    setRaisedHand(props.participant.raisedHand)
    setSpotlight(props.participant.isSpotlight)
  }, [props.participant])

  return (
    <Modal isOpen={true} className='ParticipantDetails' colorScheme='dark' onClose={props.onClose}>
      <ModalCloseButton className='CloseButton' onClose={props.onClose}/>
      <h2>{props.participant.displayName}</h2>

      <ParticipantDetailsButton
        label={`${audioMuted ? 'Unmuted' : 'Mute'} audio`}
        icon={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn}
        onClick={handleMuteAudio}
      />

      <ParticipantDetailsButton
        label={`${videoMuted ? 'Unmuted' : 'Mute'} video`}
        icon={videoMuted ? IconTypes.IconVideoOff : IconTypes.IconVideoOn}
        onClick={handleMuteVideo}
      />

      {raisedHand && <ParticipantDetailsButton label='Lower hand' icon={IconTypes.IconRaiseHand} onClick={handleLowerHand} />}

      <ParticipantDetailsButton
        label={spotlight ? 'Disable Spotlight' : 'Enable Spotlight'}
        icon={IconTypes.IconStar}
        onClick={handleSpotlight}
      />

      <ParticipantDetailsButton label='Disconnect' icon={IconTypes.IconClose} onClick={handleDisconnect} color={'#FF8586'} />
    </Modal>
  )
}
