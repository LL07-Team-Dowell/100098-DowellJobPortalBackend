// styles
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import './teamScreenTaskProgress.scss'

// react
import React from 'react'
const TeamScreenTaskProgress = () => {
  const { currentUser } = useCurrentUserContext();
  console.log({currentUser})
  return (
    <div className='team-screen-task-progress'>
      <div className='team-screen-task-progress-welcome'>
        <h2>Hi,Welcome {currentUser.portfolio_info[0].username} !</h2>
        <p>See your team progress</p>
      </div>
      <div className='team-screen-task-progress-data'>
          <div className='team-screen-task-progress-data-circle'>
            <span>00%</span>
          </div>
          <p>your progress</p>
      </div>
    </div>
  )
}

export default TeamScreenTaskProgress