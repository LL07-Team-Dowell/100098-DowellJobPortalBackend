import React, { useState } from 'react';
import { AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai';
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { createTeam, getAllTeams } from '../../../../../services/createMembersTasks';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import { teamManagementProductName } from '../../../../../utils/utils';
import { toast } from 'react-toastify';
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
console.log({data})

  const createTeamSubmit = () => {
    if(data.team_name.length > 0  && data.selected_members.length > 0 && data.teamDiscription){

      createTeam({
        team_name:data.team_name,
        team_description:data.teamDiscription,
        company_id:currentUser.portfolio_info[0].org_id,
        members:data.selected_members,
      })
      .then(resp => {
        navigate(`/team-screen-member/${resp.data.response.inserted_id}/team-tasks`)
        setdata({...data, TeamsSelected:{...data.TeamsSelected,team_name:data.team_name,_id:resp.data.response.inserted_id }})
        toast.success("team created successfully !")
      }
        
        )
      .catch(err => {
        console.log(err)}
      )
    }else{
      toast.error('some data are missing fill all the inputs')
    }
    
  }

  const userIsThere = (user) => data.selected_members.find(newUser => newUser === user)
  return (
    <>
    <Navbar title=" Create Team" color={'#005734'} removeButton={true}/> 
    <div className='container' style={{ position: 'relative' }}>
      
      <div style={{marginTop:30}} className=' Create_Team' onClick={() => { setshowCard(true) }}>
        <div>
          <div>
            <AiOutlinePlusCircle className='icon' style={{fontSize:"2rem"}} />
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
            <button onClick={createTeamSubmit}>Create</button>
            <button onClick={()=>setshowCard(false)}>Cancel</button>
          </div>
        </div>
        </div>
      ) : null}
    </div>
    </>
  );
};

export default CreateTeam;
