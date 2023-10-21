import React from "react";
import { useTeam } from "../../context/Team";
import TeamInfo from "../../../../../../components/TeamInfo/TeamInfo";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";
import { getSingleTeam } from "../../../../../../services/createMembersTasks";

const TeamScreenInfoAdminTeamLead = () => {
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
          console.log(err);
          alert(err.message);
        });
    }
  }, []);
  return (
    <div>
      {loading || team === null ? (
        <LoadingSpinner />
      ) : (
        <TeamInfo
          created_by={team.created_by}
          date_created={team.date_created}
          id={id}
          removeButton={true}
          team_description={team.team_description}
          team_name={team.team_name}
          team_members={team.members}
        />
      )}
    </div>
  );
};

export default TeamScreenInfoAdminTeamLead;
