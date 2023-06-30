import React from 'react'

const TeamScreenMember = ({name, position}) => {
  return (
    <div>
        <div>
            {name[0]}
        </div>
        <div>
            <h6>{name}</h6>
            <p>{position}</p>
        </div>
    </div>
  )
}

export default TeamScreenMember