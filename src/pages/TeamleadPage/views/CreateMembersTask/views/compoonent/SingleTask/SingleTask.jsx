import React, { useState } from "react";
import ModelDetails from "./ModelDetails";
import axios from "axios";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";

const SingleTask = ({
  title,
  image,
  members,
  date,
  detail,
  setTasks,
  taskCompleted,
  taskId,
}) => {
  console.log(taskCompleted);
  const { currentUser } = useCurrentUserContext();
  const pathTask = () => {
    const data = {
      title: title,
      description: "",
      assignee: members,
      team_name: "",
      completed: true,
      task_added_by: currentUser.userinfo.username,
    };
    axios
      .patch(`https://100098.pythonanywhere.com/edit_team_task/${taskId}/`)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  const completeTaskFunction = () => {
    if (!taskCompleted) {
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task._id === taskId) return { ...task, completed: true };
          return task;
        })
      );
    }
  };

  const [viewdata, setViewData] = useState(false);
  const handleViewDetails = () => {
    setViewData(!viewdata);
  };

  if (!members || !Array.isArray(members)) return <></>;
  return (
    <>
      <div
        className='team-screen-task-progress-detail-content'
        style={{ padding: 50 }}
      >
        {viewdata && (
          <ModelDetails
            taskname={title}
            status={taskCompleted}
            memberassign={members}
            onClose={handleViewDetails}
          />
        )}
        <div className='team-screen-task-progress-detail-content-data'>
          <img src={image} alt='' width={250} height={125} />
          <div>
            <p className='team-screen-task-progress-detail-content-data-team-name'>
              {title}
            </p>
            <p className='team-screen-task-progress-detail-content-data-team-start-date'>
              Started on . <span>{date}</span>
            </p>
            <div className='team-screen-task-progress-detail-content-members-and-progress'>
              <div className='team-screen-task-progress-detail-content-members'>
                {members?.map((e) => (
                  <span>{e[0].toUpperCase()}</span>
                ))}
              </div>
              <div className='team-screen-task-progress-data-circle'>
                <span>00%</span>
              </div>
            </div>
          </div>
        </div>
        <div className='buttons'>
          <button
            className='team-screen-task-progress-detail-btn'
            onClick={() => setViewData(!viewdata)}
          >
            {"View details"}
          </button>
          <button
            className='team-screen-task-progress-detail-btn'
            onClick={completeTaskFunction}
          >
            {taskCompleted ? "completed" : "mark as done"}
          </button>
        </div>
      </div>
      <hr />
    </>
  );
};

export default SingleTask;
