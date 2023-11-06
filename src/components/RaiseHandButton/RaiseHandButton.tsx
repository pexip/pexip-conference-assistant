import React, { useEffect, useState } from 'react'

import { Button, Icon, IconTypes } from '@pexip/components'
import type { InfinityClient, Participant } from '@pexip/infinity'

import './RaiseHandButton.scss'

interface RaiseHandButtonProps {
  infinityClient: InfinityClient
  me?: Participant
}

export const RaiseHandButton = (props: RaiseHandButtonProps): JSX.Element => {
  const [raisedHand, setRaisedHand] = useState<boolean>(false)

  useEffect(() => {
    setRaisedHand(props.me?.raisedHand ?? raisedHand)
  }, [props.me])

  const handleOnClick = (): void => {
    setRaisedHand(!raisedHand)
    props.infinityClient.raiseHand({ raise: !raisedHand }).catch((e) => { console.error(e) })
  }

  const classes = ['RaiseHandButton']

  if (raisedHand) {
    classes.push('selected')
  }

  return (
    <Button className={classes.join(' ')} onClick={handleOnClick}>
      <Icon source={IconTypes.IconRaiseHand} />
      <span className='RaiseHandText'>{raisedHand ? 'Lower' : 'Raise'} hand</span>
    </Button>
  )
}
