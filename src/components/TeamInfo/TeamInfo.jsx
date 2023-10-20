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
          {date_created}
        </p>
      </div>
    </div>
  );
};

export default TeamInfo;
