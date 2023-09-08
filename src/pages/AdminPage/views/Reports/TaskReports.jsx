import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import "./taskreports.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getSettingUserProject } from "../../../../services/hrServices";
import { generateTaskReport } from "../../../../services/reportServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";

import axios from "axios";
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
  const hrCompanyId = "6385c0f18eca0fb652c94561";
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [report, setReport] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [projecTaskInfo, setProjectTaskInfo] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    setProjectsLoading(true);

    getSettingUserProject()
      .then((res) => {
        const projectsGotten = res?.data
          ?.filter(
            (project) =>
              project?.data_type === "Real_Data" &&
              project?.company_id === hrCompanyId &&
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
      company_id: hrCompanyId,
      project: selectedProject,
    };

    setReportsLoading(true);

    generateTaskReport(dataToPost)
      .then((res) => {
        console.log(res.data);
        const labels = res.data?.data?.users_that_added.map(
          (item) => item.user
        );

        const formattedData = {
          labels,
          datasets: [
            {
              label: "Tasks",
              data: res.data?.data?.users_that_added.map(
                (item) => item.tasks_added
              ),
              backgroundColor: "#005734",
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
            <p>Get insights into your organizations</p>
            <>
              {projectsLoading ? (
                <p>Loading projects</p>
              ) : (
                <select
                  className="select__task__report__project"
                  defaultValue={""}
                  onChange={({ target }) => setSelectedProject(target.value)}
                >
                  <option value={""} disabled>
                    Select project
                  </option>
                  {React.Children.toArray(
                    projects.map((project) => {
                      return <option value={project}>{project}</option>;
                    })
                  )}
                </select>
              )}
            </>
          </div>
          {reportsLoading ? (
            <p>Loading tasks reports........</p>
          ) : !report ? (
            <></>
          ) : (
            <div className="graphs" style={{ paddingBottom: "20rem" }}>
              <p>{projecTaskInfo}</p>
              <div
                style={{
                  maxWidth: "70rem",
                  padding: "20px",
                  margin: "2rem 0",
                }}
                className="graph__Item"
              >
                <Bar options={options} data={report} />
              </div>
              <div
                style={{
                  maxWidth: "70rem",
                  padding: "20px",
                  margin: "2rem 0",
                }}
                className="graph__Item"
              >
                <h2>Table Data</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Number of Tasks Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.user}</td>
                        <td>{item.tasks_added}</td>
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
