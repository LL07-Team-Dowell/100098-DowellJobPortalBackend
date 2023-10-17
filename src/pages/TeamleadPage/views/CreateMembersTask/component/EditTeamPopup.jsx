import { useState } from "react";
import { EditTeam } from "../../../../../services/createMembersTasks";
import { toast } from "react-toastify";
// const { team_name, team_description, members } = teamInfo;

const EditTeamPopup = ({
  teamInfo,
  teamId,
  unShowEditTeam,
  setReversedTeams,
}) => {
  const { name, description, members } = teamInfo;
  const [teamName, setTeamName] = useState(name);
  const [teamDescription, setTeamDescription] = useState(description);
  const editFunction = () => {
    EditTeam(teamId, {
      team_name: teamName,
      members: members,
      team_description: teamDescription,
    })
      .then((response) => {
        toast.success(`team has been updated succesfully !`);
        setReversedTeams((teams) =>
          teams.map((team) => {
            if (team._id === teamId)
              return {
                ...team,
                team_name: teamName,
                members: members,
                team_description: teamDescription,
              };
            return team;
          })
        );
        unShowEditTeam();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className='overlay'>
      <div className='delete_confirmation_container'>
        <input
          type='text'
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <br />
        <input
          type='text'
          value={teamDescription}
          onChange={(e) => setTeamDescription(e.target.value)}
        />
        <br />
        <div>
          <button onClick={() => editFunction()}>Edit</button>
          <button onClick={() => unShowEditTeam()}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamPopup;
