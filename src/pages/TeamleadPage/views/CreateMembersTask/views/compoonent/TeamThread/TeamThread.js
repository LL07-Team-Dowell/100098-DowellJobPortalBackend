import React, { useState } from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import styled from 'styled-components';

const TeamThread = ({ title = "Team Issues", color }) => {
  const { id } = useParams();

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
    setStatus('In progress')
  };

  const clickToApproved = () => {
    setPanding(false);
    setStatus('Completed')
  };

  const navigate = useNavigate()

  return (<>
    <div className='create-new-team-header'>
      <div>
        <div>
          <button className='back' onClick={() => navigate(`/team-screen-member/${id}/team-issues`)}><MdOutlineArrowBackIosNew /></button>
          {title !== undefined && <h1 style={{ color: color ? color : '#000' }}>{title}</h1>}
        </div>
      </div>
    </div>

    <div className="create-new-team-heade">
      <Wrappen>
        <NavLink className={`${panding ? 'link-isActive' : 'link-notactive'}`} to={`/team-screen-member/${id}/issue-inprogress`} onClick={clickToPandingApproval}>In progress</NavLink>
        <NavLink className={`${panding ? 'link-notactive' : 'link-isActive'}`} to={`/team-screen-member/${id}/issue-completed`} onClick={clickToApproved}>Completed</NavLink>
      </Wrappen>
      <ThreadItem status={status}/>
    </div>
  </>
  )
}


export default TeamThread;
