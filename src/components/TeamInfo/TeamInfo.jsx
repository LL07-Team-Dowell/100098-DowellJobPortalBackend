import Navbar from "../../pages/TeamleadPage/views/CreateMembersTask/component/Navbar";
import TeamScreenLinks from "../../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import "./TeamInfo.scss";

const TeamInfo = ({
  team_name,
  team_description,
  created_by,
  date_created,
  removeButton,
  id,
  team_members,
}) => {
  return (
    <div>
      <Navbar title={team_name} removeButton={removeButton} />
      <TeamScreenLinks id={id} />
      <div className='team__info'>
        <p>
          <b>Team Name: </b> {team_name}
        </p>
        <p>
          <b>Team Description: </b>
          {team_description}
        </p>
        <p>
          <b>Team Created By: </b>
          {created_by}
        </p>
        <p>
          <b>Date created: </b>
          {new Date(date_created).toDateString()}
        </p>
        <p>
          <b>Number of members: </b>
          {team_members.length}
        </p>
      </div>
    </div>
  );
};

export default TeamInfo;
