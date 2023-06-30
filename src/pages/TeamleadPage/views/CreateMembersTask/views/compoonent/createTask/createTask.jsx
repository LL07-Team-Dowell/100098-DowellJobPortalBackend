import React, { useState } from 'react'
import './createTask.scss'
import { useValues } from '../../../context/Values';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { createTeam, createTeamTask } from '../../../../../../../services/createMembersTasks';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
const CreateTask = ({id,members,team,unShowCreateTask}) => {
     // USER
  const { currentUser } = useCurrentUserContext();
  const [name , setname] = useState(""); 
  const [discription, setdiscription] = useState("") ;
  // DATA
  const { data, setdata } = useValues();
  // States
  const [showCard, setshowCard] = useState(false);
  const [toggleCheckboxes, settoggleCheckboxes] = useState(false);
  // Navigate 
  const navigate = useNavigate()
  // FUNCTIONS
  const changeTeamName = (e) => {
    setname( e.target.value );
  };
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setdata({ ...data, selected_members: [...data.selected_members, value] });
};
  const createTeamSubmit = () => {
    console.log({team:team.team_name})
    
        createTeamTask({
            "task_id": new Date().toString(),
            "title": name,
            "description": discription,
            "assignee": "boxboy",
            "completed": true,
            "team_name": team.team_name
      })
      // RESPONSE
      .then(resp => {
        console.log(resp)
        toast.success("task created successfully");
        unShowCreateTask()
      })
      // ERROR
      .catch(err => {
        console.log(err)
      })
   
    
  }
  const userIsThere = (user) => data.selected_members.find(newUser => newUser === user)
  return (
    <div className='create_your_team' style={{ position: 'absolute', top: '20%', left: '20%', background: 'white', padding: 20 }} tabIndex={0}  >
          <h2 className=''>Create Your Team</h2>
          <label htmlFor='team_name'>Task Name</label>
          <input
            type='text'
            id='team_name'
            className=''
            placeholder='Choose a Team Name'
            onChange={changeTeamName}
          />
          <br />
          <label htmlFor='team_description'>Task Description</label>
          <textarea
            type='text'
            id='team_description'
            className=''
            placeholder='Choose a Team Name'
            rows={10}
            onChange={e=>setdiscription(e.target.value)}
          />
          <br />
       
          <div className="buttons">
            <button onClick={createTeamSubmit}>Next</button>
            <button onClick={unShowCreateTask}>Cancel</button>
          </div>
        </div>
  )
}

export default CreateTask