import React from 'react'

import { Button, Modal, ModalCloseButton } from '@pexip/components'

interface ErrorProps {
  message: string
  onClose: () => void
}

export const Error = (props: ErrorProps): JSX.Element => {
  return (
    <Modal isOpen={true} className='Settings'>
      <ModalCloseButton className='CloseButton' onClose={props.onClose}/>
      <h3>Error</h3>
      { props.message }
      <Button onClick={props.onClose}>Close</Button>
    </Modal>
  )
}
