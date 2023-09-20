import React from 'react'

import { Button, Modal, ModalCloseButton } from '@pexip/components'

import './ErrorPanel.scss'

interface ErrorProps {
  message: string
  onClose: () => void
}

export const ErrorPanel = (props: ErrorProps): JSX.Element => {
  return (
    <Modal isOpen={true} className='ErrorPanel' sizeModifier='compact'>
      <ModalCloseButton className='CloseButton' onClose={props.onClose}/>
      <h2>Error</h2>
      <div className='InputContainer'>
        { props.message }
      </div>
      <div className='ButtonContainer'>
        <Button onClick={props.onClose}>Close</Button>
      </div>
    </Modal>
  )
}
