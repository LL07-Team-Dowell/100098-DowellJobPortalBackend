import React from 'react'
import './teamScreenDisplaySingleMember.scss'

const TeamScreenDisplaySingleMember = ({member, allUserFullNameList}) => {
  return (
    <>
    <div className='team-screen-display-single-member'>
        <div className='logo-member-name'>
          {
            allUserFullNameList?.find(user => user.username === member) ?
              allUserFullNameList?.find(user => user.username === member)?.applicant[0] 
            :
            member[0]
          }
        </div>
        <div>
          <p>
            {
              allUserFullNameList?.find(user => user.username === member) ?
                allUserFullNameList?.find(user => user.username === member)?.applicant
              :
              member
            } ({member})
          </p>
        </div>
    </div>
    <hr />
    </>
  )
}

export default TeamScreenDisplaySingleMember