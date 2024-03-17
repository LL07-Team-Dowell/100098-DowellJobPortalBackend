// styles
import "./teamScreeTaskProgessDetail.scss";
// react
import React, { useEffect, useState } from "react";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import image from "../../../../../../../assets/images/4380.jpg";
import SingleTask from "../SingleTask/SingleTask";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";

const TeamScreeTaskProgessDetail = ({
  detail,
  setdetail,
  members,
  title,
  tasks,
  setTasks,
  team,
  taskLoading,
}) => {
  const [ tasksToDisplay, setTasksToDisplay ] = useState([]);
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (!Array.isArray(tasks)) return setTasksToDisplay([]);

    if (team?.created_by !== currentUser?.userinfo?.username) {
      setTasksToDisplay(tasks?.filter(task => task?.assignee?.includes(currentUser?.userinfo?.username)));
      return;
    }

    setTasksToDisplay(tasks);
  }, [team, tasks, currentUser])

  return (
    <div className='team-screen-task-progress-detail'>
      <div className='team-screen-task-progress-detail-header'>
        <button
          onClick={() => setdetail("in progress")}
          className={detail === "in progress" && "active"}
        >
          In Progress
        </button>
        <button
          onClick={() => setdetail("completed")}
          className={detail === "completed" && "active"}
        >
          Completed
        </button>
      </div>
      {taskLoading ? (
        <LoadingSpinner width={"1.8rem"} height={"1.8rem"} />
      ) : (
        <>
          {detail === "in progress" &&
            (tasksToDisplay?.filter((task) => task.completed === false).length > 0 ? (
              tasksToDisplay
                ?.filter((task) => task.completed === false)
                .reverse()
                .map((task) => (
                  <SingleTask
                    key={task._id}
                    teamName={title}
                    subtasks={task.subtasks}
                    title={task.title}
                    members={task.assignee}
                    detail={task.description}
                    image={task.task_image ? task.task_image : image}
                    date={task.due_date}
                    setTasks={setTasks}
                    description={task.description}
                    taskCompleted={false}
                    taskId={task._id}
                    team={team}
                    {...tasksToDisplay}
                  />
                ))
            ) : (
              <h2>
                {
                  team?.created_by !== currentUser?.userinfo?.username ?
                    'You do not have any assigned task in progress.'
                    :
                  'No task is in progress.'
                }
              </h2>
            ))}

          {detail === "completed" &&
            (tasks?.filter((task) => task.completed === true).length > 0 ? (
              tasks
                ?.filter((task) => task.completed === true)
                .reverse()
                .map((task) => (
                  <SingleTask
                    task={task}
                    teamName={title}
                    subtasks={task.subtasks}
                    key={task._id}
                    title={task.title}
                    members={task.assignee}
                    detail={task.description}
                    image={image}
                    date={task.due_date}
                    setTasks={setTasks}
                    taskCompleted={true}
                    taskId={task._id}
                    team={team}
                    completed_date={task.completed_on}
                    {...tasks}
                  />
                ))
            ) : (
              <h2>No Task is Completed.</h2>
            ))}
          <hr />
        </>
      )}
    </div>
  );
};

export default TeamScreeTaskProgessDetail;
