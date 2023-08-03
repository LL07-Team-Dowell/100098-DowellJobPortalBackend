import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useEffect, useState } from "react";
import { useTeam } from "../TeamsScreen/useTeams";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import { getAllTeams, getSingleTeam } from "../../../../services/createMembersTasks";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import TeamScreenThreads from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenThreads/teamScreenThreads";
import styled from "styled-components";

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
      .then(resp =>{ 
        setteam(resp.data.response.data[0])
        setloading(false)
      })
      .catch(err => console.log(err))
    }
  }, []);
  console.log({ team });

   const Wrappen = styled.section`
     display: flex;
     align-items: center;
     justify-content: space-around;
     gap: 2rem;
     padding-top: 30px;
     flex-direction: row;
     width: 32%;
     margin-right: auto;
     margin-left: auto;
     a {
       border-radius: 10px;
       background: #f3f8f4;
       color: #b8b8b8;
       font-family: "Poppins", sans-serif;
       font-weight: 500;
       font-size: 1rem;
       line-height: 20px;
       display: flex;
       align-items: center;
       justify-content: center;
       letter-spacing: 0.01em;
       cursor: pointer;
       width: 10rem;
       height: 3rem;
       transition: 0.3s ease-in-out;
       text-align: center;
     }
     .link-isActive {
       background: #005734;
       box-shadow: 0px 2.79922px 25px rgba(0, 87, 52, 0.67);
       color: #fff;
     }
   `;

   const [panding, setPanding] = useState(true);
   const [status, setStatus] = useState();
   const clickToPandingApproval = () => {
     setPanding(true);
     setStatus("In progress");
   };

   const clickToApproved = () => {
     setPanding(false);
      setStatus("Completed");
   };

  if (loading) return <LoadingSpinner />;
  return (
    <div style={{ height: "130%" }}>
      {team?.team_name !== undefined ? (
        <Navbar title={team?.team_name.toString()} removeButton={true} />
      ) : null}
      <TeamScreenLinks id={id} />
      <Wrappen>
            <NavLink className={`${panding ? 'link-isActive' : 'link-notactive'}`} to={`/team-screen-member/${id}/team-issues`} onClick={clickToPandingApproval}>In progress</NavLink>
            <NavLink className={`${panding ? 'link-notactive' : 'link-isActive'}`} to={`/team-screen-member/${id}/team-issues`} onClick={clickToApproved}>Completed</NavLink>
        </Wrappen>
      <TeamScreenThreads status={status}/>
    </div>
  );
};

export default TeamScreenThreadCandidate;
