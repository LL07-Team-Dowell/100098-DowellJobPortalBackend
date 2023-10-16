import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { FaRankingStar } from "react-icons/fa6";
import { AiOutlinePlusCircle } from "react-icons/ai";

const ProjectLeadReportsLandingPage = () => {
  const navigate = useNavigate();

  return (
    <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
      <div
        className="create_team_parent report"
        style={{ padding: "20px 20px 200px" }}
      >
        <div
          className="Create_Team"
          onClick={() => navigate("detailed-individual-report")}
        >
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Individual report</h4>
            <p>
              Get well-detailed actionable insights on hired individuals in your
              organization
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
            <p>Get insights into the top performers in your organization</p>
          </div>
        </div>
        <div className="Create_Team" onClick={() => navigate("task-report")}>
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Work log report</h4>
            <p>
              Get insights into tasks uploaded per project in your organization
            </p>
          </div>
        </div>
        <div className="Create_Team" onClick={() => navigate("team-report")}>
          <div>
            <div>
              <AiOutlinePlusCircle className="icon" />
            </div>
            <h4>Team report</h4>
            <p>
              Get insights into how well teams are performing in your
              organization
            </p>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectLeadReportsLandingPage;
