import React, { useEffect, useState } from "react";
import "./DetailedIndividual.scss";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import {
  getAllOnBoardCandidate,
  generateindividualReport,
} from "../../../../../services/adminServices";
import { IoFilterOutline } from "react-icons/io5";
export default function DetailedIndividual() {
  const [candidate, setcandidate] = useState([]);
  const [id, setId] = useState("");
  //   useEffect(() => {generateindividualReport({id:})}, [id]);
  useEffect(() => {
    getAllOnBoardCandidate()
      .then(
        ({
          data: {
            response: { data },
          },
        }) => {
          setcandidate(
            data.filter((candidate) => candidate.status === "hired")
          );
        }
      )
      .catch((err) => console.log(err));
  }, []);
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
            <select defaultValue={""}>
              <option value="" disabled>
                select candidate
              </option>
              {candidate.map((person) => (
                <option value={person._id}>{person.username}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
}
