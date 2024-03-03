import React, { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import arrowright from "../Landingpage/assets/arrowright.svg";
import styles from "./styles.module.css";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { AddProjectPopup } from "../Add/Add";
import { dowellProjects } from "../../../../utils/utils";
import { getProjectTime } from "../../../../services/projectTimeServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import UserIconsInfo from "../../../../common/screens/CompanyStructure/components/UsersIconsInfo/UserIconsInfo";

const Project = ({ _id }) => {
  const navigate = useNavigate();
  const [showProjectsPop, setShowProjectsPop] = useState(false);
  const { state } = useLocation();
  const { projectsLoading, projectsAdded, subProjectsAdded } = useJobContext();
  console.log(projectsAdded);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [inactiveProjects, setInactiveProjects] = useState([]);
  const { currentUser } = useCurrentUserContext();
  const [projectTime, setProjectTime] = useState([]);
  console.log(projectTime);
  const [searchValue, setSearchValue] = useState("");
  const [projectTimeLoading, setProjectTimeLoading] = useState(false);

  useEffect(() => {
    if (state && state.showProject && state?.showProject === true) {
      setShowProjectsPop(true);

      // RESET STATE TO PREVENT PROJECT MODAL FROM POPPING UP AFTER EVERY RELOAD
      window.history.replaceState({}, "/100098-DowellJobPortal/#/projects");
    }

    //Getting project time
    setProjectTimeLoading(true);
    getProjectTime(currentUser.portfolio_info[0].org_id).then((res) => {
      setProjectTime(
        res?.data?.data?.filter(
          (project) =>
            project?.data_type === currentUser.portfolio_info[0].data_type
        )
      );
      setProjectTimeLoading(false);
      console.log(projectTime);
    });

    //Getting of Projects (Active/Inactive projects)
    const projectsToDisplay = dowellProjects
      .filter(
        (project) =>
          !projectsAdded[0]?.project_list.includes(project.project_name)
      )
      .sort((a, b) => a.project_name.localeCompare(b.project_name))
      .includes(searchValue);
    setDisplayedProjects(projectsToDisplay);
    console.log(dowellProjects["project_name"]);
    console.log(displayedProjects);

    if (
      projectsAdded[0]?.inactive_project_list &&
      Array.isArray(projectsAdded[0]?.inactive_project_list)
    ) {
      setInactiveProjects(projectsAdded[0]?.inactive_project_list);
    }
  }, []);

  const showProjectPopup = () => {
    setShowProjectsPop(true);
  };
  const unshowProjectPopup = () => {
    setShowProjectsPop(false);
  };

  const editProjects = (project) => {
    //using URLSearchParams to extract the url parameters
    const editProjectTime = projectTime.find(
      (item) => item.project === project
    );

    const editProjectTimeId = editProjectTime ? editProjectTime._id : null;

    const editUrlParameters = new URLSearchParams({
      project: project,
      id: editProjectTimeId,
    });

    navigate(`/projects/edit-project-time/?${editUrlParameters.toString()}`);
  };

  // const handleSearchChange = (value) => {
  //   console.log(value);
  //   setSearchValue(value);
  // };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Projects"}
      newSidebarDesign={true}
      hideSideBar={showProjectsPop}
    >
      {projectTimeLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.search__bar}>
            <div className={styles.search__project__Navigation__Bar}>
              <AiOutlineSearch className={styles.search__project__icon} />
              <input
                type="text"
                placeholder="Search project"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <section className={styles.top__Nav__Content}>
            <h2>Projects</h2>
            <button
              onClick={projectsLoading ? () => {} : () => showProjectPopup()}
            >
              <AiOutlinePlus />
              <span>Add</span>
            </button>
          </section>
          <div className={styles.project__cards}>
            {searchValue.length > 0 ? (
              projectsAdded[0]?.project_list
                .sort((a, b) => a.localeCompare(b))
                .filter((project) =>
                  project
                    .replaceAll(" ", "")
                    .toLocaleLowerCase()
                    .includes(
                      searchValue.toLocaleLowerCase().replaceAll(" ", "")
                    )
                ).length < 1 ? (
                <p>No projects found matching {searchValue}</p>
              ) : (
                React.Children.toArray(
                  projectsAdded[0]?.project_list
                    .sort((a, b) => a.localeCompare(b))
                    .filter((project) =>
                      project
                        .replaceAll(" ", "")
                        .toLocaleLowerCase()
                        .includes(
                          searchValue.toLocaleLowerCase().replaceAll(" ", "")
                        )
                    )
                    .map((project) => {
                      return (
                        <div className={styles.project__card}>
                          <div className={styles.project__card__header}>
                            <h2>{project}</h2>
                            <>
                              {projectTime.find(
                                (item) => item.project === project
                              ) ? (
                                <div style={{ width: 60, height: 60 }}>
                                  <CircularProgressbar
                                    value={Number(
                                      (projectTime.find(
                                        (item) => item.project === project
                                      ).spent_time /
                                        projectTime.find(
                                          (item) => item.project === project
                                        ).total_time) *
                                        100
                                    ).toFixed(2)}
                                    text={`${Number(
                                      (projectTime.find(
                                        (item) => item.project === project
                                      ).spent_time /
                                        projectTime.find(
                                          (item) => item.project === project
                                        ).total_time) *
                                        100
                                    ).toFixed(2)}%`}
                                    styles={buildStyles({
                                      pathColor: `#005734`,
                                      textColor: "#005734",
                                      trailColor: "#efefef",
                                      backgroundColor: "#005734",
                                    })}
                                  />
                                </div>
                              ) : (
                                <div style={{ width: 60, height: 60 }}>
                                  <CircularProgressbar
                                    value={0}
                                    text={"0%"}
                                    styles={buildStyles({
                                      pathColor: `#005734`,
                                      textColor: "#005734",
                                      trailColor: "#efefef",
                                      backgroundColor: "#005734",
                                    })}
                                  />
                                </div>
                              )}
                            </>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "1.5rem",
                              alignItems: "flex-end",
                              minHeight: "4rem",
                            }}
                          >
                            <UserIconsInfo
                              items={
                                subProjectsAdded.find(
                                  (item) => item.parent_project === project
                                )?.sub_project_list
                              }
                              numberOfIcons={3}
                              isNotEmployeeItem={true}
                            />
                            <button
                              className={styles.view__project__btn__container}
                              onClick={() => editProjects(project)}
                            >
                              <div className={styles.view__project__btn}>
                                <span>View</span>{" "}
                                <img
                                  src={arrowright}
                                  alt=""
                                  className={styles.arrow__link}
                                />
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    })
                )
              )
            ) : (
              React.Children.toArray(
                projectsAdded[0]?.project_list
                  .sort((a, b) => a.localeCompare(b))
                  .map((project) => {
                    return (
                      <div className={styles.project__card}>
                        <div className={styles.project__card__header}>
                          <h2>{project}</h2>
                          <>
                            {projectTime.find(
                              (item) => item.project === project
                            ) ? (
                              <div style={{ width: 60, height: 60 }}>
                                <CircularProgressbar
                                  value={Number(
                                    (projectTime.find(
                                      (item) => item.project === project
                                    ).spent_time /
                                      projectTime.find(
                                        (item) => item.project === project
                                      ).total_time) *
                                      100
                                  ).toFixed(2)}
                                  text={`${Number(
                                    (projectTime.find(
                                      (item) => item.project === project
                                    ).spent_time /
                                      projectTime.find(
                                        (item) => item.project === project
                                      ).total_time) *
                                      100
                                  ).toFixed(2)}%`}
                                  styles={buildStyles({
                                    pathColor: `#005734`,
                                    textColor: "#005734",
                                    trailColor: "#efefef",
                                    backgroundColor: "#005734",
                                  })}
                                />
                              </div>
                            ) : (
                              <div style={{ width: 60, height: 60 }}>
                                <CircularProgressbar
                                  value={0}
                                  text={"0%"}
                                  styles={buildStyles({
                                    pathColor: `#005734`,
                                    textColor: "#005734",
                                    trailColor: "#efefef",
                                    backgroundColor: "#005734",
                                  })}
                                />
                              </div>
                            )}
                          </>
                        </div>
                        {projectTime ? (
                          <>
                            <br />
                            <p className={styles.project_time}>
                              Spent time:{" "}
                              <>
                                {
                                  projectTime.find(
                                    (item) => item.project === project
                                  ) ?
                                    Number(
                                      projectTime.find(
                                          (item) => item.project === project
                                        )?.spent_time
                                      ).toLocaleString("en-US", {
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  :
                                  0
                                }
                              </>
                              <span>Hours</span>
                            </p>
                            <p className={styles.project_time}>
                              Total time:{" "}
                              <>
                              {
                                projectTime.find(
                                  (item) => item.project === project
                                ) ?
                                  Number(
                                    projectTime.find(
                                      (item) => item.project === project
                                    )?.total_time
                                  ).toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })
                                :
                                0
                              }
                              </>
                              <span>Hours</span>
                            </p>
                          </>
                        ) : null}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "1.5rem",
                            alignItems: "flex-end",
                            minHeight: "4rem",
                          }}
                        >
                          <UserIconsInfo
                            items={
                              subProjectsAdded.find(
                                (item) => item.parent_project === project
                              )?.sub_project_list
                            }
                            numberOfIcons={3}
                            isNotEmployeeItem={true}
                          />
                          <button
                            className={styles.view__project__btn__container}
                            onClick={() => editProjects(project)}
                          >
                            <div className={styles.view__project__btn}>
                              <span>View</span>{" "}
                              <img
                                src={arrowright}
                                alt=""
                                className={styles.arrow__link}
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )
            )}
          </div>
        </div>
      )}
      {showProjectsPop && (
        <AddProjectPopup unshowProjectPopup={unshowProjectPopup} />
      )}
    </StaffJobLandingLayout>
  );
};

export default Project;
