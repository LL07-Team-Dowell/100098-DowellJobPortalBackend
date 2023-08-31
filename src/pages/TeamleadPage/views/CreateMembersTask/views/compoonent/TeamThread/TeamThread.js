import React, { useEffect, useState } from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import styled from 'styled-components';
import TeamScreenLinks from '../teamScreenLinks/teamScreenLinks';
import AddIssueTeamLead from './AddIssueTeamLead';
import Navbar from '../../../component/Navbar';
import { getAllTeams, getSingleTeam } from '../../../../../../../services/createMembersTasks';
import { useTeam } from '../../../context/Team';
import { getSettingUserProject } from '../../../../../../../services/hrServices';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';

const TeamThread = ({ title = "Team Issues", color }) => {
  const { id } = useParams();
  console.log(id);
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

  @media screen and (max-width: 992px){
    width: 69%;
    margin: auto;

    a{
      font-size: 0.8rem;
    }
  }

  @media screen and (max-width: 492px){
    width: 89%;
    margin: auto;

    a{
      font-size: 0.8rem;
    }
  }
`;

  const [panding, setPanding] = useState(true);
  const [resolve, setResolve] = useState(false);
  const [progress, setProgress] = useState(false);
  const [status, setStatus] = useState();
  const { team, setteam } = useTeam()
  const [issue, setIssue] = useState(false);
  const [candidateTeams, setCandidateTeams] = useState([]);
  const [showIssueForm, setShowIssueForm] = useState(false);

  console.log(candidateTeams);
  const { currentUser } = useCurrentUserContext();

  const clickToPandingApproval = () => {
    setPanding(true);
    setProgress(false);
    setResolve(false);
    setStatus('In progress')
  };

  const clickToApproved = () => {
    setPanding(false);
    setProgress(true);
    setResolve(false);
    setStatus('Completed')
  };

  const clickToResolve = () => {
    setPanding(false);
    setProgress(false);
    setResolve(true);
    setStatus('Resolved')
  };

  useEffect(() => {
    if (team?.members === undefined) {
      // GET A SINGLE TEAM INSTEAD
      getSingleTeam(id)
        .then(resp => {
          setteam(resp.data.response.data[0])
        })
        .catch(err => console.log(err))
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getAllTeams(currentUser.portfolio_info[0].org_id),
      getSettingUserProject(),
    ]).then(res => {
      setCandidateTeams(
        res[0]?.data?.response?.data?.filter((team) =>
          team?.members.includes(currentUser.userinfo.username)
        )
      );
    }).catch(err => {
      console.log('An error occured trying to fetch teams or projects for candidate');
    })
  }, []);


  const navigate = useNavigate()


  return (<>
    {team?.team_name !== undefined ? <Navbar title={team?.team_name.toString()} removeButton={true} /> : null}

    <TeamScreenLinks id={id} />            {
      issue && (
        <AddIssueTeamLead
          afterSelectionScreen={true}
          teamId={id}
          candidateView={true}
          closeIssuesScreen={() => setShowIssueForm(false)}
          teams={candidateTeams}
        />)
    }


    <div className="create-new-team-heade">
      <Wrappen>
        <NavLink className={`${panding ? 'link-isActive' : 'link-notactive'}`} to={`/team-screen-member/${id}/issue-inprogress`} onClick={clickToPandingApproval}>In progress</NavLink>
        <NavLink className={`${progress ? 'link-isActive' : 'link-notactive'}`} to={`/team-screen-member/${id}/issue-completed`} onClick={clickToApproved}>Completed</NavLink>
        <NavLink className={`${resolve ? 'link-isActive' : 'link-notactive'}`} to={`/team-screen-member/${id}/issue-resolved`} onClick={clickToResolve}>Resolved</NavLink>
      </Wrappen>
      <ThreadItem status={status} />
    </div>
  </>
  )
}


export default TeamThread;
