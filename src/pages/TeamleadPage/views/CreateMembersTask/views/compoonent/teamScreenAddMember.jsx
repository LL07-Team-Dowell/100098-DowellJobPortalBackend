import React, { useState } from 'react'
import Checkbox from '../../component/Checkbox'

const TeamScreenAddMember = ({membersTeam}) => {
    const [newMembers , setnewMembers] = useState([]) ; 
    const allMembers = ['boxboy','ayo','sagar','isaac','Hardic','akram','manish']
  const userIsThere = (user) => allMembers.find(member => member === member)

  return (
    <div className='team-screen-add-member-popup'>
        <div className='checkboxes'>
              {allMembers.map((member, i) => (
                <Checkbox
                membersEditTeam={member}
                Member={allMembers}
                data={newMembers}
                setdata={setnewMembers}
                key={i}
              />
              ))}
            </div>
    </div>
  )
}

export default TeamScreenAddMember