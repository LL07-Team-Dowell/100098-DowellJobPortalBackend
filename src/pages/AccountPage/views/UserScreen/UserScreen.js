import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import "./style.css";
import { getUserLiveStatus, postUserLiveStatus } from "../../../../services/commonServices";
import { teamManagementProductName } from "../../../../utils/utils";
import ClaimVouchar from "../../../TeamleadPage/views/ClaimVouchar/ClaimVouchar";


const UserScreen = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();
    const handleLogout = () => navigate("/logout");
    const [success, setsuccsess] = useState(false);

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
    })

    return <>
        <div className="user__Page__Container account">
            {
                <ClaimVouchar />
            }
            <div className="user__Intro__Item__Container">
                <div className="user__Intro__Item">
                    <h2>User Name</h2>
                    <span>{ currentUser.userinfo.username }</span>    
                </div>
            </div>
            <div className="user__Intro__Item">
                <h2>Email</h2>
                <span>{currentUser.userinfo.email}</span>
            </div>
            <div className="user__Intro__Item">
                <h2>First Name</h2>
                <span>{currentUser?.userinfo.first_name}</span>
            </div>
            {
                currentUser.last_name !== "" &&
                <div className="user__Intro__Item">
                    <h2>Last Name</h2>
                    <span>{currentUser?.userinfo.last_name}</span>
                </div>
            }
            <div className="user__Intro__Item" style={{display:"flex",gap:5,alignItems:"center"}}>
                <h2>Active Status</h2>
                <div style={success ? successStatus : failedStatus}></div>
            </div>
            <div className="user__Intro__Item">
                <h2>Role</h2>
                <span>{"Account"}</span>
            </div>
            <button className="logout__Btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    </>
}

export default UserScreen;

const defaultStatus = {
    backgroundColor:"gray" ,
    width:10,
    height:10,
    borderRadius:"50%"
}
const successStatus = {...defaultStatus , backgroundColor:"green"} ; 
const failedStatus = {...defaultStatus , backgroundColor:"red"} ; 
