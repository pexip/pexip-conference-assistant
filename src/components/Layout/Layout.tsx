import { Box } from '@pexip/components'
import React from 'react'

import './Layout.scss'

export const Layout = (): JSX.Element => {
  return (
    <Box className='Layout'>
      <h2>Layout Override</h2>
      <select id='overrideLayoutList' className='button' title='Override Layout List'></select>
      <div>Overlay Text:</div><select id='showPositionsInput' className='button'>
        <option value='off'>Off</option>
        <option value='auto'>Show Overlay</option>
        <option selected value='positional'>Show Positions</option>
      </select>

      <div>+N Indicator:</div><select id='showPlusIndicatorInput' className='button'>
        <option value='auto'>On</option>
        <option value='off'>Off</option>
      </select>

      <div>Indicators:</div><select id='showOverrideIndicatorInput' className='button'>
        <option value='auto'>On</option>
        <option value='off'>Off</option>
      </select>

      {/* <input id='includeSelfInput' type='checkbox' title='Remove Self'>Show Self</input>
      <input id='vadBackfillInput' type='checkbox' title='VAD Backfill'>Actors Only</input> */}

      <button id='addSelfVideoButton' className='button primary' onClick={() => {}}>Get Participants</button>
      <button id='addSelfVideoButton' className='button primary' onClick={() => {}}>Get Stage</button>
      <button id='addSelfVideoButton' className='button secondary' onClick={() => {}}>Layout Override</button>
      <div id='customLayoutParticipants'>
      <ul id='sortlist' className='slist'></ul>
      </div>
      <p><small>Drag to re-order, right click to delete</small></p>
    </Box>
  )
}
