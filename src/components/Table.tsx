import React from 'react'

export const Table = (): JSX.Element => {
  return (
    <div className='Table'>
      <div hidden id='tableContainerDiv' className='tableContainerDiv'>
      <hr />
      <label>Search:</label>
      <input type='text' className='textInput' id='searchTableInput' onKeyUp={() => {}} placeholder='Filter Name...' title='Type in a name' />
      <table id='table' className='styled-table'>
            <thead>
                <tr id='tableHeader'>
            <th hidden data-type='string'>uuid</th>
                  <th data-type='string'>Name</th>
                  <th data-type='string'>OverlayText</th>
                  <th hidden data-type='string'>Alias</th>
            <th data-type='string' title='Call Direction - IN /OUT'></th>
                  <th data-type='string'>Type</th>
                  <th data-type='string'>JoinTime</th>
                  <th hidden data-type='string'>Room</th>
                  <th hidden data-type='string'>Ctag</th>
                  <th className='center' data-type='string' title='Host or Guest'><i className='fa-solid fa-user-tie'></i></th>
                  <th className='center' title='Call type - api|browser|sip'><i className='fa-solid fa-tv'></i></th>
                  <th className='center' data-type='string' title='Has Encryption enabled'><i className='fa-solid fa-shield-halved '></i></th>
                  <th className='center' data-type='string' title='Has audio capability'><i className='fa-solid fa-microphone'></i></th>
                  <th className='center' data-type='string' title='Has video capability'><i className='fa-solid fa-video'></i></th>
                  <th className='center' data-type='string' title='Has FECC capability'><i className='fa-solid fa-up-down-left-right'></i></th>
                  <th className='center' data-type='string' title='Spotlight'><i className='fa-solid fa-crosshairs'></i></th>
            <th className='center' data-type='string' title='Raise Hand'><i className='fa-regular fa-hand'></i></th>
            <th className='center' data-type='string' title='Is Presenting'><i className='fa-solid fa-chart-line'></i></th>
                </tr>
            </thead>
          <tbody id='data-output'></tbody>
        </table>
      </div>
    </div>
  )
}
