import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { generateReport } from "../../../../services/adminServices";
import { useEffect } from "react";
import { useState } from "react";
// chart.js
import { Chart as ChartJs , ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale  } from "chart.js"
// don
import { Doughnut, Bar } from "react-chartjs-2";
// register chart.js
ChartJs.register(
  ArcElement, Tooltip, Legend 
)
const AdminReports = ({ subAdminView }) => {
  // states
  const [selectOptions, setSelectOptions] = useState("");
  const [data, setdata] = useState({});
  const [loading, setLoading] = useState(false)
  // handle functions
  const handleSelectOptionsFunction = (e) => {
    setSelectOptions(e.target.value);
  };

  //   useEffect
  useEffect(() => {
    setLoading(true)
    const data = {
      start_date: "5/26/2023 0:00:00",
      end_date: "7/26/2023 0:00:00",
    };
    generateReport(data)
      .then((resp) => {
        setLoading(false)
        console.log(resp.data.response);
        setdata(resp.data.response);
      })
      .catch((err) => {console.log(err); setLoading(false)});
  }, []);
  if(loading)return <StaffJobLandingLayout
  adminView={true}
  adminAlternativePageActive={true}
  pageTitle={"Reports"}
  subAdminView={subAdminView}
><h1>Loading..</h1>
</StaffJobLandingLayout>
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
      <div style={{marginBottom:20}}>
        <h6>jobs</h6>
        <div style={{width:400,height:300}}>
        <Doughnut data={{
          labels:['active jobs','inactive jobs'],
          datasets:[{
            label:'Poll',
            data:[data.number_active_jobs,data.number_inactive_jobs],
            backgroundColor:['black', 'red'],
            borderColor:['black', 'red']
          }]
          }}>

        </Doughnut>
        </div>
      </div>
      <div >
        <h6>applications</h6>
        <div style={{width:400,height:300}}>
        <Doughnut data={{
          labels:['active jobs','inactive jobs'],
          datasets:[{
            label:'Poll',
            data:[data.job_applications ,data.nojob_applications_from_start_date_to_end_date],
            backgroundColor:['black', 'red'],
            borderColor:['black', 'red']
          }]
          }}>

        </Doughnut>
        </div>
        <div>hiring rate:{data.hiring_rate}</div>
      </div>
      <div style={{marginBottom:20}}>
        <h6>candidates</h6>
        <div style={{width:400,height:300}}>
        <Doughnut data={{
          labels:['hired candidates','rejected candidates', 'probationary candidates', 'rehire andidates', 'selected candidates'],
          datasets:[{
            label:'Poll',
            data:[data.hired_candidates,data.rejected_candidates,data.probationary_candidates,data.rehire_candidates,data.selected_candidates],
            backgroundColor:['black', 'red'],
            borderColor:['black', 'red']
          }]
          }}>

        </Doughnut>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default AdminReports;
