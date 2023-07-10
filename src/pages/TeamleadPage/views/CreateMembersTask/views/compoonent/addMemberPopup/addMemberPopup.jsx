import React, { useState } from 'react'
import './addMemberPopup.scss'
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { EditTeam } from '../../../../../../../services/createMembersTasks';
import { toast } from 'react-toastify';

const returnMissingMember = (bigMember,smallMember) => {
    let data = bigMember
    smallMember.forEach(element => {
      data =data.filter(e => e !== element)
    });
    return data
}

const AddMemberPopup = ({bigMember,  members,team_name, setmembers ,close, setTeamName,getElementToTeamState}) => {
  const { currentUser } = useCurrentUserContext();
    const [addedMembers , setAddedMembers] = useState(members); 
    const [name, setname] = useState(team_name) ;
    const userIsThere = (user) => addedMembers.includes(user);
    const addMembers = (member) => setAddedMembers(p => [...p,member]) ; 
  const removeMember = (member) => setAddedMembers(p => p.filter(filteredMember => filteredMember !== member )) ; 
    
       
      const EditTeamFunction = () => {
        if(name && addedMembers.length > 0)
        EditTeam(currentUser.portfolio_info[0].org_id,{team_name,members:[...members ,...addedMembers]})
          .then(resp => {
            console.log(resp);
            getElementToTeamState(name,addedMembers)
            toast.success("Edit Team Successfully");
            close()
          })
          .catch(err => {
            console.log(err)
          })
        else{
          toast.error("an input/s haven't displayed")
        }
      }
      return (
      <div className='overlay'>
      <div className='add-member-popup' style={{zIndex:100}}>
      <button className='close-btn' onClick={close}>X</button>
      <h2>Edit Team</h2>
      <label htmlFor='task_name'>Team Name</label>
          <input
            type='text'
            id='task_name'
            className=''
            placeholder='Choose a Team Name'
            value={name}
            onChange={(e)=> setname(e.target.value)}
          />
          <br />
      <label htmlFor='task_name'>Team Name</label>
      <div className='members'>
        {bigMember.map((item) => (
        <div  key={item}>
            <input
              type="checkbox"
              value={item}
              checked={userIsThere(item)}
              onChange={()=>{userIsThere(item) ? removeMember(item)  : addMembers(item)}}
            />
            <p>{item}</p>
        </div>
      ))}
      </div>
      <button className='edit-team' onClick={()=>EditTeamFunction()}>Edit Team </button>
    </div>
    </div>
  )
}

export default AddMemberPopup