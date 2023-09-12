import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useState } from "react";
import './index.scss';

const ReportPages = () => {
  const navigate = useNavigate();
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      hideSideBar={showCustomTimeModal}
    >
      <div className="create_team_parent report" style={{ padding: '20px 20px 200px' }}>
        <div
          className="Create_Team"
          onClick={() => navigate("organization-report")}
        >
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Organization report</h4>
            <p>
            Unlock the power of data by gaining valuable insights with our organization report. 

            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("detailed-individual-report")}
        >
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Detailed individual report</h4>
            <p>
              Bring everyone together and get to work. Work together in team to
              increase productivity
            </p>
          </div>
        </div>
        <div className="Create_Team" onClick={() => navigate("task-report")}>
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Task report</h4>
            <p>
              Bring everyone together and get to work. Work together in team to
              increase productivity
            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("individual-task-report")}
        >
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Individual task report</h4>
            <p>
              Bring everyone together and get to work. Work together in team to
              increase productivity
            </p>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default ReportPages;
