import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ThreadItem from './ThreadItem';

const TeamThread = ({ title = "Team Treads", color }) => {
  const navigate = useNavigate()
  return (<>
    <div className='create-new-team-header'>
      <div>
        <div>
          <button className='back' onClick={() => navigate(-1)}><MdOutlineArrowBackIosNew /></button>
          {title !== undefined && <h1 style={{ color: color ? color : '#000' }}>{title}</h1>}
        </div>
      </div>
    </div>

    <div className="create-new-team-header">
      <ThreadItem />
    </div>
  </>
  )
}


export default TeamThread;
