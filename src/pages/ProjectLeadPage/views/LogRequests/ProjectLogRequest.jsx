import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Wrappen } from "../../../CandidatePage/views/TeamScreenThread/style";
import WorkLogRequest from "../../../TeamleadPage/views/WorkLogRequest/WorkLogRequest";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";

const ProjectLogRequest = () => {
    const { currentUser } = useCurrentUserContext();
    const navigate = useNavigate();
  const [cardData, setCardData] = useState("Pending approval");
  // sadsadasd
  return (
    <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
      <div style={{ height: "130%" }}>
        <TitleNavigationBar
          title="Work Log Requests"
          hideBackBtn={true}
          handleBackBtnClick={() => navigate(-1)}
        />
        <Wrappen>
          <NavLink
            className={cardData === "Pending approval" && "isActive"}
            onClick={() => {
              setCardData("Pending approval");
            }}
            to={"/log-requests?tab=pending-approval"}
          >
            Pending approval
          </NavLink>
          <NavLink
            className={cardData === "Approved" && "isActive"}
            onClick={() => {
              setCardData("Approved");
            }}
            to={"/log-requests?tab=approved"}
          >
            Approved
          </NavLink>
          <NavLink
            className={cardData === "Denied" && "isActive"}
            onClick={() => {
              setCardData("Denied");
            }}
            to={"/log-requests?tab=denied"}
          >
            Denied
          </NavLink>
        </Wrappen>
        <WorkLogRequest cardData={cardData} />
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectLogRequest;
