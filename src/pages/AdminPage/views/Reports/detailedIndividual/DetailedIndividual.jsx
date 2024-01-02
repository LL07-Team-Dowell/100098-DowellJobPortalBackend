import React, { useEffect, useRef, useState } from "react";
import "./DetailedIndividual.scss";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import {
  getAllOnBoardCandidate,
  generateindividualReport,
  generateIndividualTaskReport,
  getCandidateJobApplication,
} from "../../../../../services/adminServices";
import { IoFilterOutline } from "react-icons/io5";
import { RiH1 } from "react-icons/ri";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { generateCommonAdminReport } from "../../../../../services/commonServices";
import Select from "react-select";
import { getSettingUserProfileInfo } from "../../../../../services/settingServices";
import { rolesDict, rolesNamesDict } from "../../Settings/AdminSettings";
import { formatDateForAPI } from "../../../../../helpers/helpers";
import { useModal } from "../../../../../hooks/useModal";
import ReportCapture from "../../../../../components/ReportCapture/ReportCapture";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { AiOutlineSearch } from "react-icons/ai";
import { candidateStatuses } from "../../../../CandidatePage/utils/candidateStatuses";

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function DetailedIndividual({
  isPublicReportUser,
  isProjectLead,
  subAdminView,
}) {
  const { currentUser, setCurrentUser, reportsUserDetails } =
    useCurrentUserContext();

  const {
    closeModal: closeReportCaptureModal,
    modalOpen: reportCaptureModal,
    openModal: openCaptureModal,
  } = useModal();
  const navigate = useNavigate();
  const [candidates, setcandidates] = useState([]);
  const [candidates2, setcandidates2] = useState([]);
  const [id, setId] = useState("");
  const [candidateData, setCandidateDate] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({});
  const [candidateName, setCandidateName] = useState("");
  const [firstLoading, setFirstLoading] = useState(false);
  const [secondLoading, setSecondLoadng] = useState(false);
  const [options, setOptions] = useState([]);
  const [taskReportData, setTaskReportData] = useState(null);
  const [taskProjectReportData, setTaskProjectReportData] = useState(null);
  const [projectSelectedForSubprojectBox, setProjectSelectedForSubprojectBox] =
    useState(null);
  const [projectSelectedForTasksBox, setProjectSelectedForTasksBox] =
    useState(null);
  const [PDFbtnDisabled, setPDFBtnDisabled] = useState(false);
  const [reportDataToDownload, setReportDataToDownload] = useState([]);
  const [currentRoleFilter, setCurrentRoleFilter] = useState("all");
  const csvLinkRef = useRef();
  const mainDivRef = useRef();
  const roleFilterRef = useRef();

  const date = new Date();
  const yesterdayDate = new Date(new Date().setDate(date.getDate() - 1));

  const [todayDateFormattedForAPI, yesterdayDateFormattedForAPI] = [
    formatDateForAPI(date),
    formatDateForAPI(yesterdayDate),
  ];

  const [startDateSelectedForTasksBox, setStartDateSelectedForTasksBox] =
    useState(yesterdayDateFormattedForAPI);
  const [endDateSelectedForTasksBox, setEndDateSelectedForTasksBox] = useState(
    todayDateFormattedForAPI
  );
  const [settingsUserList, setSettingsUserList] = useState([]);
  const [selectedUserRoleSetting, setSelectedUserRoleSetting] = useState(null);

  let currentTrack = 0;
  const colors = [
    "#005734",
    "red",
    "blue",
    "yellow",
    "purple",
    "pink",
    "black",
    "orange",
    "green",
    "blueviolet",
    "brown",
  ];

  const handleChange = (e) => {
    setcandidates(
      candidates2.filter((v) =>
        v.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  const getIndividualData = (id) => {
    setSecondLoadng(true);
    setId(id);
    setSelectedUserRoleSetting(null);

    const foundCandidate = candidates2.find((item) => item._id === id);
    const foundUserSettingItem = settingsUserList?.find(
      (value) =>
        value?.profile_info[value?.profile_info?.length - 1]?.profile_title ===
        foundCandidate?.portfolio_name
    );
    const currentUserSetting =
      foundUserSettingItem?.profile_info[
        foundUserSettingItem?.profile_info?.length - 1
      ];

    console.log(foundCandidate);
    console.log(currentUserSetting);

    const payloadForIndividualReport = {
      report_type: "Individual",
      year: new Date().getFullYear().toString(),
      applicant_id: id,
      company_id: foundCandidate?.company_id,
    };

    const payloadForIndividualTaskReport = {
      report_type: "Individual Task",
      username: foundCandidate?.username,
      company_id: foundCandidate?.company_id,
    };

    if (currentUserSetting?.Role === rolesNamesDict.Teamlead) {
      payloadForIndividualReport.role = "Teamlead";
      payloadForIndividualReport.applicant_username = foundCandidate?.username;
    }

    Promise.all([
      generateCommonAdminReport(payloadForIndividualReport),
      generateCommonAdminReport(payloadForIndividualTaskReport),
    ])
      .then((resp) => {
        console.log({ id });
        console.log(resp[0].data);
        setCandidateDate(resp[0].data.data[0]);
        setPersonalInfo(resp[0].data.personal_info);
        console.log(resp[0].data.personal_info);
        setCandidateName(resp[0].data.personal_info.applicant);

        console.log(resp[1].data);
        setTaskReportData(resp[1].data?.response);
        const dataForProjectGraph = {
          labels: resp[1].data?.response.map((item) => item.project),
          datasets: [
            {
              label: "Hours",
              data: resp[1].data?.response.map((item) => item.total_hours),
              backgroundColor: "blue",
              maxBarThickness: 40,
            },
            {
              label: "Work logs",
              data: resp[1].data?.response.map((item) => item.total_tasks),
              backgroundColor: "#005734",
              maxBarThickness: 40,
            },
            {
              label: "Work logs uploaded this week",
              data: resp[1].data?.response.map(
                (item) => item.tasks_uploaded_this_week
              ),
              backgroundColor: "yellow",
              maxBarThickness: 40,
            },
          ],
        };
        setTaskProjectReportData(dataForProjectGraph);
        setProjectSelectedForSubprojectBox(resp[1].data?.response[0]?.project);
        setProjectSelectedForTasksBox(null);

        if (foundUserSettingItem) {
          setSelectedUserRoleSetting(currentUserSetting);
        }
        setSecondLoadng(false);
      })
      .catch((err) => {
        console.error(err);
        setSecondLoadng(false);
      });
  };
  const handleSelectChange = (id) => {
    getIndividualData(id);
  };

  useEffect(() => {
    setFirstLoading(true);
    Promise.all([
      getCandidateJobApplication(
        isPublicReportUser
          ? reportsUserDetails?.company_id
          : currentUser?.portfolio_info[0].org_id
      ),
      getSettingUserProfileInfo(),
    ])
      .then((promiseRes) => {
        const candidatesRes = isPublicReportUser ?
          promiseRes[0]?.data?.response?.data?.filter(
            item => item.data_type === reportsUserDetails?.data_type
          )?.reverse()
        :
          promiseRes[0]?.data?.response?.data?.filter(
            item => item.data_type === currentUser?.portfolio_info[0]?.data_type
          )?.reverse()

        setcandidates(candidatesRes);
        setcandidates2(candidatesRes);

        const settingsInfo = isPublicReportUser
          ? promiseRes[1]?.data
              ?.reverse()
              ?.filter(
                (item) => item.company_id === reportsUserDetails?.company_id
              )
              ?.filter(
                (item) => item.data_type === reportsUserDetails?.data_type
              )
          : promiseRes[1]?.data
              ?.reverse()
              ?.filter(
                (item) =>
                  item.company_id === currentUser.portfolio_info[0].org_id
              )
              ?.filter(
                (item) =>
                  item.data_type === currentUser.portfolio_info[0].data_type
              );
        setSettingsUserList(settingsInfo);
        setFirstLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFirstLoading(false);
      });
  }, []);

  useEffect(() => {
    setOptions(
      currentRoleFilter === "currently working"
        ? candidates
            ?.filter((candidate) => candidate.status === candidateStatuses.ONBOARDING)
            .map((v) => ({ value: v._id, label: v.applicant }))
        : currentRoleFilter === "currently not working"
        ? candidates
            ?.filter((candidate) => candidate.status === candidateStatuses.REMOVED)
            .map((v) => ({ value: v._id, label: v.applicant }))
        : candidates.map((v) => ({ value: v._id, label: v.applicant }))
    );
  }, [currentRoleFilter, candidates]);

  useEffect(() => {
    if (!taskReportData || !projectSelectedForTasksBox) {
      setReportDataToDownload([]);
      return;
    }

    const currentTabularData = taskReportData
      ?.find((task) => task.project === projectSelectedForTasksBox)
      ?.tasks?.filter(
        (task) =>
          new Date(task.task_created_date).getTime() >=
            new Date(startDateSelectedForTasksBox).getTime() &&
          new Date(task.task_created_date).getTime() <=
            new Date(endDateSelectedForTasksBox).getTime() &&
          task.project === projectSelectedForTasksBox &&
          task.is_active &&
          task.task_created_date
      )
      .reverse();

    const [reportDataKeys, reportDataVals] = [
      [
        "S/N",
        "DATE ADDED",
        "TIME STARTED",
        "TIME FINISHED",
        "WORK LOG",
        "WORK LOG TYPE",
        "WORK LOG APPROVED",
        "SUBPROJECT",
        "PROJECT",
      ],
      currentTabularData.map((item, index) => {
        return [
          index + 1,
          new Date(item.task_created_date).toDateString(),
          item.start_time,
          item.end_time,
          item.task,
          item.task_type,
          item.approved ? "Yes" : "No",
          item.subproject,
          item.project,
        ];
      }),
    ];

    setReportDataToDownload([reportDataKeys, ...reportDataVals]);
  }, [
    taskReportData,
    projectSelectedForTasksBox,
    startDateSelectedForTasksBox,
    endDateSelectedForTasksBox,
  ]);

  const handleDateChange = (val) => {
    console.log(val);
  };

  const handleDownloadExcelData = () => {
    if (!csvLinkRef.current) return;

    csvLinkRef.current?.link?.click();

    closeReportCaptureModal();
    toast.success("Successfully downloaded report!");
  };

  const handleDownloadPDFData = (elemRef) => {
    if (!elemRef.current) return;

    setPDFBtnDisabled(true);

    html2canvas(elemRef.current).then((canvas) => {
      let dataURL = canvas.toDataURL("image/png");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [elemRef.current.scrollHeight, elemRef.current.scrollWidth],
      });

      doc.addImage(dataURL, "PNG", 1, 1);
      doc.save("report.pdf");

      setPDFBtnDisabled(false);
      closeReportCaptureModal();
      toast.success("Successfully downloaded report!");
    });
  };

  const calculateHours = (logsPassed) => {
    const hourGapBetweenLogs = logsPassed.map(log => {
      const [ startTime, endTime ] = [ new Date(`${log.task_created_date} ${log.start_time}`), new Date(`${log.task_created_date} ${log.end_time}`) ]
      if (startTime == 'Invalid Date' || endTime == 'Invalid Date') return 0

      const diffInMs = Math.abs(endTime - startTime);
      return  diffInMs / (1000 * 60 * 60);
    });

    const totalHours = Number(hourGapBetweenLogs.reduce((x, y) => x + y , 0)).toFixed(2)
    return totalHours
  }

  if (firstLoading)
    return (
      <StaffJobLandingLayout
        adminView={isProjectLead ? false : true}
        adminAlternativePageActive={isProjectLead ? false : true}
        pageTitle={"Detailed individual report"}
        projectLeadView={isProjectLead}
        hideSearchBar={true}
        subAdminView={subAdminView}
        newSidebarDesign={(!isProjectLead || !subAdminView) ? true : false}
      >
        <div className="detailed_indiv_container">
          <div className="task__report__nav">
            {isPublicReportUser ? (
              <>
                <h2>Individual report</h2>
              </>
            ) : (
              <>
                <button className="back" onClick={() => navigate(-1)}>
                  <MdArrowBackIosNew />
                </button>
                <h2>Individual Report</h2>
              </>
            )}
          </div>
          <p style={{ fontSize: "0.9rem" }}>
            Get well-detailed actionable insights on hired individuals in your
            organization
          </p>
          <LoadingSpinner />
        </div>
      </StaffJobLandingLayout>
    );
  return (
    <StaffJobLandingLayout
      adminView={isProjectLead ? false : true}
      adminAlternativePageActive={isProjectLead ? false : true}
      pageTitle={"Detailed individual report"}
      projectLeadView={isProjectLead}
      hideSearchBar={true}
      subAdminView={subAdminView}
      newSidebarDesign={(!isProjectLead || !subAdminView) ? true : false}
    >
      <div className="detailed_indiv_container" ref={mainDivRef}>
        <div className="task__report__nav">
          {isPublicReportUser ? (
            <>
              <h2>Individual report</h2>
            </>
          ) : (
            <>
              <button className="back" onClick={() => navigate(-1)}>
                <MdArrowBackIosNew />
              </button>
              <h2>Individual Report</h2>
            </>
          )}
        </div>
        <p style={{ fontSize: "0.9rem" }}>
          Get well-detailed actionable insights on hired individuals in your
          organization
        </p>
        <div className="filter__container">
          <div
            className="role__Filter__Wrapper"
            onClick={() => roleFilterRef.current.click()}
          >
            <IoFilterOutline />
            <select
              ref={roleFilterRef}
              className="role__Filter filter__filter"
              value={currentRoleFilter}
              onChange={({ target }) => setCurrentRoleFilter(target.value)}
            >
              <option value={"all"}>All</option>
              <option value={"currently working"}>Currently working</option>
              <option value={"currently not working"}>
                Currently not working
              </option>
            </select>
          </div>
        </div>
        <div className="selction_container">
          <p>Select name</p>
          <Select
            options={options}
            onChange={(e) => handleSelectChange(e?.value)}
          />
          {/* FIX IT */}
          {id !== "" ? (
            <>
              {" "}
              {secondLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="personal__Info__Wrapper">
                  {/* {candidateName && <h3>Current candidate: {candidateName}</h3>} */}
                  <div className="personal_info">
                    <h3>Candidate personal info</h3>
                    <div>
                      <p>
                        <span>Applicant name:</span>
                        {personalInfo.applicant}
                      </p>
                      <p>
                        <span>Current status:</span>
                        {personalInfo.status}
                      </p>
                      <p>
                        <span>Applicant email:</span>
                        {personalInfo.applicant_email}
                      </p>
                      <p>
                        <span>Country:</span>
                        {personalInfo.country}
                      </p>
                      <p>
                        <span>Project assigned:</span>
                        {personalInfo.project}
                      </p>
                      <p>
                        <span>Username:</span>
                        {personalInfo.username}
                      </p>
                      <p>
                        <span>Portfolio name:</span>
                        {personalInfo.portfolio_name}
                      </p>
                      {selectedUserRoleSetting && (
                        <>
                          <p>
                            <span>Current role:</span>
                            {rolesDict[selectedUserRoleSetting?.Role]
                              ? rolesDict[selectedUserRoleSetting?.Role]
                              : "Invalid role"}
                          </p>
                          {selectedUserRoleSetting.other_roles && (
                            <p>
                              <span>Other roles:</span>
                              {selectedUserRoleSetting.other_roles
                                .map((role) => {
                                  if (!rolesDict[role]) return null;
                                  return rolesDict[role];
                                })
                                .join(", ")}
                            </p>
                          )}
                        </>
                      )}
                      <p>
                        <span>Application submitted on:</span>
                        {formatDate(personalInfo.application_submitted_on)}
                      </p>
                      <p>
                        <span>Shortlisted on:</span>
                        {formatDate(personalInfo.shortlisted_on)}
                      </p>
                      <p>
                        <span>Selected on:</span>
                        {formatDate(personalInfo.selected_on)}
                      </p>
                      <p>
                        <span>Hired on:</span>
                        {formatDate(personalInfo.hired_on)}
                      </p>
                      <p>
                        <span>Onboarded on:</span>
                        {formatDate(personalInfo.onboarded_on)}
                      </p>
                    </div>
                  </div>
                  <div className="graph">
                    <h3>Work logs overview</h3>
                    <h4 style={{ textAlign: "center", marginBottom: "2rem" }}>
                      Bar chart showing work log details for {candidateName}{" "}
                      this year
                    </h4>
                    <Bar
                      data={{
                        labels: Object.keys(candidateData),
                        datasets:
                          selectedUserRoleSetting &&
                          selectedUserRoleSetting?.Role ===
                            rolesNamesDict.Teamlead
                            ? [
                                {
                                  label: "Work logs approved",
                                  backgroundColor: "blue",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_approved;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs you approved",
                                  backgroundColor: "orange",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key]
                                        .tasks_you_approved;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs added",
                                  backgroundColor: "#005734",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_added;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs uncompleted",
                                  backgroundColor: "red",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key]
                                        .tasks_uncompleted;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs you marked as incomplete",
                                  backgroundColor: "indigo",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key]
                                        .tasks_you_marked_as_incomplete;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },

                                {
                                  label: "Work logs completed",
                                  backgroundColor: "yellow",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_completed;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs you marked as complete",
                                  backgroundColor: "#be6464",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key]
                                        .tasks_you_marked_as_complete;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                              ]
                            : [
                                {
                                  label: "Work logs approved",
                                  backgroundColor: "blue",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_approved;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs added",
                                  backgroundColor: "#005734",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_added;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs uncompleted",
                                  backgroundColor: "red",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key]
                                        .tasks_uncompleted;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                                {
                                  label: "Work logs completed",
                                  backgroundColor: "yellow",
                                  data: Object.keys(candidateData).map(
                                    (key) => {
                                      return candidateData[key].tasks_completed;
                                    }
                                  ),
                                  maxBarThickness: 40,
                                },
                              ],
                      }}
                    />
                  </div>
                  <div className="indiv__Task__Rep__info">
                    <div className="task__Box">
                      <div className="task__item">
                        <h4>Projects</h4>
                        {taskProjectReportData ? (
                          <>
                            <p style={{ margin: "25px 0 10px" }}>
                              <b>
                                Bar chart showing hours, total work logs and
                                work logs this week per project
                              </b>
                            </p>
                            <div className="graph">
                              <Bar
                                options={chartOptions}
                                data={taskProjectReportData}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="task__item">
                        <h4>
                          <span>Subprojects Distribution</span>
                          <Select
                            className="title__task__Select"
                            value={{
                              label: projectSelectedForSubprojectBox,
                              value: projectSelectedForSubprojectBox,
                            }}
                            onChange={(val) =>
                              setProjectSelectedForSubprojectBox(val.value)
                            }
                            options={[
                              { label: "Select project", value: "" },
                              ...taskReportData.map((item) => ({
                                label: item.project,
                                value: item.project,
                              })),
                            ]}
                          />
                        </h4>
                        {projectSelectedForSubprojectBox ? (
                          <>
                            <p style={{ margin: "25px 0 10px" }}>
                              <b>
                                Doughnut chart showing the distribution of
                                subprojects added by {candidateName} under the{" "}
                                {projectSelectedForSubprojectBox} project
                              </b>
                            </p>
                            <div className="graph">
                              <Doughnut
                                data={{
                                  labels: taskReportData.find(
                                    (item) =>
                                      item.project ===
                                      projectSelectedForSubprojectBox
                                  )
                                    ? Object.keys(
                                        taskReportData.find(
                                          (item) =>
                                            item.project ===
                                            projectSelectedForSubprojectBox
                                        )?.subprojects || {}
                                      )
                                    : [],
                                  datasets: [
                                    {
                                      label: "Poll",
                                      data: taskReportData.find(
                                        (item) =>
                                          item.project ===
                                          projectSelectedForSubprojectBox
                                      )
                                        ? Object.keys(
                                            taskReportData.find(
                                              (item) =>
                                                item.project ===
                                                projectSelectedForSubprojectBox
                                            )?.subprojects || {}
                                          ).map((subproject) => {
                                            return taskReportData.find(
                                              (item) =>
                                                item.project ===
                                                projectSelectedForSubprojectBox
                                            )?.subprojects[subproject];
                                          })
                                        : [],
                                      backgroundColor: taskReportData.find(
                                        (item) =>
                                          item.project ===
                                          projectSelectedForSubprojectBox
                                      )
                                        ? Object.keys(
                                            taskReportData.find(
                                              (item) =>
                                                item.project ===
                                                projectSelectedForSubprojectBox
                                            )?.subprojects || {}
                                          ).map((subproject) => {
                                            if (
                                              currentTrack >
                                              colors.length - 1
                                            ) {
                                              currentTrack = 0;
                                            } else {
                                              currentTrack += 1;
                                            }

                                            return colors[currentTrack];
                                          })
                                        : [],
                                    },
                                  ],
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="task__item tasks">
                      <h4>Work log details</h4>
                      <p className="project__Select">Select project</p>
                      <Select
                        className="title__task__Select"
                        value={{
                          label: projectSelectedForTasksBox,
                          value: projectSelectedForTasksBox,
                        }}
                        onChange={(val) =>
                          setProjectSelectedForTasksBox(val.value)
                        }
                        options={[
                          { label: "Select project", value: "" },
                          ...taskReportData.map((item) => ({
                            label: item.project,
                            value: item.project,
                          })),
                        ]}
                      />
                      <div className="date__Select__Wrap">
                        <div className="date__Select__Wrap__Item">
                          <span>Start Date</span>
                          <input
                            type="date"
                            value={startDateSelectedForTasksBox}
                            onChange={({ target }) =>
                              setStartDateSelectedForTasksBox(target.value)
                            }
                            disabled={
                              !projectSelectedForTasksBox ? true : false
                            }
                            max={
                              new Date(endDateSelectedForTasksBox)
                                .toISOString()
                                .slice(
                                  0,
                                  new Date(endDateSelectedForTasksBox)
                                    .toISOString()
                                    .lastIndexOf(":")
                                )
                                .split("T")[0]
                            }
                          />
                        </div>
                        <div className="date__Select__Wrap__Item">
                          <span>End Date</span>
                          <input
                            type="date"
                            value={endDateSelectedForTasksBox}
                            onChange={({ target }) =>
                              setEndDateSelectedForTasksBox(target.value)
                            }
                            disabled={
                              !projectSelectedForTasksBox ? true : false
                            }
                            min={
                              new Date(startDateSelectedForTasksBox)
                                .toISOString()
                                .slice(
                                  0,
                                  new Date(startDateSelectedForTasksBox)
                                    .toISOString()
                                    .lastIndexOf(":")
                                )
                                .split("T")[0]
                            }
                          />
                        </div>
                      </div>

                      {projectSelectedForTasksBox ? (
                        <>
                          <p className="task__Select">
                            <b>
                              {
                                taskReportData
                                  .find(
                                    (task) =>
                                      task.project ===
                                      projectSelectedForTasksBox
                                  )
                                  ?.tasks?.filter(
                                    (task) =>
                                      new Date(
                                        task.task_created_date
                                      ).getTime() >=
                                        new Date(
                                          startDateSelectedForTasksBox
                                        ).getTime() &&
                                      new Date(
                                        task.task_created_date
                                      ).getTime() <=
                                        new Date(
                                          endDateSelectedForTasksBox
                                        ).getTime() &&
                                      task.project ===
                                        projectSelectedForTasksBox &&
                                      task.is_active
                                  ).length
                              }
                            </b>
                            {" "}
                            work logs totaling {" "}
                            <b>
                              {
                                calculateHours(
                                  taskReportData
                                  .find(
                                    (task) =>
                                      task.project ===
                                      projectSelectedForTasksBox
                                  )
                                  ?.tasks?.filter(
                                    (task) =>
                                      new Date(
                                        task.task_created_date
                                      ).getTime() >=
                                        new Date(
                                          startDateSelectedForTasksBox
                                        ).getTime() &&
                                      new Date(
                                        task.task_created_date
                                      ).getTime() <=
                                        new Date(
                                          endDateSelectedForTasksBox
                                        ).getTime() &&
                                      task.project ===
                                        projectSelectedForTasksBox &&
                                      task.is_active
                                  )
                                )
                              }
                            </b>
                            {" "}
                            hours were added by <b>{candidateName}</b> under the{" "}
                            <b>{projectSelectedForTasksBox}</b> project between{" "}
                            <b>{new Date(
                              startDateSelectedForTasksBox
                            ).toDateString()}</b>{" "}
                            and<b>{" "}
                            {new Date(
                              endDateSelectedForTasksBox
                            ).toDateString()}</b>
                          </p>
                          {reportDataToDownload.length > 0 && (
                            <>
                              <CSVLink
                                data={reportDataToDownload}
                                ref={csvLinkRef}
                                style={{ display: "none" }}
                              >
                                Download Me
                              </CSVLink>
                              <button
                                className={"download__Report__Btn"}
                                onClick={() => {
                                  openCaptureModal();
                                }}
                              >
                                Download report
                              </button>
                            </>
                          )}
                          <div className="cand__task__Wrap">
                            {!taskReportData.find(
                              (task) =>
                                task.project === projectSelectedForTasksBox
                            ) ||
                            taskReportData
                              .find(
                                (task) =>
                                  task.project === projectSelectedForTasksBox
                              )
                              ?.tasks?.filter(
                                (task) =>
                                  new Date(task.task_created_date).getTime() >=
                                    new Date(
                                      startDateSelectedForTasksBox
                                    ).getTime() &&
                                  new Date(task.task_created_date).getTime() <=
                                    new Date(
                                      endDateSelectedForTasksBox
                                    ).getTime() &&
                                  task.project === projectSelectedForTasksBox &&
                                  task.is_active
                              ).length < 1 ||
                            !Array.isArray(
                              taskReportData
                                .find(
                                  (task) =>
                                    task.project === projectSelectedForTasksBox
                                )
                                ?.tasks?.filter(
                                  (task) =>
                                    new Date(
                                      task.task_created_date
                                    ).getTime() >=
                                      new Date(
                                        startDateSelectedForTasksBox
                                      ).getTime() &&
                                    new Date(
                                      task.task_created_date
                                    ).getTime() <=
                                      new Date(
                                        endDateSelectedForTasksBox
                                      ).getTime() &&
                                    task.project ===
                                      projectSelectedForTasksBox &&
                                    task.is_active
                                )
                            ) ? (
                              <>
                                <img
                                  src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?w=1480&t=st=1694763189~exp=1694763789~hmac=e4b01d8c6a162b7170700df535471c9972009c0bdf2679a1c63eefffb7401809"
                                  alt="illustration"
                                />
                                <p
                                  style={{
                                    fontSize: "0.9rem",
                                    textAlign: "center",
                                    marginTop: 20,
                                  }}
                                >
                                  No work logs were added by {candidateName}{" "}
                                  under the {projectSelectedForTasksBox} project
                                  between{" "}
                                  {new Date(
                                    startDateSelectedForTasksBox
                                  ).toDateString()}{" "}
                                  and{" "}
                                  {new Date(
                                    endDateSelectedForTasksBox
                                  ).toDateString()}
                                </p>
                              </>
                            ) : (
                              <>
                                <table id="customers">
                                  <tr>
                                    <th>S/N</th>
                                    <th>Date added</th>
                                    <th>Time started</th>
                                    <th>Time finished</th>
                                    <th>Work log</th>
                                    <th>Work log type</th>
                                    <th>Work log approved</th>
                                    <th>sub project</th>
                                  </tr>
                                  {React.Children.toArray(
                                    taskReportData
                                      .find(
                                        (task) =>
                                          task.project ===
                                          projectSelectedForTasksBox
                                      )
                                      ?.tasks?.filter(
                                        (task) =>
                                          new Date(
                                            task.task_created_date
                                          ).getTime() >=
                                            new Date(
                                              startDateSelectedForTasksBox
                                            ).getTime() &&
                                          new Date(
                                            task.task_created_date
                                          ).getTime() <=
                                            new Date(
                                              endDateSelectedForTasksBox
                                            ).getTime() &&
                                          task.project ===
                                            projectSelectedForTasksBox &&
                                          task.is_active &&
                                          task.task_created_date
                                      )
                                      ?.reverse()
                                      ?.map((task, index) => {
                                        return (
                                          <tbody>
                                            {/*<div className="single__task__Detail">
                                              <h3>Task: {task.task}</h3>
                                                <p>Subproject: {task.subproject}</p>
                                                <p>Task type: {task.task_type}</p>
                                                <p>Start time: {task.start_time}</p>
                                                <p>End time: {task.end_time}</p>
                                              </div>*/}
                                            <tr key={task._id}>
                                              <td>{index + 1}.</td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {new Date(
                                                  task.task_created_date
                                                ).toDateString()}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {task.start_time}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {task.end_time}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {task.task}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {task.task_type}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? task.approved
                                                      ? "approved"
                                                      : "not__Approved"
                                                    : "deleted"
                                                }
                                              >
                                                {task.approved ? "Yes" : "No"}
                                              </td>
                                              <td
                                                className={
                                                  task.is_active &&
                                                  task.is_active === true
                                                    ? ""
                                                    : "deleted"
                                                }
                                              >
                                                {task.subproject}
                                              </td>
                                            </tr>
                                          </tbody>
                                        );
                                      })
                                  )}
                                </table>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            style={{ fontSize: "0.9rem", textAlign: "center" }}
                          >
                            Select a project to get a detailed report on work
                            logs added
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <img
                src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?w=1480&t=st=1694763189~exp=1694763789~hmac=e4b01d8c6a162b7170700df535471c9972009c0bdf2679a1c63eefffb7401809"
                alt="illustration"
              />
              <p style={{ fontSize: "0.9rem", textAlign: "center" }}>
                Search for your username and get your report
              </p>
            </>
          )}
        </div>
      </div>
      {reportCaptureModal && (
        <ReportCapture
          closeModal={() => closeReportCaptureModal()}
          htmlToCanvaFunction={() => {}}
          handleExcelItemDownload={handleDownloadExcelData}
          htmlToPdfFunction={() => handleDownloadPDFData(mainDivRef)}
          pdfBtnIsDisabled={PDFbtnDisabled}
        />
      )}
    </StaffJobLandingLayout>
  );
}
// {Object.keys(candidateData).map((data, index) => (
//   <div className="candidate_indiv_data">
//     <div>
//       <span>Month</span>:{data}
//       {Object.keys(candidateData[data]).map((key) => (
//         <div key={key}>
//           {keyToDisplayText[key]}: {candidateData[data][key]}
//           {keyToDisplayText[key].match(/\w+/)[0] === "Percentage" &&
//             "%"}
//         </div>
//       ))}
//     </div>
//   </div>
// ))}
function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-IN", options);
}
