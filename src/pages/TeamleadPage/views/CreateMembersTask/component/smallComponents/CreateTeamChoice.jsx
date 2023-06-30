import React from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'

const CreateTeamChoice = ({settask}) => {
  return (
    <div className='create_team_parent'>
                <div className='Create_Team' onClick={() => settask({ choosed: true, value: 'new Team' })}>
                  <div>
                    <div>
                      <AiOutlinePlusCircle className='icon' />
                    </div>
                    <h4>Create a Team</h4>
                    <p>
                      Bring everyone together and get to work. Work together in team to increase productivity
                    </p>
                  </div>
                </div>
                <div className='Existing_Team' onClick={() => settask({ choosed: true, value: 'existing Team' })}>
                  <div>
                    <div>
                      <AiOutlinePlusCircle className='icon' />
                    </div>
                    <h4>Use an existing Team</h4>
                    <p>
                      Bring everyone together and get to work. Work together in team to increase productivity
                    </p>
                  </div>
                </div>
              </div>
  )
}

export default CreateTeamChoice