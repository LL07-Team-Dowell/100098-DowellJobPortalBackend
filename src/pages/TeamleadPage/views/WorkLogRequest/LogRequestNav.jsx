import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Wrappen } from "../../../CandidatePage/views/TeamScreenThread/style";
import WorkLogRequest from "./WorkLogRequest";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";

const LogRequest = () => {
    const { currentUser } = useCurrentUserContext();
  const [cardData, setCardData] = useState("Pending approval");
  // sadsadasd
  return (
    <StaffJobLandingLayout
      teamleadView={true}
      hideSearchBar={true}
    >
    <div style={{ height: "130%" }}>
      <h1
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.8rem',
          width: '86%',
          margin: '0 auto',
          color: '#005734',
          letterSpacing: '0.03em'
        }} 
      >Work log requests</h1>
      <Wrappen>
        <NavLink
          className={cardData === "Pending approval" && "isActive"}
          onClick={() => {
            setCardData("Pending approval");
          }}
          to={"/request?tab=pending-approval"}
        >
          Pending approval
        </NavLink>
        <NavLink
          className={cardData === "Approved" && "isActive"}
          onClick={() => {
            setCardData("Approved");
          }}
          to={"/request?tab=approved"}
        >
          Approved
        </NavLink>
        <NavLink
          className={cardData === "Denied" && "isActive"}
          onClick={() => {
            setCardData("Denied");
          }}
          to={"/request?tab=denied"}
        >
          Denied
        </NavLink>
      </Wrappen>
      <WorkLogRequest cardData={cardData} />
    </div>
    </StaffJobLandingLayout>
  );
};

export default LogRequest;
