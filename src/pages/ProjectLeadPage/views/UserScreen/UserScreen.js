import React, { useEffect, useState } from "react";
import "./style.css";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useNavigate } from "react-router-dom";
import { getUserLiveStatus, postUserLiveStatus } from "../../../../services/commonServices";
import { teamManagementProductName } from "../../../../utils/utils";
import { ApproveVouchar, ClaimVouchar } from "../../../TeamleadPage/views/ClaimVouchar/ClaimVouchar";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";


const ProjectLeadUserScreen = () => {
    const { currentUser/*, currentUserHiredApplications*/ } = useCurrentUserContext();
    const [success, setsuccsess] = useState(false);
    const navigate = useNavigate();
    // const userProject = currentUserHiredApplications.map(app => app?.project).flat().join(', ');

    useEffect(() => {
        const checkActive = setInterval(() => {
            Promise.all([
                getUserLiveStatus(),
                postUserLiveStatus({ product: teamManagementProductName, session_id: sessionStorage.getItem("session_id") })])
                .then(resp => {
                    console.log(resp[0], resp[1]);
                    if (resp[0]) {
                        setsuccsess(true);
                    }
                })
                .catch(err => { console.log(err[0], err[1]); setsuccsess(false); });
        }, 60000)
        return () => clearInterval(checkActive)
    }, [])

    const handleLogout = () => navigate("/logout");

    return <StaffJobLandingLayout
        projectLeadView={true}
        hideSearchBar={true}
    >
        <div className="user__Page__Container projLead">
            {
                <>
                    <ClaimVouchar />
                    <ApproveVouchar />
                </>
            }
            <div className="user__Intro__Item__Container">
                <div className="user__Intro__Item">
                    <h2>User Name</h2>
                    <span>{currentUser?.userinfo.username}</span>
                </div>
            </div>
            <div className="user__Intro__Item">
                <h2>Email</h2>
                <span>{currentUser?.userinfo.email}</span>
            </div>
            <div className="user__Intro__Item">
                <h2>First Name </h2>
                <span>{currentUser?.userinfo.first_name}</span>
            </div>
            {
                currentUser.last_name !== "" &&
                <div className="user__Intro__Item">
                    <h2>Last Name</h2>
                    <span>{currentUser?.userinfo.last_name}</span>
                </div>
            }
            <div className="user__Intro__Item">
                <h2>Role</h2>
                <span>
                    {
                        "Project Lead"
                    }
                </span>
            </div>
            <div className="user__Intro__Item" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <h2>Active Status</h2>
                <div style={success ? successStatus : failedStatus}></div>
            </div>
            <div className="user__Intro__Item">
                <h2>Project</h2>
                <span>
                    {currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project}
                    {
                        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
                            Array.isArray(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects) ?
                            ', ' + currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.join(', ')
                            :
                            ''
                    }
                </span>
            </div>
            {/* {
                userProject !== "" &&
                <div className="user__Intro__Item">
                    <h2>Project(s)</h2>
                    <span>{userProject}</span>
                </div>
            } */}
            <button className="logout__Btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    </StaffJobLandingLayout>
}

export default ProjectLeadUserScreen;

const defaultStatus = {
    backgroundColor: "gray",
    width: 10,
    height: 10,
    borderRadius: "50%"
}
const successStatus = { ...defaultStatus, backgroundColor: "green" };
const failedStatus = { ...defaultStatus, backgroundColor: "red" }; 