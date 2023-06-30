import React from 'react'
import './teamScreenMembersContainer.scss'
import TeamScreenDisplayMembers from './teamScreenDisplayMembers/teamScreenDisplayMembers'
import { HiOutlinePlusSm } from 'react-icons/hi'
const TeamScreenMembersContainer = ({members}) => {
  return (
    <>
    <div className='team-screen-members-container'>
        <TeamScreenDisplayMembers 
        members={members}  
        />
    </div>
    </>
  )
}

export default TeamScreenMembersContainer