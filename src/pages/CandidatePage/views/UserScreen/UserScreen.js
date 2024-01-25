import React from 'react';
import "./style.css";
import { useNavigate } from 'react-router-dom';
import JobLandingLayout from '../../../../layouts/CandidateJobLandingLayout/LandingLayout';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { getUserLiveStatus, postUserLiveStatus } from '../../../../services/commonServices';
import { teamManagementProductName } from '../../../../utils/utils';
import { ApproveVouchar, ClaimVouchar } from '../../../TeamleadPage/views/ClaimVouchar/ClaimVouchar';
import { useState, useEffect } from "react";

function UserScreen({ candidateSelected }) {

  const { currentUser, currentUserHiredApplications, currentUserHiredApplicationsLoaded } = useCurrentUserContext()
  const navigate = useNavigate();

  const handleLogout = () => navigate("/logout");

  const [success, setsuccsess] = React.useState(false);
  React.useEffect(() => {
    const checkActive = setInterval(() => {
      //    getUserLiveStatus()
      Promise.all([getUserLiveStatus(), postUserLiveStatus({ product: teamManagementProductName, session_id: sessionStorage.getItem("session_id") })])
        .then(resp => { console.log(resp[0], resp[1]); setsuccsess(true) })
        .catch(err => { console.log(err[0], err[1]); setsuccsess(false); });
    }, 60000)
    return () => clearInterval(checkActive)
  }, [])

  const [userProject, setUserProject] = useState('');
  useEffect(() => {
    if (currentUserHiredApplicationsLoaded) {
      setUserProject(currentUserHiredApplications.map(app => app?.project).flat().join(', '));
    }
  },
    [currentUserHiredApplicationsLoaded])

  return (
    <JobLandingLayout user={currentUser} afterSelection={candidateSelected}>

      <div className='candidate__User__Profile__Page'>
        <div className="user__Page__Container user">

          <div className="user__Intro__Item__Container">
            <div className="user__Intro__Item">
              <h2>User Name</h2>
              <span>{currentUser.userinfo.username}</span>
            </div>
            <ClaimVouchar />

          </div>
          <div className="user__Intro__Item">
            <h2>Email</h2>
            <span>{currentUser.userinfo.email}</span>
          </div>
          <div className="user__Intro__Item">
            <h2>First Name</h2>
            <span>{currentUser.userinfo.first_name}</span>
          </div>
          {
            currentUser.userinfo.last_name !== "" &&
            <div className="user__Intro__Item">
              <h2>Last Name</h2>
              <span>{currentUser.userinfo.last_name}</span>
            </div>
          }
          <div className="user__Intro__Item" style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <h2>Active Status</h2>
            <div style={success ? successStatus : failedStatus}></div>
          </div>
          <div className="user__Intro__Item">
            <h2>Role</h2>
            <span>Candidate</span>
          </div>
          <div className="user__Intro__Item">
            <h2>Job hired for</h2>
            <span>
              {
                currentUser?.candidateAssignmentDetails?.jobsAppliedFor?.join(", ")
              }
            </span>
          </div>
          {
            userProject !== "" &&
            <div className="user__Intro__Item">
              <h2>Project(s)</h2>
              <span>{userProject}</span>
            </div>
          }
          <button className="logout__Btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </JobLandingLayout>
  )
}

export default UserScreen;
const defaultStatus = {
  backgroundColor: "gray",
  width: 10,
  height: 10,
  borderRadius: "50%"
}
const successStatus = { ...defaultStatus, backgroundColor: "green" };
const failedStatus = { ...defaultStatus, backgroundColor: "red" }; 