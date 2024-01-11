import React, { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { AddProjectPopup } from "../Add/Add";

const ProjectTime = () => {
  const navigate = useNavigate();
  const [showProjectsPop, setShowProjectsPop] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    if (state && state.showProject && state?.showProject === true) {
      setShowProjectsPop(true);

      // RESET STATE TO PREVENT PROJECT MODAL FROM POPPING UP AFTER EVERY RELOAD
      window.history.replaceState({}, "/100098-DowellJobPortal/#/projects");
    }
  }, []);

  const showProjectPopup = () => {
    setShowProjectsPop(true);
  };
  const unshowProjectPopup = () => {
    setShowProjectsPop(false);
  };

  const { projectsLoading, projectsAdded } = useJobContext();

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
      </div>
      {showProjectsPop && (
        <AddProjectPopup unshowProjectPopup={unshowProjectPopup} />
      )}
    </StaffJobLandingLayout>
  );
};

export default ProjectTime;
