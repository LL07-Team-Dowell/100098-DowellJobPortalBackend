import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import "./taskreports.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getSettingUserProject } from "../../../../services/hrServices";
import { generateCommonAdminReport } from "../../../../services/commonServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Select from "react-select";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { getProjectTime } from "../../../../services/projectTimeServices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Tasks",
    },
  },
};

const TaskReports = ({ subAdminView, isPublicReportUser, isProjectLead }) => {
  const [projects, setProjects] = useState([]);
  const [projectTime, setProjectTime] = useState([]);
  const [foundProjectTime, setFoundProjectTime] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [report, setReport] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [projecTaskInfo, setProjectTaskInfo] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { currentUser, reportsUserDetails } = useCurrentUserContext();
  const [error, setError] = useState(false);
  const [subProjectReport, setSubProjectReport] = useState(null);

  const options = [
    { value: "", label: "Select project" },
    ...projects.map((project) => ({
      value: project,
      label: project,
    })),
  ];

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

  const handleChange = (selectedOption) => {
    // projectTime.find(item => item.project === selectedOption.value)
    setSelectedProject(selectedOption.value);
  };

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([
      getSettingUserProject(),
      getProjectTime(currentUser.portfolio_info[0].org_id),
    ])
      .then((res) => {
        console.log(res[1].data);
        const projectsGotten = isPublicReportUser
          ? res[0]?.data
            ?.filter(
              (project) =>
                project?.data_type === reportsUserDetails?.data_type &&
                project?.company_id === reportsUserDetails?.company_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse()
          : res[0]?.data
            ?.filter(
              (project) =>
                project?.data_type ===
                currentUser.portfolio_info[0].data_type &&
                project?.company_id ===
                currentUser.portfolio_info[0].org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse();
        setProjects(projectsGotten[0]?.project_list);
        console.log(res[1]?.data?.data)
        setProjectTime(
          res[1]?.data?.data?.filter(
            (project) =>
              project?.data_type === currentUser.portfolio_info[0].data_type
          )
        );
        setProjectsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setProjectsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    if (reportsLoading) return;

    const dataToPost = {
      report_type: "Project",
      project: selectedProject,
      company_id: isPublicReportUser
        ? reportsUserDetails?.company_id
        : currentUser.portfolio_info[0].org_id,
      active_users_only: 1,
    };

    const foundProjectTimeFromArr = projectTime.find(
      (item) => item.project === selectedProject
    );
    console.log('foundddddd',foundProjectTimeFromArr);
    console.log(projectTime, selectedProject)

    setReportsLoading(true);
    setError(false);
    setFoundProjectTime(null);

    generateCommonAdminReport(dataToPost)
      .then((res) => {
        console.log('work log report',res.data.data);
        const labels = res.data?.data?.map(
          (item) => item.user
        );
        // console.log('labels>>>>>>>>>.',labels);

        const formattedData = {
          labels,
          datasets: [
            // {
            //   label: "Subprojects",
            //   data: res.data?.data?.users_that_added.map(
            //     (item) => Object.keys(item?.subprojects || {})?.length
            //   ),
            //   backgroundColor: "blue",
            // },
            {
              label: "Work logs",
              data: res.data?.data?.map(
                (item) => item.tasks_added
              ),
              backgroundColor: "#005734",
              maxBarThickness: 40,
            },
            {
              label: "Hours",
              data: res.data?.data?.map(
                (item) => item.total_hours
              ),
              backgroundColor: "red",
              maxBarThickness: 40,
            },
          ],
        };
        // console.log('formattedData>>>>>>>>',formattedData);

        const uniqueSubprojects = [
          ...new Set(
            res.data?.data?.map((item) => Object.keys(item.subprojects || {}))
              .flat()
          ),
        ];
        // console.log('uniqueSubprojects>>>>>>>>',uniqueSubprojects);
        let currentTrack = 0;

        const formattedDataForSubproject = {
          labels: labels,
          datasets: uniqueSubprojects.map((subproject, index) => {
            if (currentTrack > colors.length - 1) {
              currentTrack = 0;
            } else {
              currentTrack += 1;
            }

            return {
              label: subproject,
              data: res.data?.data?.map((dataItem) => {
                if (!dataItem?.subprojects[subproject]) return 0;
                return dataItem?.subprojects[subproject];
              }),
              backgroundColor:
                index > colors.length - 1
                  ? colors[currentTrack]
                  : colors[index],
              maxBarThickness: 40,
            };
          }),
        };

        // console.log('formated data fro subproject.....>>>>>',formattedDataForSubproject);
        setTableData(res.data?.data); // Set table data
        const totalTasksAdded = res.data?.data?.reduce(
          (accumulator, currentItem) => accumulator + currentItem.tasks_added,
          0
        );
        setReport(formattedData);
        setProjectTaskInfo(
          `A total of ${isNaN(totalTasksAdded) ? totalTasksAdded : Number(totalTasksAdded).toLocaleString()} work logs have been added in ${selectedProject}`
        );
        setFoundProjectTime(foundProjectTimeFromArr);
        setReportsLoading(false);
        
        setSubProjectReport(formattedDataForSubproject);
      })
      .catch((err) => {
        console.log(err);
        setReportsLoading(false);
        setError(true);
        setReport(null);
      });
  }, [selectedProject]);

  return (
    <StaffJobLandingLayout
      adminView={isProjectLead ? false : true}
      adminAlternativePageActive={isProjectLead ? false : true}
      pageTitle={"Reports"}
      subAdminView={subAdminView}
      projectLeadView={isProjectLead}
      hideSearchBar={true}
      newSidebarDesign={(!isProjectLead || !subAdminView) ? true : false}
    >
      <div className="task__reports__container">
        <div className="task__reports__container_header">
          <div className="task__report__nav">
            {isPublicReportUser ? (
              <>
                <h2>Work log Reports</h2>
              </>
            ) : (
              <>
                <button className="back" onClick={() => navigate(-1)}>
                  <MdOutlineArrowBackIosNew />
                </button>
                <h2>Work log Reports</h2>
              </>
            )}
          </div>
          <div className="task__report__header">
            <p style={{ fontSize: "0.9rem" }}>
              Get insights into work logs uploaded per project in your
              organization
            </p>
            <div className="task__select__Project">
              <span>Select a project</span>
              {projectsLoading ? (
                <LoadingSpinner
                  width={"1.5rem"}
                  height={"1.5rem"}
                  marginLeft={"0"}
                  marginRight={"0"}
                />
              ) : (
                <Select
                  className="select__task__report__project"
                  value={options.find(
                    (option) => option.value === selectedProject
                  )}
                  onChange={handleChange}
                  options={options}
                />
              )}
            </div>
          </div>
          {reportsLoading ? (
            <LoadingSpinner width={"2rem"} height={"2rem"} />
          ) : !report || !subProjectReport ? (
            <>
              {error ? (
                <p
                  style={{
                    fontSize: "0.875rem",
                    textAlign: "center",
                    color: "red",
                  }}
                >
                  An error occurred while trying to generate reports for{" "}
                  {selectedProject}
                </p>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="graphs" style={{ paddingBottom: "20rem" }}>
              <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                {projecTaskInfo}
              </p>
              {foundProjectTime && (
                <>
                  {" "}
                  {
                    foundProjectTime?.is_continuous === true ? <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                      This is a continuous project
                    </p>
                    :
                      <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                        {`The total time estimated for this project is ${isNaN(foundProjectTime.total_time) ? foundProjectTime.total_time : Number(foundProjectTime.total_time).toLocaleString()} hours`}
                      </p>
                  }
                  <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                    {`The project lead of this project is ${foundProjectTime.lead_name}`}
                  </p>
                </>
              )}
              <div
                style={{
                  maxWidth: "100%",
                  padding: "20px 10px",
                  margin: "2rem auto",
                  width: "max-content",
                  minWidth: report?.labels?.length < 10 ? "55%" : "100%",
                }}
                className="graph__Item"
              >
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                  Bar chart showing total work logs and hours
                </h2>
                <Bar options={options} data={report} />
              </div>
              <div
                style={{
                  maxWidth: "100%",
                  padding: "20px 10px",
                  margin: "2rem auto",
                  width: "max-content",
                  minWidth:
                    subProjectReport?.labels?.length < 10 ? "55%" : "100%",
                }}
                className="graph__Item"
              >
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                  Bar chart showing subprojects report
                </h2>
                <Bar options={options} data={subProjectReport} />
              </div>

              {
                foundProjectTime &&
                <div
                  style={{
                    maxWidth: "100%",
                    padding: "20px 10px",
                    margin: "2rem auto",
                    width: "200px",
                    minWidth:
                      foundProjectTime?.labels?.length < 10
                        ? "60%"
                        : "60%",
                  }}
                  className="graph__Item"
                >
                  <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Doughnut Chart showing the time spent
                  </h2>
                  <div 
                    style={{ 
                      width: 400, 
                      height: 400,
                      margin: '0 auto'
                    }}
                  >
                    <Doughnut
                      options={options}
                      data={{
                        labels: ["Spent time", "Left time"],
                        datasets: [
                          {
                            data: [
                              foundProjectTime.spent_time,
                              foundProjectTime.left_time,
                            ],
                            backgroundColor: [
                              "#005734",
                              "#D3D3D3",
                            ],
                            borderColor: ["#005734", "#D3D3D3",],
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              }

              {/* <div
                style={{
                  maxWidth: "100%",
                  padding: "20px",
                  margin: "2rem auto",
                }}
                className="graph__Item"
              >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Table data showing total subprojects, tasks and hours</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Number of Tasks Added</th>
                      <th>Total Hours</th>
                      <th>Number of subprojects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.user}</td>
                        <td>{item.tasks_added}</td>
                        <td>{Number(item.total_hours).toFixed(2)}</td>
                        <td>{Object.keys(item?.subprojects || {})?.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  maxWidth: "100%",
                  padding: "20px",
                  margin: "2rem auto",
                }}
                className="graph__Item"
              >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Table data showing tasks uploaded by candidate per subproject</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      {
                        React.Children.toArray([...new Set(tableData.map(item => Object.keys(item.subprojects || {})).flat())].map(subproject => {
                          return <th>{subproject}</th>
                        }))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.user}</td>
                        {
                          React.Children.toArray([...new Set(tableData.map(item => Object.keys(item.subprojects || {})).flat())].map(subproject => {
                              return <td>
                                {
                                  item?.subprojects[subproject] ? 
                                  item?.subprojects[subproject] :
                                  0
                                }
                              </td>
                            }))
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default TaskReports;
