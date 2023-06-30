// styles 
import './teamScreeTaskProgessDetail.scss'
// react
import React from 'react'
// icons
import {HiPlus} from 'react-icons/hi'
const TeamScreeTaskProgessDetail = ({detail ,setdetail,ShowCreateTask, members}) => {

  return (
    <div className='team-screen-task-progress-detail'>
        <div className="team-screen-task-progress-detail-header">
            <button onClick={()=>setdetail('in progress')} className={detail === 'in progress' && 'active'}>In Progess</button>
            <button onClick={()=>setdetail('completed')} className={detail === 'completed' && 'active'}>Completed</button>
        </div>
        <hr />
        <div className="team-screen-task-progress-detail-content">
            <div className='team-screen-task-progress-detail-content-data'>
                <p className='team-screen-task-progress-detail-content-data-team-name'>Front-end Team</p>
                <h5 className='team-screen-task-progress-detail-content-data-team-task-name'>Develop main Screen</h5>
                <p className='team-screen-task-progress-detail-content-data-team-start-date'>Started on . <span>Apr 2023</span></p>
                <div className='team-screen-task-progress-detail-content-members-and-progress'>
                    <div className='team-screen-task-progress-detail-content-members'>
                        {
                            members.map(e => <span>{e[0].toUpperCase()}</span>)
                        }
                    </div>
                    <div className='team-screen-task-progress-data-circle' >
                        <span>00%</span>
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