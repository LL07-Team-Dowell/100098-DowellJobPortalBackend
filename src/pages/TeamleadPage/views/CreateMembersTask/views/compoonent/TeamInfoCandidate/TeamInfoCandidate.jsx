import React, { useState } from "react";
import { useTeam } from "../../../../../../../pages/CandidatePage/views/TeamsScreen/useTeams";
import { useParams } from "react-router-dom";
import { getSingleTeam } from "../../../../../../../services/createMembersTasks";
import { useEffect } from "react";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import TeamInfo from "../../../../../../../components/TeamInfo/TeamInfo";

const TeamInfoCandidate = () => {
  const { team, setteam } = useTeam();
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (team === undefined || team === null) {
      setloading(true);
      getSingleTeam(id)
        .then((resp) => {
          setteam(resp.data.response.data[0]);
          setloading(false);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, []);
  return (
    <div>
      {loading || team === null || team === undefined ? (
        <LoadingSpinner />
      ) : (
        <TeamInfo
          created_by={team.created_by}
          date_created={team.date_created}
          id={id}
          removeButton={true}
          team_description={team.team_description}
          team_name={team.team_name}
        />
      )}
    </div>
  );
};

export default TeamInfoCandidate;
