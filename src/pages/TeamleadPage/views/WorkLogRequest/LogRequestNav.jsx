import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Wrappen } from "../../../CandidatePage/views/TeamScreenThread/style";
import WorkLogRequest from "./WorkLogRequest";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";

const LogRequest = () => {
    const { currentUser } = useCurrentUserContext();
  const [cardData, setCardData] = useState("Pending approval");
  // sadsadasd
  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
    <div style={{ height: "130%" }}>
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
    </JobLandingLayout>
  );
};

export default LogRequest;
