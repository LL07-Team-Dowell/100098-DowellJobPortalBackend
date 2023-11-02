import React, { useEffect, useState } from "react";
import { BiEdit, BiSelectMultiple } from "react-icons/bi";
import { formatDateAndTime } from "../../../../helpers/helpers";
import { candidateUpdateTaskForTeamLead } from "../../../../services/teamleadServices";
import CustomHr from "../CustomHr/CustomHr";
import DropdownButton from "../DropdownButton/Dropdown";
import { toast } from "react-toastify";
import "./style.css";
import Button from "../../../AdminPage/components/Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import BatchApproveModal from "./BatchApproveModal/BatchApproveModal";


const CandidateTaskItem = ({ 
  taskNum, 
  currentTask, 
  candidatePage, 
  handleEditBtnClick, 
  updateTasks, 
  handleApproveTask, 
  tasksBeingApproved,
  newTaskItem,
  tasks,
  subproject,
  batchApprovalLoading,
  handleBatchApproveTasks,
  showBatchApprovalModal,
  setShowBatchApprovalModal,
}) => {

    const [ tasksBeingUpdated, setTasksBeingUpdated ] = useState([]);
    const { currentUser } = useCurrentUserContext();

    const handleTaskStatusUpdate = async (updateSelection, taskPassed) => {

      const copyOfTasksBeingUpdated = tasksBeingUpdated.slice();
      const taskIsBeingUpdated = copyOfTasksBeingUpdated.find(task => task.single_task_id === taskPassed.single_task_id);

      if (taskIsBeingUpdated || updateSelection === 'Completed' || updateSelection === 'Incomplete') return;

      copyOfTasksBeingUpdated.push(taskPassed);
      setTasksBeingUpdated(copyOfTasksBeingUpdated);

      taskPassed.status = updateSelection === 'Mark as complete' ? 'Complete' : 'Incomplete';

      try{

        // await updateSingleTask(currentTask.id, currentTask)
        const response = await candidateUpdateTaskForTeamLead({
          document_id: taskPassed.single_task_id,
          task: taskPassed.task,
          status: taskPassed.status,
          task_added_by: taskPassed.task_added_by,
          task_updated_date: new Date(),
          task_updated_by: currentUser?.userinfo?.username,
        });

        //Notification for when task is updated with toastify
        if(response.status === 200){
          toast.success("Task updation successful");
        }
        
      } catch (err) {
        console.log(err);
        toast.error('Task updation failed');
      } finally {
        const updatedTasksBeingUpdated = tasksBeingUpdated.slice();
        setTasksBeingUpdated(updatedTasksBeingUpdated.filter(t => t.single_task_id !== taskPassed.single_task_id));
      }
    } 
    
    const calculateHours = (logsPassed) => {
      const hourGapBetweenLogs = logsPassed.map(log => {
        const [ startTime, endTime ] = [ new Date(`${log.task_created_date} ${log.start_time}`), new Date(`${log.task_created_date} ${log.end_time}`) ]
        if (startTime == 'Invalid Date' || endTime == 'Invalid Date') return 0
  
        const diffInMs = Math.abs(endTime - startTime);
        return  diffInMs / (1000 * 60 * 60);
      });
  
      const totalHours = Number(hourGapBetweenLogs.reduce((x, y) => x + y , 0)).toFixed(2)
      return totalHours
    }
    
    return (
      <>
        <div className="candidate-task-container">
          <div className="candidate-task-status-container" style={{ marginBottom: '2.5rem' }}>
            <div className="candidate-task-details">
              {/*<span className="task__Title">
                {" "}
                {taskNum}. Task: {currentTask.task}{" "}
                {!candidatePage && (
                  <BiEdit className="edit-icon" onClick={handleEditBtnClick} />
                )}
                </span>*/}
              {
                newTaskItem ? <span className="task__Title" style={{ marginBottom: 0 }}>
                  {" "}
                  Work logs added
                  {!candidatePage && (
                    <>
                      {
                        newTaskItem && tasks && tasks.length > 0 && <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.15rem', color: '#838383' }}>
                          {`${tasks.length} logs, ${calculateHours(tasks)} hours`}
                        </span>
                      }
                    </>
                  )}
                </span> :
                <span className="task__Title">
                  {" "}
                  {taskNum}. Work log: {currentTask.task}{" "}
                  {!candidatePage && (
                    <></>
                  )}
                </span>
              }
              
              {/* {
                currentTask.approved && <p style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#005734', margin: '1.2rem 0' }}>
                  <AiOutlineCheckCircle />
                  <span style={{ color: '#005734' }}>Work log is approved</span>
                </p>
              } */}
              
              {/*<span className="task__Description">Task Description: <br />{currentTask.description}</span>*/}
            </div>

            {
              !candidatePage && 
              <Button
                text={"Batch Approval"}
                icon={<BiSelectMultiple />}
                handleClick={() => setShowBatchApprovalModal(true)}
                className={'approve__Task__Btn batch'}
              />
            }

            {
              candidatePage ? (
              <div className="task__Status__Container">
                <DropdownButton
                  currentSelection={currentTask.status}
                  removeDropDownIcon={true}
                />
              </div>
              ) : 
              (
                <>
                </>
              )
            }
          </div>
          {
            !newTaskItem && <div className="candidate-task-date-container">
            <span>
              Added on {formatDateAndTime(currentTask.task_created_date)}
            </span>
            {currentTask.task_updated_date ? (
              <span>Work log status updated last on {formatDateAndTime(currentTask.task_updated_date)}</span>
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
                      No work logs found 
                      {subproject && subproject.length > 0 && <span> matching for subproject: <b>{subproject}</b></span>}
                    </p>
                  </> 
                  :
                  <div className="user__Tasks__Wrapper">
                    {
                      React.Children.toArray(tasks.map(task => {
                        return <>
                          {
                            task.approved && <p style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#005734' }}>
                              <AiOutlineCheckCircle />
                              <span style={{ color: '#005734' }}>Work log is approved</span>
                            </p>
                          }
                          <div className="single__Task__Itemm">
                            <div style={{ color: "#000", fontWeight: 500, fontSize: "1rem" }}>
                              {new Date(task.task_created_date).toLocaleString(
                                "default",
                                { month: "long" }
                              )}
                              <p style={{ display: "inline", marginLeft: "0.2rem" }}>{new Date(task.task_created_date).getDate()}</p>
            
                              <p style={{ display: "inline", marginLeft: "0.7rem", fontSize: "0.9rem" }}>
                                <span style={{ color: "#B8B8B8" }}>{task.start_time} to {task.end_time}:  </span> {task.task}
                              </p>
                            </div>
                            <div className="single__Task__Itemm__action">
                            {
                              !task || !task._id ? <></> :
                              !task.approved ? <>
                                <Button
                                  text={tasksBeingApproved?.find(t => t.single_task_id === task.single_task_id) ? "Approving..." : "Approve Task"}
                                  icon={<AddCircleOutlineIcon />}
                                  handleClick={() => handleApproveTask(task)}
                                  className={'approve__Task__Btn'}
                                  isDisabled={tasksBeingApproved?.find(t => t.single_task_id === task.single_task_id) ? true : false}
                                />
                              </> 
                              : 
                              <>
                                <DropdownButton
                                  className={
                                    task?.status === "Complete" && "task__Active"
                                  }
                                  currentSelection={
                                    tasksBeingUpdated.find(t => t.single_task_id === task.single_task_id) ? 'Please wait...' 
                                    : 
                                    task?.status === 'Complete' ? 'Completed' 
                                    : 
                                    "Mark as complete"
                                  }
                                  removeDropDownIcon={true}
                                  handleClick={(selection) => handleTaskStatusUpdate(selection, task)}
                                  disabled={tasksBeingUpdated.find(t => t.single_task_id === task.single_task_id) ? true : false}
                                />
                                <DropdownButton
                                  className={
                                    task?.status ===  "Incomplete" && "task__Active"
                                  }
                                  currentSelection={
                                    tasksBeingUpdated.find(t => t.single_task_id === task.single_task_id)  ? 'Please wait...' 
                                    : 
                                    task?.status ===  'Incomplete' ? 'Incomplete' 
                                    : 
                                    "Mark as incomplete"
                                  }
                                  removeDropDownIcon={true}
                                  handleClick={(selection) => handleTaskStatusUpdate(selection, task)}
                                  disabled={tasksBeingUpdated.find(t => t.single_task_id === task.single_task_id) ? true : false}
                                /> 
                              </>
                            }
                            </div>
                          </div>
                        </>
                      }))
                    }
                  </div>
                }
              </>
          }

          <CustomHr />
        </div>

        {
          showBatchApprovalModal && <>
            <BatchApproveModal 
              batchApprovalLoading={batchApprovalLoading}
              handleCloseModal={() => setShowBatchApprovalModal(false)}
              logs={tasks.filter(task => !task.approved)}
              handleApproveSelected={(selectedLogs) => handleBatchApproveTasks(selectedLogs)}
            />
          </>
        }
      </>
    );

}

export default CandidateTaskItem;
