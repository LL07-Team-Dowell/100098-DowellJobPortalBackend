import React, { useState } from "react";
import ModelDetails from "./ModelDetails";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { editTeamTask } from "../../../../../../../services/teamleadServices";
import { Tooltip } from "react-tooltip";

const SingleTask = ({
  title,
  image,
  members,
  date,
  detail,
  setTasks,
  teamName,
  taskCompleted,
  taskId,
  team,
}) => {
  console.log({ taskCompleted });
  const { currentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(false);

  const completeTaskFunction = () => {
    if (!taskCompleted) {
      setLoading(true);
      const data = {
        title: title,
        description: detail,
        assignee: members,
        team_name: teamName,
        completed: true,
        task_added_by: currentUser.userinfo.username,
      };
      editTeamTask
        (
          taskId,
          data
        )
        .then(({ data }) => {
          console.log(data);
          setLoading(false);
          setTasks((tasks) =>
            tasks.map((task) => {
              if (task._id === taskId) return { ...task, completed: true };
              return task;
            })
          );
        })
        .catch((err) => console.log(err));
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
            description={detail}
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
                {members?.map((e, i) => (
                  <>
                    <span 
                      data-tooltip-id={`${e} ${i}`}
                      data-tooltip-content={e}
                    >
                      {e[0].toUpperCase()}
                    </span>
                    <Tooltip id={`${e} ${i}`} />
                  </>
                ))}
              </div>
              <div
                className={`team-screen-task-progress-data-circle ${
                  taskCompleted &&
                  "team-screen-task-progress-data-circle-complete"
                }`}
              >
                <span>{taskCompleted ? "100" : "00"}%</span>
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
          {taskCompleted ? null : (
            team?.created_by === currentUser.userinfo.username ?
              <button
                className='team-screen-task-progress-detail-btn'
                onClick={completeTaskFunction}
                style={{ marginLeft: 20 }}
              >
                {loading ? (
                  <LoadingSpinner width={16} height={16} color={"white"} />
                ) : (
                  "mark as done"
                )}
              </button>
            :
              <></>
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

export default SingleTask;
