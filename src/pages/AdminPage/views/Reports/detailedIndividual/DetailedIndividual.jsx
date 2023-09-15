import React, { useEffect, useState } from "react";
import "./DetailedIndividual.scss";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import {
  getAllOnBoardCandidate,
  generateindividualReport,
  generateIndividualTaskReport,
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

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function DetailedIndividual() {
  const { currentUser, setCurrentUser } = useCurrentUserContext();

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
  const date = new Date();
  const [year, month, day] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ];
  const dateFormattedForAPI = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  const [dateSelectedForTasksBox, setDateSelectedForTasksBox] =
    useState(dateFormattedForAPI);

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

    const foundCandidate = candidates2.find((item) => item._id === id);
    console.log(foundCandidate);

    Promise.all([
      generateCommonAdminReport({
        report_type: "Individual",
        year: new Date().getFullYear().toString(),
        applicant_id: id,
      }),
      generateCommonAdminReport({
        report_type: "Individual Task",
        username: foundCandidate?.username,
      }),
    ])
      .then((resp) => {
        console.log({ id });
        console.log(resp[0].data);
        setCandidateDate(resp[0].data.data[0]);
        setPersonalInfo(resp[0].data.personal_info);
        console.log(resp[0].data.personal_info);
        setCandidateName(resp[0].data.personal_info.username);

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
              label: "Tasks",
              data: resp[1].data?.response.map((item) => item.total_tasks),
              backgroundColor: "#005734",
              maxBarThickness: 40,
            },
            {
              label: "Tasks uploaded this week",
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
        setSecondLoadng(false);
      })
      .catch((err) => console.error(err));
  };
  const handleSelectChange = (id) => {
    getIndividualData(id);
  };

  useEffect(() => {
    setFirstLoading(true);
    getAllOnBoardCandidate(currentUser?.portfolio_info[0].org_id)
      .then(
        ({
          data: {
            response: { data },
          },
        }) => {
          setcandidates(
            data.filter((candidate) => candidate.status === "hired")
          );
          setcandidates2(
            data.filter((candidate) => candidate.status === "hired")
          );
          setOptions(
            data
              .filter((candidate) => candidate.status === "hired")
              .map((v) => ({ value: v._id, label: v.username }))
          );
          setFirstLoading(false);
        }
      )
      .catch((err) => console.log(err));
  }, []);

  const handleDateChange = (val) => {
    console.log(val);
  };

  if (firstLoading)
    return (
      <StaffJobLandingLayout
        adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Detailed individual report"}
      >
        <div className="detailed_indiv_container">
          <div className="task__report__nav">
            <button className="back" onClick={() => navigate(-1)}>
              <MdArrowBackIosNew />
            </button>
            <h2>Individual Report</h2>
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
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Detailed individual report"}
    >
      <div className="detailed_indiv_container">
        <div className="task__report__nav">
          <button className="back" onClick={() => navigate(-1)}>
            <MdArrowBackIosNew />
          </button>
          <h2>Individual Report</h2>
        </div>
        <p style={{ fontSize: "0.9rem" }}>
          Get well-detailed actionable insights on hired individuals in your
          organization
        </p>
        <div className="selction_container">
          <p>Select username</p>
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
                        <span>Project hired for:</span>
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
                    <h3>Tasks overview</h3>
                    <h4 style={{ textAlign: "center", marginBottom: "2rem" }}>
                      Bar chart showing task details for {candidateName} this year
                    </h4>
                    <Bar
                      data={{
                        labels: Object.keys(candidateData),
                        datasets: [
                          {
                            label: "Tasks approved",
                            backgroundColor: "blue",
                            data: Object.keys(candidateData).map((key) => {
                              return candidateData[key].tasks_approved;
                            }),
                            maxBarThickness: 40,
                          },
                          {
                            label: "Tasks added",
                            backgroundColor: "#005734",
                            data: Object.keys(candidateData).map((key) => {
                              return candidateData[key].tasks_added;
                            }),
                            maxBarThickness: 40,
                          },
                          {
                            label: "Tasks uncompleted",
                            backgroundColor: "red",
                            data: Object.keys(candidateData).map((key) => {
                              return candidateData[key].tasks_uncompleted;
                            }),
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
                          <p style={{ margin: '25px 0 10px' }}><b>Bar chart showing hours, total tasks and tasks this week per project</b></p>
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
                          <span>Subprojects</span>
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
                            <p style={{ margin: '25px 0 10px' }}><b>Doughnut chart showing the distribution of subprojects added by {candidateName} under the {projectSelectedForSubprojectBox} project</b></p>
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
                      <h4>Task Details</h4>
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
                        <input
                          type="date"
                          value={dateSelectedForTasksBox}
                          onChange={({ target }) =>
                            setDateSelectedForTasksBox(target.value)
                          }
                          disabled={!projectSelectedForTasksBox ? true : false}
                        />
                      </div>

                      {projectSelectedForTasksBox ? (
                        <>
                          <p className="task__Select">
                            <b>
                              Tasks added by {candidateName} under the{" "}
                              {projectSelectedForTasksBox} project on{" "}
                              {new Date(dateSelectedForTasksBox).toDateString()}
                            </b>
                          </p>

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
                                  task.task_created_date ===
                                    dateSelectedForTasksBox &&
                                  task.project === projectSelectedForTasksBox
                              ).length < 1 ||
                            !Array.isArray(
                              taskReportData
                                .find(
                                  (task) =>
                                    task.project === projectSelectedForTasksBox
                                )
                                ?.tasks?.filter(
                                  (task) =>
                                    task.task_created_date ===
                                      dateSelectedForTasksBox &&
                                    task.project === projectSelectedForTasksBox
                                )
                            ) ? (
                              <>
                                <img src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?w=1480&t=st=1694763189~exp=1694763789~hmac=e4b01d8c6a162b7170700df535471c9972009c0bdf2679a1c63eefffb7401809" alt="illustration" />
                                <p
                                  style={{
                                    fontSize: "0.9rem",
                                    textAlign: "center",
                                    marginTop: 20,
                                  }}
                                >
                                  No tasks were added by {candidateName} under
                                  the {projectSelectedForTasksBox} project on{" "}
                                  {new Date(
                                    dateSelectedForTasksBox
                                  ).toDateString()}
                                </p>
                              </>
                            ) : (
                              React.Children.toArray(
                                taskReportData
                                  .find(
                                    (task) =>
                                      task.project ===
                                      projectSelectedForTasksBox
                                  )
                                  ?.tasks?.filter(
                                    (task) =>
                                      task.task_created_date ===
                                        dateSelectedForTasksBox &&
                                      task.project ===
                                        projectSelectedForTasksBox
                                  )
                                  ?.map((task) => {
                                    return (
                                      <div className="single__task__Detail">
                                        <h3>Task: {task.task}</h3>
                                        <p>Subproject: {task.subproject}</p>
                                        <p>Task type: {task.task_type}</p>
                                        <p>Start time: {task.start_time}</p>
                                        <p>End time: {task.end_time}</p>
                                      </div>
                                    );
                                  })
                              )
                            )}
                          </div>
                        </>
                        )
                        :
                        <>
                          <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>Select a project to get a detailed report on tasks added</p>
                        </>
                      }
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : <>
            <img src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?w=1480&t=st=1694763189~exp=1694763789~hmac=e4b01d8c6a162b7170700df535471c9972009c0bdf2679a1c63eefffb7401809" alt="illustration" />
            <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>Search for your username and get your report</p>
          </>}
        </div>
      </div>
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
