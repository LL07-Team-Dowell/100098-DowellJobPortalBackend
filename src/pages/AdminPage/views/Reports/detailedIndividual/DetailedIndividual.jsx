import React, { useEffect, useState } from "react";
import "./DetailedIndividual.scss";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import {
  getAllOnBoardCandidate,
  generateindividualReport,
} from "../../../../../services/adminServices";
import { IoFilterOutline } from "react-icons/io5";
import { RiH1 } from "react-icons/ri";
export default function DetailedIndividual() {
  const [candidates, setcandidates] = useState([]);
  const [id, setId] = useState("");
  const [candidateData, setCandidateDate] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  useEffect(() => {
    if (id) {
      generateindividualReport({
        year: new Date().getFullYear(),
        applicant_id: id,
      })
        .then((resp) => {
          console.log(resp.data);
          setCandidateDate(resp.data.data[0]);
          setCandidateName(resp.data.personal_info.username);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);
  useEffect(() => {
    getAllOnBoardCandidate()
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
  const keyToDisplayText = {
    percentage_tasks_completed: "Percentage of Tasks Completed",
    percentage_team_tasks_completed: "Percentage of Team Tasks Completed",
    tasks_added: "Tasks Added",
    tasks_approved: "Tasks Approved",
    tasks_completed: "Tasks Completed",
    tasks_uncompleted: "Tasks Uncompleted",
    team_tasks: "Team Tasks",
    team_tasks_approved: "Team Tasks Approved",
    team_tasks_comments_added: "Team Tasks Comments Added",
    team_tasks_completed: "Team Tasks Completed",
    team_tasks_issues_raised: "Team Tasks Issues Raised",
    team_tasks_issues_resolved: "Team Tasks Issues Resolved",
    team_tasks_uncompleted: "Team Tasks Uncompleted",
    teams: "Teams",
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Detailed individual report"}
    >
      <div className="detailed_indiv_container">
        <div className="selction_container">
          <p>Select Candidate</p>
          <div className="role__Filter__Wrapper">
            <IoFilterOutline />
            <select defaultValue={""} onChange={(e) => setId(e.target.value)}>
              <option value="" disabled>
                select candidate
              </option>
              {candidates.map((person) => (
                <option value={person._id}>{person.username}</option>
              ))}
            </select>
          </div>
          {candidateName && <h1>candidate name : {candidateName}</h1>}
          {Object.keys(candidateData).map((data, index) => (
            <div className="candidate_indiv_data">
              <div>
                <span>Month</span>:{data}
                {Object.keys(candidateData[data]).map((key) => (
                  <div key={key}>
                    {keyToDisplayText[key]}: {candidateData[data][key]}
                    {keyToDisplayText[key].match(/\w+/)[0] === "Percentage" &&
                      "%"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
}
