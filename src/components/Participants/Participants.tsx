import React from 'react'

import { Box, BoxHeader, FontVariant, Table, TableCell, TableContent, TableHead, TableHeadCell, TableRow, TableSection, Text } from '@pexip/components'

import './Participants.scss'

export const Participants = (): JSX.Element => {
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
                  <TableCell>
                    <TableHeadCell>
                      <Text
                        fontVariant={FontVariant.SmallBold}
                        variant='inherit'
                      >
                        Participant
                      </Text>
                    </TableHeadCell>
                  </TableCell>
                </TableRow>
              </TableHead>
            </TableSection>
          </TableContent>
        </Table>
      </div>
    </Box>
  )
}
