import React from 'react'
import './teamScreenMembersContainer.scss'
import TeamScreenDisplayMembers from './teamScreenDisplayMembers/teamScreenDisplayMembers'
import { HiOutlinePlusSm } from 'react-icons/hi'
const TeamScreenMembersContainer = ({members, allUserFullNameList}) => {
  return (
    <>
    <div className='team-screen-members-container'>
        <TeamScreenDisplayMembers 
          members={members}  
          allUserFullNameList={allUserFullNameList}
        />
    </div>
    </>
  )
}

export default TeamScreenMembersContainer