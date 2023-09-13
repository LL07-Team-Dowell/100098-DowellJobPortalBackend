import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import "./taskreports.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getSettingUserProject } from "../../../../services/hrServices";
import { generateTaskReport } from "../../../../services/reportServices";
import { generateCommonAdminReport } from "../../../../services/commonServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Select from 'react-select';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

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

const TaskReports = ({ subAdminView }) => {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [report, setReport] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [projecTaskInfo, setProjectTaskInfo] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  const [ error, setError ] = useState(false);

  const options = [
    { value: "", label: "Select project" },
    ...projects.map((project) => ({
      value: project,
      label: project,
    })),
  ];

  const handleChange = (selectedOption) => {
    setSelectedProject(selectedOption.value);
  };

  useEffect(() => {
    setProjectsLoading(true);

    getSettingUserProject()
      .then((res) => {
        const projectsGotten = res?.data
          ?.filter(
            (project) =>
              project?.data_type === currentUser.portfolio_info[0].data_type &&
              project?.company_id === currentUser.portfolio_info[0].org_id &&
              project.project_list &&
              project.project_list.every(
                (listing) => typeof listing === "string"
              )
          )
          ?.reverse();
        setProjects(projectsGotten[0]?.project_list);
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
      company_id: currentUser.portfolio_info[0].org_id,
    };

    setReportsLoading(true);
    setError(false);

    generateCommonAdminReport(dataToPost)
      .then((res) => {
        console.log(res.data);
        const labels = res.data?.data?.users_that_added.map(
          (item) => item.user
        );

        const formattedData = {
          labels,
          datasets: [
            {
              label: "Subprojects",
              data: res.data?.data?.users_that_added.map(
                (item) => Object.keys(item?.subprojects || {})?.length
              ),
              backgroundColor: "blue",
            },
            {
              label: "Tasks",
              data: res.data?.data?.users_that_added.map(
                (item) => item.tasks_added
              ),
              backgroundColor: "#005734",
            },
            {
              label: "Hours",
              data: res.data?.data?.users_that_added.map(
                (item) => item.total_hours
              ),
              backgroundColor: "red",
            },
          ],
        };

        setTableData(res.data?.data?.users_that_added); // Set table data

        setReport(formattedData);
        setProjectTaskInfo(
          `A total of ${res?.data?.data?.total_tasks_added} tasks have been added in ${selectedProject}`
        );
        setReportsLoading(false);
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
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      subAdminView={subAdminView}
    >
      <div className="task__reports__container">
        <div className="task__reports__container_header">
          <div className="task__report__nav">
            <button className="back" onClick={() => navigate(-1)}>
              <MdOutlineArrowBackIosNew />
            </button>
            <h2>Task Reports</h2>
          </div>
          <div className="task__report__header">
            <p style={{ fontSize: '0.9rem' }}>Get insights into tasks uploaded per project in your organization</p>
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
          ) : !report ? (
            <>
              {
                error ? 
                <p style={{ fontSize: '0.875rem', textAlign: 'center', color: 'red' }}>
                  An error occurred while trying to generate reports for {selectedProject}
                </p>
                :
                <></>
              }
            </>
          ) : (
            <div className="graphs" style={{ paddingBottom: "20rem" }}>
              <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>{projecTaskInfo}</p>
              <div
                style={{
                  maxWidth: "100%",
                  padding: "20px",
                  margin: "2rem auto",
                }}
                className="graph__Item"
              >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Bar chart showing total subprojects, tasks and hours</h2>
                <Bar options={options} data={report} />
              </div>
              <div
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
              </div>
            </div>
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default TaskReports;
