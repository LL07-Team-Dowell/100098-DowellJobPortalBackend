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
import Select from 'react-select'
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
  const [options,setOptions] = useState([])
  const handleChange = (e) => {
    setcandidates(candidates2.filter(v => v.username.toLowerCase().includes(e.target.value.toLowerCase())))
  }
  const getIndividualData = (id) => {
    setSecondLoadng(true);
    setId(id);
    generateCommonAdminReport({
      report_type:"Individual",
      year: new Date().getFullYear().toString(),
      applicant_id: id,
    })
      .then((resp) => {
        console.log({id})
        console.log(resp.data);
        setCandidateDate(resp.data.data[0]);
        setPersonalInfo(resp.data.personal_info);
        console.log(resp.data.personal_info);
        setCandidateName(resp.data.personal_info.username);
        setSecondLoadng(false);
      })
      .catch((err) => console.error(err));
  }
  const handleSelectChange = (id) => {
    getIndividualData(id)
  }

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
          setcandidates2(data.filter((candidate) => candidate.status === "hired"))
          setOptions(data.filter((candidate) => candidate.status === "hired").map(v => ({ value: v._id, label: v.username })))
          setFirstLoading(false);
        }
      )
      .catch((err) => console.log(err));
  }, []);
 
   
  if (firstLoading)
    return (
      <StaffJobLandingLayout
        adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Detailed individual report"}
      >
        <LoadingSpinner />
      </StaffJobLandingLayout>
    );
  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Detailed individual report"}
    >
      <div className="detailed_indiv_container">
        <button className="back" onClick={() => navigate(-1)}>
          <MdArrowBackIosNew />
        </button>
        <div className="selction_container">
          <p>Select Candidate</p>
          <Select options={options}  onChange={e => handleSelectChange(e?.value)}/>
          {/* FIX IT */}
          {id !== "" ? (
            <>
              {" "}
              {secondLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {candidateName && <h1>candidate name : {candidateName}</h1>}
                  <div className="graph">
                    <Bar
                      data={{
                        labels: Object.keys(candidateData),
                        datasets: Object.keys(candidateData).map((key) => {
                          return {
                            label: key, // Use the key as the dataset label
                            backgroundColor: [
                              "#005734",
                              "rgb(126, 126, 126)",
                              "#121212",
                            ],
                            borderColor: [
                              "#005734",
                              "rgb(126, 126, 126)",
                              "#121212",
                            ],
                            data: [
                              candidateData[key].tasks_approved,
                              candidateData[key].tasks_added,
                              candidateData[key].team_tasks,
                            ],
                          };
                        }),
                      }}
                    />
                  </div>
                  <div className="personal_info">
                    <h6>personal info</h6>
                    <div>
                      <p>
                        <span>status:</span>
                        {personalInfo.status}
                      </p>
                      <p>
                        <span>applicant:</span>
                        {personalInfo.applicant}
                      </p>
                      <p>
                        <span>applicant email:</span>
                        {personalInfo.email}
                      </p>
                      <p>
                        <span>country:</span>
                        {personalInfo.country}
                      </p>
                      <p>
                        <span>project:</span>
                        {personalInfo.project}
                      </p>
                      <p>
                        <span>username:</span>
                        {personalInfo.username}
                      </p>
                      <p>
                        <span>portfolio name:</span>
                        {personalInfo.portfolio_name}
                      </p>
                      <p>
                        <span>shortlisted on:</span>
                        {formatDate(personalInfo.shortlisted_on)}
                      </p>
                      <p>
                        <span>selected on:</span>
                        {formatDate(personalInfo.selected_on)}
                      </p>
                      <p>
                        <span>hired on:</span>
                        {formatDate(personalInfo.hired_on)}
                      </p>
                      <p>
                        <span>onboarded on:</span>
                        {formatDate(personalInfo.onboarded_on)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : null}
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
