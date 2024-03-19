import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useState } from "react";
import './index.scss';
import { FaRankingStar } from 'react-icons/fa6'
import { TfiAgenda } from "react-icons/tfi";
import { TbReportSearch } from "react-icons/tb";
import { SiAwsorganizations } from "react-icons/si";
import { AiOutlineTeam } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";

const ReportPages = ({ subAdminView }) => {
  const navigate = useNavigate();
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      hideSideBar={showCustomTimeModal}
      subAdminView={subAdminView}
      newSidebarDesign={!subAdminView ? true : false}
    >
      <div className="create_team_parent report" style={{ padding: '20px 20px 200px' }}>
        <div
          className="Create_Team"
          onClick={() => navigate("agenda-report")}
        >
          <div>
            <div>
              <TfiAgenda className="icon" />
            </div>
            <h4>Agenda report</h4>
            <p>
              Get insights into the agenda items and weekly progress in your organization
            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("detailed-individual-report")}
        >
          <div>
            <div>
              <TbReportSearch className="icon" />
            </div>
            <h4>Individual report</h4>
            <p>
              Get well-detailed actionable insights on hired individuals in your organization
            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("leaderboard-report")}
        >
          <div>
            <div>
              <FaRankingStar className="icon" />
            </div>
            <h4>Leaderboard report</h4>
            <p>
              Get insights into the most active users in your organization
            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("organization-report")}
        >
          <div>
            <div>
              <SiAwsorganizations className="icon" />
            </div>
            <h4>Organization report</h4>
            <p>
              Unlock the power of data by gaining valuable insights with our organization report.

            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("task-report")}
        >
          <div>
            <div>
              <FaTasks className="icon" />
            </div>
            <h4>Project report</h4>
            <p>
              Get insights into the progress of active projects in your organization
            </p>
          </div>
        </div>
        <div
          className="Create_Team"
          onClick={() => navigate("team-report")}
        >
          <div>
            <div>
              <AiOutlineTeam className="icon" />
            </div>
            <h4>Team report</h4>
            <p>
              Get insights into how well teams are performing in your organization
            </p>
          </div>
        </div>
        {/* <div
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
        </div> */}
      </div>
    </StaffJobLandingLayout>
  );
};

export default ReportPages;
