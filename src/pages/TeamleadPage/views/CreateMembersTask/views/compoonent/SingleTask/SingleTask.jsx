import React from 'react'

const SingleTask = ({title, image, members, date, detail, setTasks, taskCompleted,taskId  }) => {
    const completeTaskFunction = () => {
        if(!taskCompleted){
            setTasks(tasks => tasks.map(task => {
                if(task._id === taskId) return {...task, completed:true}
                return task
            }))
        }
    }

    if (!members || !Array.isArray(members)) return <></>

    return (
    <>
    <div className="team-screen-task-progress-detail-content" style={{padding:50}}>
            <div className='team-screen-task-progress-detail-content-data'>
                <img src={image} alt="" width={250} height={125}/>
                <div>
                <p className='team-screen-task-progress-detail-content-data-team-name'>{title}</p>
                <p className='team-screen-task-progress-detail-content-data-team-start-date'>Started on . <span>{date}</span></p>
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
            <button className="team-screen-task-progress-detail-btn" onClick={() => {}}>
                {'View details'}
            </button>
            <button className="team-screen-task-progress-detail-btn" onClick={completeTaskFunction}>
                {taskCompleted ?  'completed'  : 'mark as done'}
            </button>
        </div>
    <hr />
        </>
  )
}

export default SingleTask