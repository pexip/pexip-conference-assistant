import React from 'react'

import { Box, Button, Input, Select } from '@pexip/components'

export const Conference = (): JSX.Element => {
  return (
    <Box className='Conference' colorScheme='light'>
      <h3>Conference</h3>
      <Select
        value={''}
        label={''}
        onValueChange={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
        options={[]}
      />
      <Select
        value={''}
        label={''}
        onValueChange={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
        options={[]}
      />
      <Button id='muteAllGuestsAudioButton' className='button secondary'>Mute All Guests</Button>
      <Button id='unmuteAllGuestsAudioButton' className='button primary'>Unmute All Guests</Button>

      <Select
        value={''}
        label={''}
        onValueChange={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
        options={[]}
      />
      <Select
        value={''}
        label={''}
        onValueChange={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
        options={[]}
      />
      <Button id='applyConferenceButton' className='button information'>Apply</Button>
      <Input id='dialOutInput' name='text' className='textInput' placeholder='Dialout URI' label={''} />
    </Box>
  )
}
