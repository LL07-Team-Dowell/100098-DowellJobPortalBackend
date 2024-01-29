import { useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { MdArrowBackIosNew } from "react-icons/md";
import { useEffect } from "react";
import {
  addProjectTime,
  getProjectTime,
  updateProjectTime,
  updateProjectTimeEnabled,
} from "../../../../services/projectTimeServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TimeDetails from "./components/TimeDetails/TimeDetails";
import Avatar from "react-avatar";
import { useJobContext } from "../../../../contexts/Jobs";
import { toast } from "react-toastify";
import SearchBar from "../../../../components/SearchBar/SearchBar";

const ProjectEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const project = urlParams.get("project");
  const id = urlParams.get("id");
  // const { id } = useParams();
  const [showEditView, setShowEditView] = useState(false);
  //  console.log(id)
  // console.log(project);

  const [projectTimeDetail, setProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
    project: project,
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
  });

  const [copyOfProjectTimeDetail, setCopyOfProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
    project: project,
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
  });

  const { subProjectsAdded } = useJobContext();

  const handleInputChange = (valueEntered, inputName) => {
    setCopyOfProjectTimeDetail((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (id) {
          setLoading(true);

          const projectDetails = await getProjectTime(
            currentUser.portfolio_info[0].org_id
          );

          const editProjectData = projectDetails?.data?.data;
          // console.log(projectDetails?.data?.data)

          // Find the object with the specific id
          const editDetails = editProjectData.find(
            (item) => item["_id"] === id
          );

          if (editDetails) {
            setProjectTimeDetail((prevDetails) => {
              return { ...prevDetails, ...editDetails };
            });
            setCopyOfProjectTimeDetail((prevDetails) => {
              return { ...prevDetails, ...editDetails };
            });
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleEditProjectTime = () => {
    if (showEditView) setCopyOfProjectTimeDetail(projectTimeDetail);

    setShowEditView(!showEditView);
  };

  const handleUpdate = async () => {
    try {
      if (id) {
        Promise.all([
          updateProjectTime({
            total_time: Number(copyOfProjectTimeDetail.total_time),
            document_id: id,
          }),
          updateProjectTimeEnabled({
            editing_enabled: copyOfProjectTimeDetail.editing_enabled,
            document_id: id,
          }),
        ])
          .then((res) => {
            const updateTotalTime = res[0].data;
            const updateEditing = res[1].data;
            console.log(updateEditing, updateTotalTime);

            updateTotalTime
              ? setCopyOfProjectTimeDetail((prevProjectDetail) => {
                  return {
                    ...prevProjectDetail,
                    total_time: copyOfProjectTimeDetail.total_time,
                  };
                })
              : setCopyOfProjectTimeDetail((prevProjectDetail) => {
                  return {
                    ...prevProjectDetail,
                    editing_enabled: copyOfProjectTimeDetail.editing_enabled,
                  };
                });

            toast.success("Update Successful");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const addNewProjectTime = await addProjectTime(copyOfProjectTimeDetail);
        // console.log(addNewProjectTime);
        setCopyOfProjectTimeDetail((prevDetails) => {
          return { ...prevDetails, ...addNewProjectTime };
        });
        toast.success("Job created successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    navigate(`/projects`);
  };

  // if (!id) {
  //   const addProjectDetails = await addProjectTime(projectTimeDetail);
  //   if (addProjectDetails.status === 200) {
  //     setProjectTimeDetail((prevData) => [...projectTimeDetail, ...prevData]);
  //     toast.success("Job created successfully");
  //   } else {
  //     toast.info("Something went wrong");
  //   }
  // } else {
  //   if (id) {
  //   }
  // }

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Projects"}
      handleNavIcon={() => navigate(-1)}
      newSidebarDesign={true}
    >
      <div className={styles.wrapper}>
        <div className={styles.edit__Nav__Content}>
          <button
            onClick={() => navigate(-1)}
            style={{
              borderRadius: "0.8rem",
              padding: "0 0.7rem",
              border: "none",
              backgroundColor: "#fff",
              boxShadow: "inset 0px 1.7px 8px rgba(0, 0, 0, 0.16)",
            }}
          >
            <MdArrowBackIosNew
              style={{
                color: "#005734",
                fontSize: 25,
                cursor: "pointer",
              }}
            />
          </button>
          <h2>Project Details</h2>
        </div>
        <div className={styles.project__details__bg}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <button
                className={styles.project__name__heading}
                onClick={handleEditProjectTime}
              >
                <h2>{showEditView ? "Cancel editing" : "Edit project time"}</h2>
              </button>
              {!showEditView ? (
                <>
                  <div>
                    <h3>Teamlead Detail</h3>
                    <div className={styles.project__Time__lead__Display}>
                      <Avatar
                        name={projectTimeDetail.lead_name}
                        round={true}
                        size="3.2rem"
                      />
                      <div className={styles.project__Team__Lead}>
                        <p>{projectTimeDetail.lead_name}</p>
                        <span className={styles.lead__Hightlight__Item}>
                          {project}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.project__Time__Overview}>
                    <TimeDetails
                      title={"Spent time"}
                      time={projectTimeDetail.spent_time}
                    />
                    <TimeDetails
                      title={"Left time"}
                      time={projectTimeDetail.left_time}
                    />
                    <TimeDetails
                      title={"Total time"}
                      time={projectTimeDetail.total_time}
                    />
                  </div>

                  <div
                    style={{
                      maxWidth: 250,
                      margin: "0 auto",
                      padding: "2rem 1rem",
                    }}
                  >
                    <CircularProgressbar
                      value={
                        projectTimeDetail?.total_time === 0
                          ? 0.0
                          : Number(
                              (projectTimeDetail.spent_time /
                                projectTimeDetail.total_time) *
                                100
                            ).toFixed(2)
                      }
                      text={
                        projectTimeDetail?.total_time === 0
                          ? "0.00%"
                          : `${Number(
                              (projectTimeDetail.spent_time /
                                projectTimeDetail.total_time) *
                                100
                            ).toFixed(2)}%`
                      }
                      styles={buildStyles({
                        pathColor: `#005734`,
                        textColor: "#005734",
                        trailColor: "#efefef",
                        backgroundColor: "#005734",
                      })}
                    />
                  </div>

                  <TimeDetails
                    title={"Subprojects"}
                    isSubproject={true}
                    subprojects={
                      subProjectsAdded.find(
                        (item) => item.parent_project === project
                      )?.sub_project_list
                    }
                  />
                </>
              ) : (
                <>
                  <div
                    style={{
                      maxWidth: 250,
                      margin: "0 auto",
                      padding: "2rem 1rem",
                    }}
                  >
                    <CircularProgressbar
                      value={
                        projectTimeDetail?.total_time === 0
                          ? 0.0
                          : Number(
                              (projectTimeDetail.spent_time /
                                projectTimeDetail.total_time) *
                                100
                            ).toFixed(2)
                      }
                      text={
                        projectTimeDetail?.total_time === 0
                          ? "0.00%"
                          : `${Number(
                              (projectTimeDetail.spent_time /
                                projectTimeDetail.total_time) *
                                100
                            ).toFixed(2)}%`
                      }
                      styles={buildStyles({
                        pathColor: `#005734`,
                        textColor: "#005734",
                        trailColor: "#efefef",
                        backgroundColor: "#005734",
                      })}
                    />
                  </div>
                  <div>
                    <div className={styles.editing__project}>
                      <label htmlFor="editing_enabled"></label>
                      <div className={styles.is__active}>
                        <input
                          className={styles.active__checkbox}
                          type="checkbox"
                          name={"editing_enabled"}
                          checked={copyOfProjectTimeDetail.editing_enabled}
                          onChange={(e) =>
                            handleInputChange(e.target.checked, e.target.name)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    {copyOfProjectTimeDetail.editing_enabled ? (
                      <>
                        <div className={styles.job__details}>
                          <label htmlFor="lead_name">Lead Name</label>
                          <input
                            type="text"
                            id="lead_name"
                            name="lead_name"
                            placeholder="Enter lead name"
                            value={copyOfProjectTimeDetail.lead_name}
                            onChange={(e) =>
                              handleInputChange(e.target.value, e.target.name)
                            }
                          />
                        </div>
                        <div className={styles.job__details}>
                          <label htmlFor="total_time">Total Time</label>
                          <input
                            type="text"
                            id="total_time"
                            name="total_time"
                            placeholder="Enter total time"
                            value={copyOfProjectTimeDetail.total_time}
                            onChange={(e) =>
                              handleInputChange(e.target.value, e.target.name)
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.job__details}>
                          <label htmlFor="lead_name">Lead Name</label>
                          <input
                            type="text"
                            id="lead_name"
                            name="lead_name"
                            placeholder="Enter lead name"
                            value={copyOfProjectTimeDetail.lead_name}
                            onChange={(e) =>
                              handleInputChange(e.target.value, e.target.name)
                            }
                            disabled
                          />
                        </div>
                        <div className={styles.job__details}>
                          <label htmlFor="total_time">Total Time</label>
                          <input
                            type="text"
                            id="total_time"
                            name="total_time"
                            placeholder="Enter total time"
                            value={Number(copyOfProjectTimeDetail.total_time)}
                            onChange={(e) =>
                              handleInputChange(e.target.value, e.target.name)
                            }
                            disabled
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.project__btn}>
                    <button
                      className={styles.project__submit}
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectEdit;
