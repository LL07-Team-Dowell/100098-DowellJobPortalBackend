import React, { useEffect, useState } from 'react'
import './createTask.scss'
import { useValues } from '../../../context/Values';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { createTeam, createTeamTask } from '../../../../../../../services/createMembersTasks';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axios from 'axios';
const CreateTask = ({id,members,team,unShowCreateTask}) => {
     // USER
  const { currentUser } = useCurrentUserContext();
  // DATA
  const { data, setdata } = useValues();
  // States
  const [name , setname] = useState(""); 
  const [description, setdiscription] = useState("") ;
    const [singleTask, setSingleTask] = useState(false);
    const [choosed, setchoosed]= useState(false); 
    const [taskMembers, setTaskMembers] = useState([]); 

  const createSingleMemberTask = () => {
    axios
      .post('https://100098.pythonanywhere.com/task_management/create_task/', {
        project: [name],
        applicant: taskMembers[0],
        task: name,
        task_added_by: currentUser.userinfo.username,
        company_id: currentUser.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        task_created_date: new Date().toString(),
      })
      .then((resp) => {
        toast.success('Task created');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createTeamSubmit = () => {
    if(name && description && taskMembers.length > 0){
        axios.post('https://100098.pythonanywhere.com/create_task/',{
            "project": [name],
            "applicant": taskMembers,
            "task": name,
            "task_added_by": currentUser.userinfo.username,
            "data_type": currentUser.portfolio_info[0].data_type,
            "company_id": currentUser.portfolio_info[0].org_id,
            "task_created_date": new Date().toString()
      })
      // RESPONSE
      .then(resp => {
        console.log(resp)
        toast.success("task created successfully");
        unShowCreateTask()
      })
      // ERROR
      .catch(err => {
        toast.error("task error");
        console.log(err)
      })
    }else{
      toast.error("Complete all fields before submitting")
    }
  }
  const handleSubmitData = () => {
    if(name && description && taskMembers.length > 0){
      if(singleTask){
        createSingleMemberTask()
      }else{
        createTeamSubmit()
      }
    }else{
      toast.error("Complete all fields before submitting")
    }
  }
  const userIsThere = (user) => taskMembers.includes(user);
  const emptyTaskMembers = () => setTaskMembers(p => []) ;
  const addSingleMember = (member) => setTaskMembers([member]) ; 
  const addMembers = (member) => setTaskMembers(p => [...p,member]) ; 
  const removeMember = (member) => setTaskMembers(p => p.filter(filteredMember => filteredMember !== member )) ; 
  console.log({singleTask})
  useEffect(()=>{
    setTaskMembers([])
  },[singleTask])
  return (
    <div className='overlay'>
    <div className='create-new-task' tabIndex={0}>
          <h2 className=''>Create New Task</h2>
          <label htmlFor='task_name'>Task Name</label>
          <input
            type='text'
            id='task_name'
            className=''
            placeholder='Choose a Team Name'
            value={name}
            onChange={(e)=> setname(e.target.value)}
          />
          <br />
          <label htmlFor='task_description'>Task Description</label>
          <textarea
            type='text'
            id='team_description'
            className=''
            placeholder='Choose a Team Name'
            rows={10}
            value={description}
            onChange={(e)=> setdiscription(e.target.value)}
          />
          <br />
          {/*  */}
          {
            name && description ? 
            <div>
              <label>Task Type</label>
            <div>
            <div className='task-type'>
            <div>
            <p >single Task</p>
            <input
              id='single_task'
              type="radio"
              checked={singleTask && choosed}
              onChange={()=>{setSingleTask(true);setchoosed(true);setTaskMembers([])}}
            />
            </div>
            <div>
        <p>Team Task</p>
          <input
            id='team_task'
            type="radio"
            checked={!singleTask && choosed}
            onChange={()=>{setSingleTask(false);setchoosed(true);setTaskMembers([])}}
          />
          </div>
          </div>
          {/* more condition  */}
          {
            singleTask && choosed && name && description  ? 
            // single Task
            <>
            <label>Task Members</label>
            <div className='create-new-task-member-container'>
              {
                members.map((member => <div>
                 <div> <input
                id='team_task'
                type="radio"
                checked={userIsThere(member)}
                onChange={()=>{userIsThere(member) ?emptyTaskMembers()  :addSingleMember(member) }}
          />
                  <p>{member}</p>
                </div>
                </div>))
              }
            </div>
            </>
            :
            // team task
            <>
             { choosed && name && description && <>
                <label>Task Members</label>
            <div  className='create-new-task-member-container'>
               { members.map((member => <div>
                 <div> <input
                id='team_task'
                type="checkbox"
                checked={userIsThere(member)}
                onChange={()=>{userIsThere(member) ? removeMember(member)  : addMembers(member)}}
                  />
                  <p>{member}</p>
                </div>
                </div>))}
              
            </div></>}
            </>
          }
      </div>
            </div>
            :
            null
          }
          <div className="buttons">
            <button onClick={createTeamSubmit}>submit</button>
            <button onClick={unShowCreateTask}>Cancel</button>
          </div>
        </div>
        </div>
  )
}

export default CreateTask