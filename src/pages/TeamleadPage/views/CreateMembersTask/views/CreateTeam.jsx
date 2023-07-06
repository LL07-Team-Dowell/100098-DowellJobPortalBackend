import React, { useState } from 'react';
import { AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai';
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { createTeam, getAllTeams } from '../../../../../services/createMembersTasks';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
const CreateTeam = () => {
  // USER
  const { currentUser } = useCurrentUserContext();
  // DATA
  const { data, setdata } = useValues();
  // States
  const [showCard, setshowCard] = useState(false);
  const [toggleCheckboxes, settoggleCheckboxes] = useState(false);
  // Navigate 
  const navigate = useNavigate()
  // FUNCTIONS
  const changeTeamName = (e) => {
    setdata({ ...data, team_name: e.target.value });
  };
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setdata({ ...data, selected_members: [...data.selected_members, value] });
};
  const createTeamSubmit = () => {
    if(data.team_name.length > 0  && data.selected_members.length > 0){

      createTeam({
        team_name:data.team_name,
        company_id:currentUser.portfolio_info[0].org_id,
        members:data.selected_members
      })
      // RESPONSE
      .then(resp => {
        console.log(resp)
        // navigate(`/team-screen-member/${resp.data.response.inserted_id}`)
        getAllTeams(currentUser.portfolio_info[0].org_id)
          .then(resp => {
            const id = resp.data.response.data.find(team => team.team_name === data.team_name)._id
            console.log({id})
            navigate(`/team-screen-member/${id}/team-tasks`)
          })
      })
      // ERROR
      .catch(err => {
        console.log(err)
      })
    }else{
      console.log( data.team_name.length > 0  && data.selected_members.length > 0 )
    }
    
  }

  const userIsThere = (user) => data.selected_members.find(newUser => newUser === user)
  return (
    <>
    <Navbar title=" Create Team" removeButton={true}/> 
    <div className='container' style={{ position: 'relative' }}>
      
      <div style={{marginTop:30}} className=' Create_Team' onClick={() => { setshowCard(true) }}>
        <div>
          <div>
            <AiOutlinePlusCircle className='icon' />
          </div>
          <h4>Create a Team</h4>
          <p>
            Bring everyone together and get to work. Work together in a team to increase productivity.
          </p>
        </div>
      </div>

      {showCard ? (
        <div className='overlay' >
        <div className='create_your_team  ' tabIndex={0}  >
          <button className='create_your_team-remove-btn' onClick={() => { setshowCard(false) }}><AiOutlineClose/></button>
          <h2 className=''>Create Your Team</h2>
          <label htmlFor='team_name'>Team Name</label>
          <input
            type='text'
            id='team_name'
            className=''
            placeholder='Choose a Team Name'
            onChange={changeTeamName}
          />
          <br />
          <label htmlFor='team_description'>Team Description</label>
          <textarea
            type='text'
            id='team_description'
            className=''
            placeholder='Choose a Team Name'
            rows={10}
            onChange={e=>setdata({...data,teamDiscription:e.target.value})}
          />
          <br />
          <label htmlFor=''>Add Member</label>
          <div
            className='add_member_input'
            onClick={() => settoggleCheckboxes(!toggleCheckboxes)}
          >
            <p>Choose team members</p>
            <AiOutlinePlusCircle className='icon' />
          </div>
          <br />
          {toggleCheckboxes ? (
            <div className='checkboxes'>
              {data.memebers.map((member, i) => (
                <div key={i}>
                  <input
                    type='checkbox'
                    value={member}
                    onChange={handleCheckboxChange}
                    checked={userIsThere(member) !== undefined ? true : false}
                  />
                  <span>{member}</span>
                </div>
              ))}
            </div>
          ) : null}
          <br />
          <div className="buttons">
            <button onClick={()=>setshowCard(false)}>Cancel</button>
            <button onClick={createTeamSubmit}>Next</button>
          </div>
        </div>
        </div>
      ) : null}
    </div>
    </>
  );
};

export default CreateTeam;
