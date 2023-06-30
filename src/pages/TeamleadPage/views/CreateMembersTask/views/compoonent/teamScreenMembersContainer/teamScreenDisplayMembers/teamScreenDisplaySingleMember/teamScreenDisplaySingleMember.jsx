import React from 'react'
import './teamScreenDisplaySingleMember.scss'
const TeamScreenDisplaySingleMember = ({member}) => {
  return (
    <>
    <div className='team-screen-display-single-member'>
        <div className='logo-member-name'>{member[0]}</div>
        <div>
            <p>{member}</p>
        </div>
    </div>
    <hr />
    </>
  )
}

export default TeamScreenDisplaySingleMember