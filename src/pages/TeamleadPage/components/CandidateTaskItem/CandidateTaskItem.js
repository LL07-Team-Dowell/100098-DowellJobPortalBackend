import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { formatDateAndTime } from "../../../../helpers/helpers";
import { candidateUpdateTaskForTeamLead } from "../../../../services/teamleadServices";
import CustomHr from "../CustomHr/CustomHr";
import DropdownButton from "../DropdownButton/Dropdown";
import { toast } from "react-toastify";
import "./style.css";
import Button from "../../../AdminPage/components/Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineCheckCircle } from "react-icons/ai";


const CandidateTaskItem = ({ 
  taskNum, 
  currentTask, 
  candidatePage, 
  handleEditBtnClick, 
  updateTasks, 
  handleApproveTask, 
  taskIsBeingApproved,
  newTaskItem,
  tasks,
  subproject,
}) => {

    const [ currentTaskStatus, setCurrentTaskStatus ] = useState("");
    const [isFetchingData, setIsFetchingData] = useState(false);

    useEffect(() => {
        
        setCurrentTaskStatus(currentTask.status);

    }, [currentTask.status])

    const handleTaskStatusUpdate = async (updateSelection) => {

        if (isFetchingData || updateSelection === 'Completed' || updateSelection === 'Incomplete') return;

        setIsFetchingData(true);

        currentTask.status = updateSelection === 'Mark as complete' ? 'Complete' : 'Incomplete';
        setCurrentTaskStatus(updateSelection)

        try{

            // await updateSingleTask(currentTask.id, currentTask)
            const response = await candidateUpdateTaskForTeamLead({
              document_id: currentTask._id,
              task: currentTask.task,
              status: currentTask.status,
              task_added_by: currentTask.task_added_by,
              task_updated_date: new Date(),
            });

            //Notification for when task is updated with toastify
            if(response.status === 200){
                toast.success("Task updation successful");
            }
            
            updateTasks(prevTasks => prevTasks.map(task => {
                
                if (task._id === currentTask._id) {
                    return { ...task, status: updateSelection }
                }

                return task;

            }) );

        } catch (err) {
            console.log(err);
            setCurrentTaskStatus("");
        } finally {
            setIsFetchingData(false);
        }
    } 
    
    return (
      <>
        <div className="candidate-task-container">
          <div className="candidate-task-status-container">
            <div className="candidate-task-details">
              {/*<span className="task__Title">
                {" "}
                {taskNum}. Task: {currentTask.task}{" "}
                {!candidatePage && (
                  <BiEdit className="edit-icon" onClick={handleEditBtnClick} />
                )}
                </span>*/}
              {
                newTaskItem ? <span className="task__Title">
                  {" "}
                  Tasks added
                  {!candidatePage && (
                    <></>
                  )}
                </span> :
                <span className="task__Title">
                  {" "}
                  {taskNum}. Task: {currentTask.task}{" "}
                  {!candidatePage && (
                    <></>
                  )}
                </span>
              }
              
              {
                currentTask.approved && <p style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#005734', margin: '1.2rem 0' }}>
                  <AiOutlineCheckCircle />
                  <span style={{ color: '#005734' }}>Task is approved</span>
                </p>
              }
              
              {/*<span className="task__Description">Task Description: <br />{currentTask.description}</span>*/}
            </div>

            <div className="task__Status__Container">
              {candidatePage ? (
                <>
                  <DropdownButton
                    currentSelection={currentTask.status}
                    removeDropDownIcon={true}
                  />
                </>
              ) : (
                <>
                  {
                    !currentTask || !currentTask._id ? <></> :
                    !currentTask.approved ? <>
                      <Button
                        text={taskIsBeingApproved ? "Approving..." : "Approve Task"}
                        icon={<AddCircleOutlineIcon />}
                        handleClick={() => handleApproveTask(currentTask)}
                        className={'approve__Task__Btn'}
                        isDisabled={taskIsBeingApproved}
                      />
                    </> 
                    : 
                    <>
                      <DropdownButton
                        className={
                          currentTaskStatus === "Complete" && "task__Active"
                        }
                        currentSelection={
                          isFetchingData ? 'Please wait...' 
                          : 
                          currentTaskStatus === 'Complete' ? 'Completed' 
                          : 
                          "Mark as complete"
                        }
                        removeDropDownIcon={true}
                        handleClick={handleTaskStatusUpdate}
                        disabled={isFetchingData}
                      />
                      <DropdownButton
                        className={
                          currentTaskStatus === "Incomplete" && "task__Active"
                        }
                        currentSelection={
                          isFetchingData ? 'Please wait...' 
                          : 
                          currentTaskStatus === 'Incomplete' ? 'Incomplete' 
                          : 
                          "Mark as incomplete"
                        }
                        removeDropDownIcon={true}
                        handleClick={handleTaskStatusUpdate}
                        disabled={isFetchingData}
                      /> 
                    </>
                  }
                </>
              )}
            </div>
          </div>
          {
            !newTaskItem && <div className="candidate-task-date-container">
            <span>
              Added on {formatDateAndTime(currentTask.task_created_date)}
            </span>
            {currentTask.task_updated_date ? (
              <span>Task status updated last on {formatDateAndTime(currentTask.task_updated_date)}</span>
            ) : (
              <></>
            )}
          </div>
          }

          {
            newTaskItem && tasks &&
              <>
                {
                  tasks.length < 1 ?
                  <>
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem' }}>
                      No tasks found 
                      {subproject && subproject.length > 0 && <span> matching for subproject: <b>{subproject}</b></span>}
                    </p>
                  </> 
                  :
                  <>
                    {
                      React.Children.toArray(tasks.map(task => {
                        return <div style={{ color: "#000", fontWeight: 500, fontSize: "1rem" }}>
                          {new Date(task.task_created_date).toLocaleString(
                            "default",
                            { month: "long" }
                          )}
                          <p style={{ display: "inline", marginLeft: "0.2rem" }}>{new Date(task.task_created_date).getDate()}</p>
        
                          <p style={{ display: "inline", marginLeft: "0.7rem", fontSize: "0.9rem" }}>
                            <span style={{ color: "#B8B8B8" }}>{task.start_time} to {task.end_time}:  </span> {task.task}
                          </p>
                        </div>
                      }))
                    }
                  </>
                }
              </>
          }

          <CustomHr />
        </div>
      </>
    );

}

export default CandidateTaskItem;
