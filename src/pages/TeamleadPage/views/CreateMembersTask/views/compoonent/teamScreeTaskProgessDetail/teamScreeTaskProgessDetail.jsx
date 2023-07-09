// styles 
import './teamScreeTaskProgessDetail.scss'
// react
import React, { useEffect } from 'react'
// icons
import {HiPlus} from 'react-icons/hi'
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import image from '../../../../../../../assets/images/4380.jpg'
import axios from 'axios';
const TeamScreeTaskProgessDetail = ({detail ,setdetail,ShowCreateTask, members, title, id}) => {
  const { currentUser } = useCurrentUserContext();

    useEffect(()=>{
        axios(`https://100098.pythonanywhere.com/get_task/${currentUser.portfolio_info[0].org_id}/`)
            .then(resp => {
                console.log({teamFind:resp.data.response.data.find(m => m._id === id)});
                console.log(resp.data.response.data);
                console.log({teamsId:resp.data.response.data.map(m => m._id),id})
            })
            .catch(err => console.log(err))
    },[])
  return (
    <div className='team-screen-task-progress-detail'>
        <div className="team-screen-task-progress-detail-header">
            <button onClick={()=>setdetail('in progress')} className={detail === 'in progress' && 'active'}>In Progress</button>
            <button onClick={()=>setdetail('completed')} className={detail === 'completed' && 'active'}>Completed</button>
        </div>
        <hr />
        <div className="team-screen-task-progress-detail-content">
            <div className='team-screen-task-progress-detail-content-data'>
                <img src={image} alt="" width={250} height={125}/>
                <div>
                <p className='team-screen-task-progress-detail-content-data-team-name'>{title}</p>
                {/* <h5 className='team-screen-task-progress-detail-content-data-team-task-name'>Develop main Screen</h5> */}
                <p className='team-screen-task-progress-detail-content-data-team-start-date'>Started on . <span>Apr 2023</span></p>
                <div className='team-screen-task-progress-detail-content-members-and-progress'>
                    <div className='team-screen-task-progress-detail-content-members'>
                        {
                            members?.map(e => <span>{e[0].toUpperCase()}</span>)
                        }
                    </div>
                    <div className='team-screen-task-progress-data-circle' >
                        <span>00%</span>
                    </div>
                </div>
                </div>
            </div>
            <button className="team-screen-task-progress-detail-btn">
                {detail === 'in progress' ? 'mark as done' : 'completed'}
            </button>
        </div>
        <hr />
        <button className='add-task-btn' onClick={()=>ShowCreateTask()}><div><HiPlus fontWeight={700}/> <span>add Task</span></div></button>
    </div>
  )
}

export default TeamScreeTaskProgessDetail