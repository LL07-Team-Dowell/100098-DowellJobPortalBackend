import React from 'react'
import TeamScreenDisplaySingleMember from './teamScreenDisplaySingleMember/teamScreenDisplaySingleMember'
import './teamScreenDisplayMembers.scss'
const TeamScreenDisplayMembers = ({members}) => {
  console.log(members)
  return (
    <div className='team-screen-display-members'>
    {
      members !== undefined ?  members.map(member => <TeamScreenDisplaySingleMember member={member}/>) : null
    }
    </div>
  )
}

export default TeamScreenDisplayMembers