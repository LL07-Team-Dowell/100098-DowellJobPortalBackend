import React, { useEffect, useState } from 'react'
import './addMemberPopup.scss'
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { EditTeam } from '../../../../../../../services/createMembersTasks';
import { toast } from 'react-toastify';
import {BsPlus} from 'react-icons/bs'
import {FaTimes} from 'react-icons/fa'
import LittleLoading from '../../../../../../CandidatePage/views/ResearchAssociatePage/littleLoading';
import LoadingSpinner from '../../../../../../../components/LoadingSpinner/LoadingSpinner';
const returnMissingMember = (bigMember,smallMember) => {
    let data = bigMember
    smallMember.forEach(element => {
      data =data.filter(e => e !== element)
    });
    return data
}


const AddMemberPopup = ({bigMember,  members,team_name, setmembers ,close, setTeamName,getElementToTeamState, setteam, team}) => {
    const [name, setname] = useState(team_name) ;
    const [loading, setloading] = useState(false)
    const [displaidMembers, setDesplaidMembers] = useState(returnMissingMember(bigMember,members).map((member,index) => ({id:index ,member})))
  const [inputMembers, setInputMembers] = useState([]) ; 
  const [query,setquery] = useState('');

  const AddedMember = (id) => {
    setInputMembers([...inputMembers,displaidMembers.find(f => f.id === id)])
    setDesplaidMembers(displaidMembers.filter(f => f.id !== id))
  }
  const removeMember = (id) => {
    setInputMembers(inputMembers.filter(f => f.id !== id))
    setDesplaidMembers([...displaidMembers,inputMembers.find(f => f.id === id)])
  }
      const EditTeamFunction = () => {
        if(!loading){
          if(name && inputMembers.length > 0){
            setloading(true);
            EditTeam(team._id,{team_name,members:[...inputMembers.map(m => m.member)]})
            .then(resp => {
              console.log(resp);
              getElementToTeamState(name,[...inputMembers.map(m => m.member)])
              setteam({...team, members:[...inputMembers.map(m => m.member)]})
              toast.success("Edit Team Successfully");
              close();
            setloading(false);
            })
            .catch(err => {
              console.log(name,[...inputMembers.map(m => m.member)])
              setloading(false);
  
            })
          }
          else{
            toast.error("Complete all fields before submitting")
            setloading(false);
          }
        }
      }
      useEffect(()=>{
        const newMembers = members.map((v,i)=> ({id:new Date().getTime()+i,member:v}))
        setInputMembers([...newMembers])
      },[])
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
          <label htmlFor="">Team Members</label>
          <div className='added-members-input'>
            {
              inputMembers.map(v => <div key={v.id} onClick={()=>removeMember(v.id)}><p>{v.member}</p><FaTimes fontSize={'small'}/></div>)
            }
            <input type="text" placeholder='search member' value={query} onChange={e => setquery(e.target.value)}/>
          </div>
          <div></div>
          <br />
      <label htmlFor='task_name'>Select Members</label>
      <div className='members'>
        {[...new Map(displaidMembers.map((member) => [member.member, member])).values()]
          .filter(f => f.member.toLocaleLowerCase().includes(query.toLocaleLowerCase())).length > 0 ?
          [...new Map(displaidMembers.map((member) => [member.member, member])).values()]
          .filter(f => f.member.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
          .map((element) => (
          <div className="single-member" onClick={()=>AddedMember(element.id)}>
            <p>{element.member}</p>
            <BsPlus/>
          </div>
      )):
      <h3>No More Members</h3>
      }
      </div>
      <button className='edit-team' onClick={()=>EditTeamFunction()}>{loading ? <LoadingSpinner color={'white'} width='20px' height='20px' /> : 'Edit Team'}</button>
    </div>
    </div>
  )
}

export default AddMemberPopup