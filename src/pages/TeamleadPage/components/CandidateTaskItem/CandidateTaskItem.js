import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { formatDateAndTime } from "../../../../helpers/helpers";
import { candidateUpdateTaskForTeamLead } from "../../../../services/teamleadServices";
import CustomHr from "../CustomHr/CustomHr";
import DropdownButton from "../DropdownButton/Dropdown";
import { toast } from "react-toastify";
import "./style.css";


const CandidateTaskItem = ({ taskNum, currentTask, candidatePage, handleEditBtnClick, updateTasks }) => {

    const [ currentTaskStatus, setCurrentTaskStatus ] = useState("");
    const [isFetchingData, setIsFetchingData] = useState(false);

    useEffect(() => {
        
        setCurrentTaskStatus(currentTask.status);

    }, [currentTask.status])

    const handleTaskStatusUpdate = async (updateSelection) => {

        if (isFetchingData) return;

        setIsFetchingData(true);

        currentTask.status = updateSelection;
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
              <span className="task__Title">
                {" "}
                {taskNum}. Task: {currentTask.task}{" "}
                {!candidatePage && (
                  <></>
                )}
              </span>
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
                  <DropdownButton
                    className={
                      currentTaskStatus === "Complete" && "task__Active"
                    }
                    currentSelection={"Complete"}
                    removeDropDownIcon={true}
                    handleClick={handleTaskStatusUpdate}
                    disabled={isFetchingData}
                  />
                  <DropdownButton
                    className={
                      currentTaskStatus === "Incomplete" && "task__Active"
                    }
                    currentSelection={"Incomplete"}
                    removeDropDownIcon={true}
                    handleClick={handleTaskStatusUpdate}
                    disabled={isFetchingData}
                  />
                </>
              )}
            </div>
          </div>
          <div className="candidate-task-date-container">
            <span>
              Given on {formatDateAndTime(currentTask.task_created_date)}
            </span>
            {formatDateAndTime(currentTask.task_updated_date) ? (
              <span>on {formatDateAndTime(currentTask.task_updated_date)}</span>
            ) : (
              <></>
            )}
          </div>

          <CustomHr />
        </div>
      </>
    );

}

export default CandidateTaskItem;
