import React from 'react'
import TeamScreenDisplaySingleMember from './teamScreenDisplaySingleMember/teamScreenDisplaySingleMember'
import './teamScreenDisplayMembers.scss'
const TeamScreenDisplayMembers = ({members}) => {
  console.log(members)
  return (
    <div className='team-screen-display-members'>
    {
        members.map(member => <TeamScreenDisplaySingleMember member={member}/>)
    }
    </div>
  )
}

export default TeamScreenDisplayMembers