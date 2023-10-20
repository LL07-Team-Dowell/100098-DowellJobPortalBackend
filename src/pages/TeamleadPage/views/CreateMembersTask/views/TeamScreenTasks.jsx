import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTeam } from "../context/Team";
import Navbar from "../component/Navbar";
import TeamScreenLinks from "./compoonent/teamScreenLinks/teamScreenLinks";
import TeamScreenTaskProgress from "./compoonent/teamScreenTaskProgress/teamScreenTaskProgress";
import TeamScreeTaskProgessDetail from "./compoonent/teamScreeTaskProgessDetail/teamScreeTaskProgessDetail";
import {
  getAllTeams,
  getSingleTeam,
  getTeamTask,
} from "../../../../../services/createMembersTasks";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import CreateTask from "./compoonent/createTask/createTask";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import axios from "axios";

const TeamScreenTasks = () => {
  // states
  const { currentUser } = useCurrentUserContext();
  const { id } = useParams();
  const { team, setteam } = useTeam();
  const [loading, setloading] = useState(false);
  const [detail, setdetail] = useState("in progress");
  const [showCreatTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [addedNewTask, setAddedNewTask] = useState(true);
  const [progessPercentage, setProgressPercentage] = useState(null);
  // useEffect
  useEffect(() => {
    if (team?.members === undefined) {
      setloading(true);

      //   getAllTeams(currentUser.portfolio_info[0].org_id)
      //     .then(resp =>{
      //     setteam(resp.data.response.data.find(team => team["_id"] === id))
      //     setloading(false)})
      // .catch(err => console.log(err))

      // GET A SINGLE TEAM INSTEAD
      getSingleTeam(id)
        .then((resp) => {
          setteam(resp.data.response.data[0]);
          setloading(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(() => {
    console.log({ Team: team });
  }, [team]);
  useEffect(() => {
    if (tasks.length > 0) {
      const tasksCompletedNumber = tasks.filter(
        (task) => task.completed === true
      ).length;
      const tasksNumber = tasks.length;
      setProgressPercentage(
        ((tasksCompletedNumber / tasksNumber) * 100).toFixed(2)
      );
    }
  }, [tasks]);
  useEffect(() => {
    if (addedNewTask) {
      getTeamTask(id)
        .then((resp) => {
          // get all tasks and put it in tasks state
          setTasks(resp.data.response.data);
          console.log("response", resp.data.response.data);
          setAddedNewTask(false);
        })
        .catch((err) => {
          console.log(err);
          setAddedNewTask(false);
        });
    }
  }, [addedNewTask]);
  console.log({ tasks });
  if (loading) return <LoadingSpinner />;
  return (
    <div style={{ height: "130%" }}>
      {team?.team_name !== undefined ? (
        <Navbar
          title={team?.team_name.toString()}
          removeButton={true}
          addTeamTask={
            team?.created_by === currentUser?.userinfo?.username ? true : false
          }
          handleAddTeamTaskFunction={() => setShowCreateTask(true)}
          addTeamTaskTitle='Add Task'
        />
      ) : null}
      <TeamScreenLinks id={id} />
      <TeamScreenTaskProgress progessPercentage={progessPercentage} />
      <TeamScreeTaskProgessDetail
        detail={detail}
        setdetail={setdetail}
        tasks={tasks}
        setTasks={setTasks}
        team={team}
      />
      {showCreatTask && team?.created_by === currentUser.userinfo.username && (
        <CreateTask
          id={id}
          setTasks={setTasks}
          members={team.members}
          team={team}
          unShowCreateTask={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
};

export default TeamScreenTasks;
