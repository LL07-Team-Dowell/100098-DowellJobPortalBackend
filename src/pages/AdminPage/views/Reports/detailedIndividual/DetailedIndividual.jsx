import React, { useEffect, useState } from "react";
import "./DetailedIndividual.scss";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getAllOnBoardCandidate } from "../../../../../services/adminServices";
export default function DetailedIndividual() {
  console.log("asasdasdasdad");
  useEffect(() => {
    getAllOnBoardCandidate()
      .then(
        ({
          data: {
            response: { data },
          },
        }) => {
          console.log(data.filter((candidate) => candidate.status === "hired"));
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
      <div className=""></div>
    </StaffJobLandingLayout>
  );
}
