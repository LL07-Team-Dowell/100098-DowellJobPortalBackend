import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useEffect, useState } from "react";
import { useTeam } from "../TeamsScreen/useTeams";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import {
  getAllTeams,
  getSingleTeam,
} from "../../../../services/createMembersTasks";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import TeamScreenThreads from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenThreads/teamScreenThreads";
import styled from "styled-components";
import { Wrappen } from "./style";

const TeamScreenThreadCandidate = () => {
  const { currentUser } = useCurrentUserContext();
  const { id } = useParams();
  const { team, setteam } = useTeam();
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (team?.members === undefined) {
      setloading(true);
      // getAllTeams(currentUser.portfolio_info[0].org_id)
      // .then(resp =>{
      //   setteam(resp.data.response.data.find(team => team["_id"] === id))
      //   console.log(resp.data.response.data.find(team => team["_id"] === id))
      //   setloading(false)
      // })

      // GET A SINGLE TEAM INSTEAD
      getSingleTeam(id)

        .then((resp) => {
          setteam(resp.data.response.data[0]);
          setloading(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  console.log({ team });

  const [panding, setPanding] = useState(true);
  const [status, setStatus] = useState("In progress");
  

  if (loading) return <LoadingSpinner />;
  return (
    <div style={{ height: "130%" }}>
      {team?.team_name !== undefined ? (
        <Navbar title={team?.team_name.toString()} removeButton={true} />
      ) : null}
      <TeamScreenLinks id={id} />
      <Wrappen>
        <NavLink
          className={status === "In progress" && "isActive"}
          to={`/team-screen-member/${id}/team-issues`}
          onClick={() => setStatus("In progress")}
        >
          In progress
        </NavLink>
        <NavLink
          className={status === "Completed" && "isActive"}
          to={`/team-screen-member/${id}/team-issues`}
          onClick={() => setStatus("Completed")}
        >
          Completed
        </NavLink>
        <NavLink
          className={status === "Resolved" && "isActive"}
          to={`/team-screen-member/${id}/team-issues`}
          onClick={() => setStatus("Resolved")}
        >
          Resolved
        </NavLink>
      </Wrappen>
      <TeamScreenThreads status={status} id={id}/>
    </div>
  );
};

export default TeamScreenThreadCandidate;
