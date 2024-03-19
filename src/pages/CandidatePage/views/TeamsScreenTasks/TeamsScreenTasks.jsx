import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useTeam } from "../TeamsScreen/useTeams";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import TeamScreenTaskProgress from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenTaskProgress/teamScreenTaskProgress";
import TeamScreeTaskProgessDetail from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreeTaskProgessDetail/teamScreeTaskProgessDetail";
import CreateTask from "../../../TeamleadPage/views/CreateMembersTask/component/smallComponents/CreateTask";
import {
  getAllTeams,
  getSingleTeam,
  getTeamTask,
} from "../../../../services/createMembersTasks";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

const TeamScreenTasksCandidate = () => {
  const { currentUser } = useCurrentUserContext();
  const { id } = useParams();
  const { team, setteam } = useTeam();
  const [loading, setloading] = useState(false);
  const [detail, setdetail] = useState("in progress");
  const [showCreatTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [progessPercentage, setProgressPercentage] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);

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
    if (team?.members === undefined) {
      setloading(true);
      setTaskLoading(true);

      Promise.all([
        // getAllTeams(currentUser.portfolio_info[0].org_id),
        getSingleTeam(id),
        getTeamTask(id),
      ])
        .then((resp) => {
          console.log(resp);
          setteam(resp[0].data.response.data[0]);
          setTasks(
            Array.isArray(resp[1]?.data?.response?.data)
              ? resp[1].data.response.data
              : []
          );
          setloading(false);
          setTaskLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
          setTaskLoading(false);
        });
    }

    if (team && tasks.length < 1) {
      getTeamTask(id).then(res => {
        setTasks(
          Array.isArray(res.data?.response?.data)
            ? res.data?.response?.data
            : []
        );
        setTaskLoading(false);
      }).catch(err => {
        console.log(err?.response?.data);
        setTaskLoading(false);
      })
    }
  }, []);

  console.log({ team });
  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ height: "130%" }}>
      {team?.team_name !== undefined ? (
        <Navbar title={team?.team_name.toString()} removeButton={true} />
      ) : null}
      <TeamScreenLinks id={id} />
      <TeamScreenTaskProgress progessPercentage={progessPercentage} />
      <TeamScreeTaskProgessDetail
        id={id}
        title={team?.team_name}
        members={team?.members}
        detail={detail}
        setdetail={setdetail}
        ShowCreateTask={() => setShowCreateTask(true)}
        showAddTaskButton={false}
        tasks={tasks}
        setTasks={setTasks}
        team={team}
        taskLoading={taskLoading}
      />
    </div>
  );
};

export default TeamScreenTasksCandidate;
