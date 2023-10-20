import "./TeamInfo.scss";

const TeamInfo = ({
  team_name,
  team_description,
  created_by,
  date_created,
}) => {
  return (
    <div>
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
        <b>date created: </b>
        {date_created}
      </p>
    </div>
  );
};

export default TeamInfo;
