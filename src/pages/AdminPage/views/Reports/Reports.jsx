import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { generateReport } from "../../../../services/adminServices";
import { useEffect } from "react";
import { useState } from "react";
const AdminReports = ({ subAdminView }) => {
  // states
  const [selectOptions, setSelectOptions] = useState("");
  const [data, setdata] = useState({});
  // handle functions
  const handleSelectOptionsFunction = (e) => {
    setSelectOptions(e.target.value);
  };

  //   useEffect
  useEffect(() => {
    const data = {
      start_date: "5/26/2023 0:00:00",
      end_date: "7/26/2023 0:00:00",
    };
    generateReport(data)
      .then((resp) => {
        console.log(resp.data.response);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      subAdminView={subAdminView}
    >
      <div className="reports__container">
        <h3>Reports</h3>
        <p>Get insights into your organizations</p>
        <select onChange={handleSelectOptionsFunction}>
          <option value="select_time">select time</option>
          <option value="last_7_days">last 7 days</option>
          <option value="custom_time">cutom time</option>
        </select>
      </div>
    </StaffJobLandingLayout>
  );
};

export default AdminReports;
