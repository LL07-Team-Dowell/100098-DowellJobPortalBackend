import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useEffect, useState } from "react";
import { useTeam } from "../TeamsScreen/useTeams";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import { getAllTeams } from "../../../../services/createMembersTasks";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import TeamScreenThreads from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenThreads/teamScreenThreads";

const TeamScreenThreadCandidate = () => {
  const { currentUser } = useCurrentUserContext();
  const { id } = useParams();
  const { team, setteam } = useTeam();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (team?.members === undefined) {
      setloading(true);
      getAllTeams(currentUser.portfolio_info[0].org_id)
        .then((resp) => {
          setteam(resp.data.response.data.find((team) => team["_id"] === id));
          setloading(false);
        })
        .catch((err) => console.log(err));
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
      <TeamScreenThreads />
    </div>
  );
};

export default TeamScreenThreadCandidate;
