import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
// import "./taskreports.css";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import {
  getAllOnBoardCandidate,
  generateIndividualTaskReport,
} from "../../../../../services/adminServices";

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
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";

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

const IndividualTaskReports = ({ subAdminView }) => {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const navigate = useNavigate();
  const [candidates, setcandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { currentUser  } = useCurrentUserContext();
  useEffect(() => {
    getAllOnBoardCandidate(currentUser.portfolio_info[0].org_id)
      .then(
        ({
          data: {
            response: { data },
          },
        }) => {
          setcandidates(
            data.filter((candidate) => candidate.status === "hired")
          );
        }
      )
      .catch((err) => console.log(err));
  }, []);

  //   const dataToPost = {
  //     applicant_id: selectedCandidateData._id,
  //     username: selectedCandidateData.username,
  //     portfolio_name: selectedCandidateData.portfolio_name,
  //   };

  useEffect(() => {
    if(selectedCandidate) {
        generateIndividualTaskReport({
          applicant_id: selectedCandidate._id,
          username: selectedCandidate.username,
          portfolio_name: selectedCandidate.portfolio_name,
        })
        .then((resp) => {
            console.log(resp.data)
        })
        .catch((err) => console.error(err))
    }
  },[selectedCandidate])

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
            <h2>Individual Task Reports</h2>
          </div>
          <div className="task__report__header">
            <p>Get insights into Individual Task Report</p>
            <>
              {projectsLoading ? (
                <p>Loading projects</p>
              ) : (
                <>
                <input type="text" placeholder="search candidate"/>
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
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default IndividualTaskReports;
