import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Wrappen } from "../../../CandidatePage/views/TeamScreenThread/style";
import WorkLogRequest from "../../../TeamleadPage/views/WorkLogRequest/WorkLogRequest";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import { useEffect } from "react";
import { getSettingUserProject } from "../../../../services/hrServices";

const ProjectLogRequest = () => {
    const { currentUser } = useCurrentUserContext();
    const navigate = useNavigate();
  const [cardData, setCardData] = useState("Pending approval");
  const {
    allProjects,
    setAllProjects,
  } = useCandidateTaskContext();

  useEffect(() => {
    if (allProjects.length > 0) return

    getSettingUserProject().then((res) => {
      const projectsGotten = res.data
      ?.filter(
        (project) =>
          project?.data_type === currentUser.portfolio_info[0].data_type &&
          project?.company_id === currentUser.portfolio_info[0].org_id &&
          project.project_list &&
          project.project_list.every(
            (listing) => typeof listing === "string"
          )
      )
      ?.reverse()
      
      let allProjectsFetched;

      if (projectsGotten.length > 0) {
        allProjectsFetched = projectsGotten[0]?.project_list.sort((a, b) => a.localeCompare(b));
        setAllProjects(allProjectsFetched);
      }
    }).catch(err => {
      console.log('err fetching projects for project lead: ', err?.response?.data);
    })
  }, [])

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
        <WorkLogRequest 
          cardData={cardData} 
          isProjectLead={true}
          allProjectsForLeadPassed={allProjects}
        />
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectLogRequest;
