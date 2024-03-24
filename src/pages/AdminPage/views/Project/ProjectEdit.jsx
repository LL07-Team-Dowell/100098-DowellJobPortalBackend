import React, { useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import { MdArrowBackIosNew } from "react-icons/md";
import { useEffect } from "react";
import {
  addProjectTime,
  getSingleProjectTime,
  updateProjectTime,
  updateProjectTimeEnabled,
} from "../../../../services/projectTimeServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useGithubContext } from "../../../../contexts/GithubReportContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TimeDetails from "./components/TimeDetails/TimeDetails";
import Avatar from "react-avatar";
import { useJobContext } from "../../../../contexts/Jobs";
import { toast } from "react-toastify";
import { useCompanyStructureContext } from "../../../../contexts/CompanyStructureContext";
import { labelColors } from "../../../../common/screens/CompanyStructure/utils/utils";
import Select from "react-select";
import CommitDetails from "./components/commitsDetails/CommitDetails";

const ProjectEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const [params, setParams] = useSearchParams();
  const [showEditView, setShowEditView] = useState(false);
  const [dataPosting, setDataPosting] = useState(false);
  const { githubReports } = useGithubContext();
  const [selectedRepository, setSelectedRepository] = useState("");

  const [projectTimeDetail, setProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
    project: params.get("project"),
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    is_continuous: false,
    repository_name: selectedRepository.label,
  });

  const [copyOfProjectTimeDetail, setCopyOfProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
    project: params.get("project"),
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    is_continuous: false,
    repository_name: selectedRepository.label,
  });

  const { subProjectsAdded, applications } = useJobContext();
  const { companyStructure, companyStructureLoading } =
    useCompanyStructureContext();

  const handleInputChange = (valueEntered, inputName) => {
    setCopyOfProjectTimeDetail((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleTotalTimeChange = (valueEntered, inputName) => {
    const filteredValue = valueEntered.replace(/\D/g, "");
    setCopyOfProjectTimeDetail((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = filteredValue;
      return copyOfPrevValue;
    });
  };

  useEffect(() => {
    const foundProjectlead = companyStructure?.project_leads?.find((item) =>
      item?.projects_managed?.includes(params.get("project"))
    )?.project_lead;

    console.log("found project lead -> ", foundProjectlead);

    const fetchProjectDetails = async () => {
      try {
        if (params.get("id") && params.get("id") !== "null") {
          setLoading(true);

          // Find the specific project time object based on passed id
          const projectDetails = (await getSingleProjectTime(params.get("id")))
            .data?.data[0];

          if (projectDetails) {
            setProjectTimeDetail((prevDetails) => {
              return {
                ...prevDetails,
                ...projectDetails,
                lead_name: foundProjectlead,
              };
            });
            setCopyOfProjectTimeDetail((prevDetails) => {
              return {
                ...prevDetails,
                ...projectDetails,
                lead_name: foundProjectlead,
              };
            });
          }

          setLoading(false);
        } else {
          setProjectTimeDetail((prevDetail) => {
            return { ...prevDetail, lead_name: foundProjectlead };
          });
          setCopyOfProjectTimeDetail((prevDetail) => {
            return { ...prevDetail, lead_name: foundProjectlead };
          });
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params]);

  const options = githubReports.map((repo) => ({
    label: repo.repository_name,
    value: repo.repository_name,
  }));

  const handleEditProjectTime = () => {
    if (showEditView) setCopyOfProjectTimeDetail(projectTimeDetail);

    setShowEditView(!showEditView);
  };

  const handleUpdate = async () => {
    let newDocumentId;

    if (
      !copyOfProjectTimeDetail.lead_name ||
      copyOfProjectTimeDetail?.lead_name?.length < 1 ||
      isNaN(copyOfProjectTimeDetail.total_time) ||
      Number(copyOfProjectTimeDetail) < 0.01
    )
      return;

    setDataPosting(true);

    try {
      if (params.get("id") && params.get("id") !== "null") {
        await Promise.all([
          updateProjectTime({
            total_time: Number(copyOfProjectTimeDetail.total_time),
            document_id: params.get("id"),
            is_continuous: copyOfProjectTimeDetail.is_continuous,
            repository_name: copyOfProjectTimeDetail.repository_name,
          }),
          updateProjectTimeEnabled({
            editing_enabled: copyOfProjectTimeDetail.editing_enabled,
            document_id: params.get("id"),
          }),
        ])
          .then((res) => {
            const updateTotalTime = res[0]?.data;
            const updateEditing = res[1]?.data;
            // console.log(updateEditing, updateTotalTime);
            setProjectTimeDetail((prevProjectDetail) => {
              return {
                ...prevProjectDetail,
                total_time: copyOfProjectTimeDetail.total_time,
                is_continuous: copyOfProjectTimeDetail.is_continuous,
                editing_enabled: copyOfProjectTimeDetail.editing_enabled,
                repository_name: copyOfProjectTimeDetail.repository_name,
              };
            });

            toast.success("Project time updated successfully");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const addNewProjectTime = (
          await addProjectTime(copyOfProjectTimeDetail)
        ).data;
        // console.log(addNewProjectTime);
        newDocumentId = addNewProjectTime?.data?.inserted_id;
        setProjectTimeDetail((prevDetails) => {
          return { ...prevDetails, ...copyOfProjectTimeDetail };
        });
        toast.success("Project time configured successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setShowEditView(false);
      setDataPosting(false);

      return;
    }

    // navigate(`/projects/edit-project-time/?project=${project}&id=${id}`);
    setShowEditView(false);
    setDataPosting(false);

    if (newDocumentId) {
      window.history.replaceState(
        {},
        document.title,
        `/100098-DowellJobPortal/#/projects/edit-project-time/?project=${encodeURIComponent(
          params.get("project")
        )}&id=${encodeURIComponent(newDocumentId)}`
      );
    }
  };

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
            disabled={dataPosting ? true : false}
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
                    <h3>Lead Detail for {params.get("project")}</h3>
                    <div className={styles.project__Leads__Detail}>
                      <div className={styles.project__Time__lead__Display}>
                        <Avatar
                          name={
                            companyStructure?.project_leads?.find((item) =>
                              item?.projects_managed?.includes(
                                params.get("project")
                              )
                            )?.project_lead
                          }
                          round={true}
                          size="3.2rem"
                        />
                        <div className={styles.project__Team__Lead}>
                          <p>
                            {applications?.find(
                              (application) =>
                                application.username ===
                                companyStructure?.project_leads?.find((item) =>
                                  item?.projects_managed?.includes(
                                    params.get("project")
                                  )
                                )?.project_lead
                            )
                              ? applications?.find(
                                  (application) =>
                                    application.username ===
                                    companyStructure?.project_leads?.find(
                                      (item) =>
                                        item?.projects_managed?.includes(
                                          params.get("project")
                                        )
                                    )?.project_lead
                                )?.applicant
                              : companyStructure?.project_leads?.find((item) =>
                                  item?.projects_managed?.includes(
                                    params.get("project")
                                  )
                                )?.project_lead}
                          </p>
                          <span
                            className={styles.lead__Hightlight__Item}
                            style={{ backgroundColor: labelColors.projectLead }}
                          >
                            Project Lead
                          </span>
                        </div>
                      </div>
                      <div className={styles.project__Time__lead__Display}>
                        <Avatar
                          name={
                            applications?.find(
                              (application) =>
                                application.username ===
                                  companyStructure?.project_leads
                                  ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                  ?.projects?.find(item => item.project === params.get('project'))
                                  ?.team_lead
                            )
                            ? 
                              applications?.find(
                                (application) =>
                                  application.username ===
                                    companyStructure?.project_leads
                                    ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                    ?.projects?.find(item => item.project === params.get('project'))
                                    ?.team_lead
                              )?.applicant
                            : 
                            applications?.find(
                              (application) =>
                                application.username ===
                                  companyStructure?.project_leads
                                  ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                  ?.projects?.find(item => item.project === params.get('project'))
                                  ?.team_lead
                            )
                          }
                          round={true}
                          size="3.2rem"
                        />
                        <div className={styles.project__Team__Lead}>
                          <p>
                            {applications?.find(
                              (application) =>
                                application.username ===
                                  companyStructure?.project_leads
                                  ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                  ?.projects?.find(item => item.project === params.get('project'))
                                  ?.team_lead
                            )
                              ? applications?.find(
                                  (application) =>
                                    application.username ===
                                      companyStructure?.project_leads
                                      ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                      ?.projects?.find(item => item.project === params.get('project'))
                                      ?.team_lead
                                )?.applicant
                              : 
                                applications?.find(
                                  (application) =>
                                    application.username ===
                                      companyStructure?.project_leads
                                      ?.find(item => item?.projects?.find(structure => structure?.project === params.get('project')))
                                      ?.projects?.find(item => item.project === params.get('project'))
                                      ?.team_lead
                                )
                              }
                          </p>
                          <span
                            className={styles.lead__Hightlight__Item}
                            style={{ backgroundColor: labelColors.teamlead }}
                          >
                            Team Lead
                          </span>
                        </div>
                      </div>
                      {companyStructure?.project_leads
                        ?.find((item) =>
                          item?.projects_managed?.includes(
                            params.get("project")
                          )
                        )
                        ?.projects?.find(
                          (item) => item.project === params.get("project")
                        )?.group_leads &&
                      Array.isArray(
                        companyStructure?.project_leads
                          ?.find((item) =>
                            item?.projects_managed?.includes(
                              params.get("project")
                            )
                          )
                          ?.projects?.find(
                            (item) => item.project === params.get("project")
                          )?.group_leads
                      ) ? (
                        React.Children.toArray(
                          companyStructure?.project_leads
                            ?.find((item) =>
                              item?.projects_managed?.includes(
                                params.get("project")
                              )
                            )
                            ?.projects?.find(
                              (item) => item.project === params.get("project")
                            )
                            ?.group_leads?.map((lead) => {
                              return (
                                <div
                                  className={
                                    styles.project__Time__lead__Display
                                  }
                                >
                                  <Avatar
                                    name={lead}
                                    round={true}
                                    size="3.2rem"
                                  />
                                  <div className={styles.project__Team__Lead}>
                                    <p>
                                      {applications?.find(
                                        (application) =>
                                          application.username === lead
                                      )
                                        ? applications?.find(
                                            (application) =>
                                              application.username === lead
                                          )?.applicant
                                        : lead}
                                    </p>
                                    <span
                                      className={styles.lead__Hightlight__Item}
                                      style={{
                                        backgroundColor: labelColors.groupLead,
                                      }}
                                    >
                                      Group Lead
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className={styles.project__Time__Overview}>
                    <TimeDetails
                      title={"Spent time"}
                      time={projectTimeDetail.spent_time}
                    />
                    {projectTimeDetail?.is_continuous === true ? (
                      <></>
                    ) : (
                      <TimeDetails
                        title={"Left time"}
                        time={projectTimeDetail.left_time}
                      />
                    )}
                    <TimeDetails
                      title={"Total time"}
                      time={
                        projectTimeDetail?.is_continuous === true
                          ? "∞"
                          : projectTimeDetail.total_time
                      }
                      isTimeStr={true}
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

                  <div className={styles.project__Detail__Overview}>
                    <TimeDetails
                      title={"Subprojects"}
                      isSubproject={true}
                      subprojects={
                        subProjectsAdded.find(
                          (item) =>
                            item.parent_project === params.get("project")
                        )?.sub_project_list
                          ? subProjectsAdded.find(
                              (item) =>
                                item.parent_project === params.get("project")
                            )?.sub_project_list
                          : []
                      }
                    />
                    <TimeDetails returnEmptyContent={true} title={"Members"}>
                      {companyStructureLoading ? (
                        <p>Loading...</p>
                      ) : (
                        <div className={styles.userss__Wrap}>
                          {companyStructure?.project_leads
                            ?.find((item) =>
                              item?.projects_managed?.includes(
                                params.get("project")
                              )
                            )
                            ?.projects?.find(
                              (item) => item.project === params.get("project")
                            )?.members &&
                          Array.isArray(
                            companyStructure?.project_leads
                              ?.find((item) =>
                                item?.projects_managed?.includes(
                                  params.get("project")
                                )
                              )
                              ?.projects?.find(
                                (item) => item.project === params.get("project")
                              )?.members
                          ) ? (
                            React.Children.toArray(
                              companyStructure?.project_leads
                                ?.find((item) =>
                                  item?.projects_managed?.includes(
                                    params.get("project")
                                  )
                                )
                                ?.projects?.find(
                                  (item) =>
                                    item.project === params.get("project")
                                )
                                ?.members?.map((member) => {
                                  return (
                                    <div
                                      className={styles.user__Member__Detail}
                                    >
                                      <Avatar
                                        name={member}
                                        size="2.3rem"
                                        round={true}
                                      />
                                      <p>
                                        {applications?.find(
                                          (application) =>
                                            application.username === member
                                        )
                                          ? applications?.find(
                                              (application) =>
                                                application.username === member
                                            )?.applicant
                                          : member}
                                      </p>
                                    </div>
                                  );
                                })
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                    </TimeDetails>
                  </div>
                  {!projectTimeDetail?.repository_name || projectTimeDetail?.repository_name?.length < 1 ? (
                    <></>
                  ) : (
                    <CommitDetails
                      title={"Commits"}
                      projectTimeDetail={projectTimeDetail}
                    />
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontSize: "0.875rem" }}>
                    Current project: {params.get("project")}
                  </p>
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
                          <label htmlFor="lead_name">
                            Project lead username (edit in company structure)
                          </label>
                          <input
                            type="text"
                            id="lead_name"
                            name="lead_name"
                            placeholder="Enter lead name"
                            value={copyOfProjectTimeDetail.lead_name}
                            disabled
                          />
                        </div>
                        <br />
                        {copyOfProjectTimeDetail.is_continuous ? (
                          <></>
                        ) : (
                          <>
                            <div className={styles.job__details}>
                              <label htmlFor="total_time">
                                Total Time Allocated (in hours)
                              </label>
                              <input
                                type="text"
                                id="total_time"
                                name="total_time"
                                placeholder="Enter total time"
                                value={copyOfProjectTimeDetail.total_time}
                                onChange={(e) =>
                                  handleTotalTimeChange(
                                    e.target.value,
                                    e.target.name
                                  )
                                }
                              />
                            </div>
                            <br />
                          </>
                        )}
                        <div className={styles.job__details}>
                          <label
                            htmlFor="repository_name"
                            className={styles.is_continious_desc}
                          >
                            Project Repository
                          </label>
                          <Select
                            options={options}
                            onChange={(selectedOption) => {
                              setCopyOfProjectTimeDetail((prevValue) => ({
                                ...prevValue,
                                repository_name: selectedOption.value,
                              }));
                              setSelectedRepository(selectedOption);
                            }}
                            placeholder="Select project repository"
                          />
                        </div>
                        <br />
                        <div className={styles.is_continious_edit}>
                          <div>
                            <input
                              className={styles.is_continuous}
                              type="checkbox"
                              name={"is_continuous"}
                              checked={copyOfProjectTimeDetail.is_continuous}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.checked,
                                  e.target.name
                                )
                              }
                            />
                          </div>
                          <label
                            htmlFor="is_continuous"
                            className={styles.is_continious_desc}
                          >
                            Project Is Continuous ?
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.job__details}>
                          <label htmlFor="lead_name">
                            Project lead username (edit in company structure)
                          </label>
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
                        <br />
                        {copyOfProjectTimeDetail.is_continuous ? (
                          <></>
                        ) : (
                          <>
                            <div className={styles.job__details}>
                              <label htmlFor="total_time">
                                Total Time Allocated (in hours)
                              </label>
                              <input
                                type="text"
                                id="total_time"
                                name="total_time"
                                placeholder="Enter total time"
                                value={copyOfProjectTimeDetail.total_time}
                                onChange={(e) =>
                                  handleTotalTimeChange(
                                    e.target.value,
                                    e.target.name
                                  )
                                }
                                disabled
                              />
                            </div>
                            <br />
                          </>
                        )}
                        <div className={styles.job__details}>
                          <label
                            htmlFor="repository_name"
                            className={styles.is_continious_desc}
                          >
                            Project Repository
                          </label>
                          <Select
                            options={options}
                            onChange={(selectedOption) => {
                              setCopyOfProjectTimeDetail((prevValue) => ({
                                ...prevValue,
                                repository_name: selectedOption.value,
                              }));
                              setSelectedRepository(selectedOption);
                            }}
                            placeholder="Select project repository"
                            disabled
                          />
                        </div>
                        <br />
                        <div className={styles.is_continious_edit}>
                          <div>
                            <input
                              className={styles.is_continuous}
                              type="checkbox"
                              name={"is_continuous"}
                              checked={copyOfProjectTimeDetail.is_continuous}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.checked,
                                  e.target.name
                                )
                              }
                              disabled
                            />
                          </div>
                          <label
                            htmlFor="is_continuous"
                            className={styles.is_continious_desc}
                          >
                            Project Is Continuous ?
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.project__btn}>
                    <button
                      className={styles.project__submit}
                      onClick={handleUpdate}
                      disabled={dataPosting ? true : false}
                    >
                      {dataPosting ? (
                        <LoadingSpinner
                          width={"1.2rem"}
                          height={"1.2rem"}
                          color={"#fff"}
                        />
                      ) : (
                        "Update"
                      )}
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
