import React, { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { AddProjectPopup } from "../Add/Add";
import { dowellProjects } from "../../../../utils/utils";

const Project = () => {
  const navigate = useNavigate();
  const [showProjectsPop, setShowProjectsPop] = useState(false);
  const { state } = useLocation();
  const { projectsLoading, projectsAdded, subProjectsAdded } = useJobContext();
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [inactiveProjects, setInactiveProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [inputProjects, setInputProjects] = useState([]);

  useEffect(() => {
    if (state && state.showProject && state?.showProject === true) {
      setShowProjectsPop(true);

      // RESET STATE TO PREVENT PROJECT MODAL FROM POPPING UP AFTER EVERY RELOAD
      window.history.replaceState({}, "/100098-DowellJobPortal/#/projects");
    }
  }, []);

  useEffect(() => {
    const projectsToDisplay = dowellProjects
      .filter(
        (project) =>
          !projectsAdded[0]?.project_list.includes(project.project_name)
      )
      .sort((a, b) => a.project_name.localeCompare(b.project_name));
    setDisplayedProjects(projectsToDisplay);
    console.log(dowellProjects[0]["project_name"]); 

    if (
      projectsAdded[0]?.inactive_project_list &&
      Array.isArray(projectsAdded[0]?.inactive_project_list)
    ) {
      setInactiveProjects(projectsAdded[0]?.inactive_project_list);
    }

    const subProjectList = subProjectsAdded.find(
      (item) => item.parent_project === selectedProject
    )?.sub_project_list;

    console.log(subProjectList);

    if (!subProjectList) return setInputProjects([]);
    setInputProjects(subProjectList.sort((a, b) => a.localeCompare(b)));
  }, []);

  const showProjectPopup = () => {
    setShowProjectsPop(true);
  };
  const unshowProjectPopup = () => {
    setShowProjectsPop(false);
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Projects"}
      newSidebarDesign={true}
      hideSideBar={showProjectsPop}
    >
      <div className={styles.wrapper}>
        <section className={styles.top__Nav__Content}>
          <h2>Projects</h2>
          <button
            onClick={projectsLoading ? () => {} : () => showProjectPopup()}
          >
            <AiOutlinePlus />
            <span>Add</span>
          </button>
          {projectsLoading ? (
            <div
              style={{
                margin: "1rem auto",
                width: "max-content",
                backgroundColor: "#fff",
              }}
            >
              <LoadingSpinner />
            </div>
          ) : null}
        </section>
        {React.Children.toArray(
          projectsAdded[0]?.project_list.map((project) => {
            return <p>{project}</p>;
          })
        )}
        {React.Children.toArray(
          inputProjects.map((subProject) => {
            return <p>{subProject}</p>;
          })
        )}
      </div>
      {showProjectsPop && (
        <AddProjectPopup unshowProjectPopup={unshowProjectPopup} />
      )}
    </StaffJobLandingLayout>
  );
};

export default Project;
