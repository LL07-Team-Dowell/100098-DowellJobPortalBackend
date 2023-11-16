import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";

const LogRequestLanding = () => {
  const navigate = useNavigate();
  return (
    <StaffJobLandingLayout
      teamleadView={true}
      hideTitleBar={false}
      hideSearchBar={true}
      pageTitle={"Log Requests"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size="1.5rem" />}
      handleNavIcon={() => navigate(-1)}
    >
      <div className="new__task__container">
        <TitleNavigationBar title="Log Requests" hideBackBtn={true} />
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            paddingBottom: "12rem",
          }}
        >
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className="Create_Team"
            onClick={() => navigate("/lead-log-requests")}
          >
            <div>
              <div>
                <AiOutlineTeam className="icon" style={{ fontSize: "2rem" }} />
              </div>
              <h4>Check TeamLead Requests</h4>
              <p style={{ fontSize: "0.8rem" }}>Check your log requests</p>
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className="Create_Team"
            onClick={() => navigate("/log-requests")}
          >
            <div>
              <div>
                <AiOutlineTeam className="icon" style={{ fontSize: "2rem" }} />
              </div>
              <h4>Check Team Members Request</h4>
              <p style={{ fontSize: "0.8rem" }}>
                Check your team members Worklog requests to approve or decline
                them
              </p>
            </div>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default LogRequestLanding;
