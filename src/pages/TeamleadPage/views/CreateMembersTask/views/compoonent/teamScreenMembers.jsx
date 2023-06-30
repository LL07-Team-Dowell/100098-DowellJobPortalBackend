import React from 'react'
import TeamScreenMember from '../TeamScreenMember'

const TeamScreenMembers = ({members}) => {
  return (
    <div>
        {members.map(member => <TeamScreenMember {...member}/>)}
    </div>
  )
}

export default TeamScreenMembers