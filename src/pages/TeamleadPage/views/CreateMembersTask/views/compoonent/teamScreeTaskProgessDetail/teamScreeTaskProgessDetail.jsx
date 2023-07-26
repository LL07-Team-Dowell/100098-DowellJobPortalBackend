// styles 
import './teamScreeTaskProgessDetail.scss'
// react
import React, { useEffect } from 'react'
// icons
import {HiPlus} from 'react-icons/hi'
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import image from '../../../../../../../assets/images/4380.jpg'
import axios from 'axios';
import SingleTask from '../SingleTask/SingleTask';
const TeamScreeTaskProgessDetail = ({detail ,setdetail, members, title, tasks, setTasks}) => {
    
  return (
    <div className='team-screen-task-progress-detail'>
        <div className="team-screen-task-progress-detail-header">
            <button onClick={()=>setdetail('in progress')} className={detail === 'in progress' && 'active'}>In Progress</button>
            <button onClick={()=>setdetail('completed')} className={detail === 'completed' && 'active'}>Completed</button>
        </div>
        {
            detail === 'in progress' && (
            tasks
            ?.filter(task => task.completed === false).length > 0 ?
            tasks
            ?.filter(task => task.completed === false)
            .map(task => <SingleTask 
                    key={task._id}  
                    title={task.title}
                    members={task.assignee}
                    detail={task.description}
                    image={image}
                    date={task.due_date}
                    setTasks={setTasks}
                    taskCompleted={false}
                    taskId={task._id}
                />) 
            :
            <h2>No Task is In Progress.</h2>)
        }
        {
            detail === 'completed' && (
            tasks
            ?.filter(task => task.completed === true).length > 0 ?
            tasks
            ?.filter(task => task.completed === true)
            .map(task => <SingleTask 
                    key={task._id}  
                    title={task.title}
                    members={task.assignee}
                    detail={task.description}
                    image={image}
                    date={task.due_date}
                    setTasks={setTasks}
                    taskCompleted={true}
                    taskId={task._id}
                />) 
            :
            <h2>No Task is Completed.</h2>)
        }
        <hr />
    </div>
  )
}

export default TeamScreeTaskProgessDetail

{/* <div className="team-screen-task-progress-detail-content">
<div className='team-screen-task-progress-detail-content-data'>
    <img src={image} alt="" width={250} height={125}/>
    <div>
    <p className='team-screen-task-progress-detail-content-data-team-name'>{title}</p>
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
</div> */}