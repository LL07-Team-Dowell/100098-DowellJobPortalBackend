// styles
import "./teamScreeTaskProgessDetail.scss";
// react
import React, { useEffect } from "react";
// icons
import { HiPlus } from "react-icons/hi";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import image from "../../../../../../../assets/images/4380.jpg";
import axios from "axios";
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
  console.log({ tasks });
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
            (tasks?.filter((task) => task.completed === false).length > 0 ? (
              tasks
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
                    {...tasks}
                  />
                ))
            ) : (
              <h2>No Task is In Progress.</h2>
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
