import { useEffect } from "react";
import "./TeamInfo.scss";
import { getSingleTeam } from "../../services/createMembersTasks";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
const TeamInfo = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(undefined);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getSingleTeam(id)
      .then((resp) => {
        setTeam(resp.data.response.data[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p>
            <b>Team Name: </b> {team?.team_name}
          </p>
          <p>
            <b>Team Description: </b>
            {team?.team_description}
          </p>
          <p>
            <b>Team Created By: </b>
            {team?.created_by}
          </p>
          <p>
            <b>date created: </b>
            {team?.date_created}
          </p>
        </>
      )}
    </div>
  );
};

export default TeamInfo;
