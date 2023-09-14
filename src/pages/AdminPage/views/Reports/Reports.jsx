import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { CSVLink, CSVDownload } from "react-csv";

import {
  generateReport,
  getJobsFromAdmin,
} from "../../../../services/adminServices";
import { useEffect } from "react";
import { useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import "./style.scss";
// chart.js
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
// don
import { Doughnut, Bar } from "react-chartjs-2";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { generateCommonAdminReport } from "../../../../services/commonServices";
// register chart.js
ChartJs.register(ArcElement, Tooltip, Legend);

ChartJs.register(ArcElement, BarElement, CategoryScale, LinearScale);
const AdminReports = ({ subAdminView }) => {
  const navigate = useNavigate();
  // states
  const [selectOptions, setSelectOptions] = useState("");
  const [data, setdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstDate, setFirstDate] = useState(
    formatDateFromMilliseconds(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [lastDate, setLastDate] = useState(
    formatDateFromMilliseconds(new Date().getTime())
  );
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [firstDateState, setFirstDateState] = useState(
    formatDateFromMilliseconds(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [lastDateState, setLastDateState] = useState(
    formatDateFromMilliseconds(new Date().getTime())
  );
  const [loadingButton, setLoadingButton] = useState(false);
  const { currentUser } = useCurrentUserContext();

  console.log({ selectOptions, lastDate, firstDate });
  // handle functions
  const handleSelectOptionsFunction = (e) => {
    setSelectOptions(e.target.value);
    if (e.target.value === "custom_time") {
      setShowCustomTimeModal(true);
    } else {
      setShowCustomTimeModal(false);
    }
  };
  const closeModal = () => {
    setShowCustomTimeModal(false);
  };
  const handleSubmitDate = (start_date, end_date) => {
    setLoadingButton(true);
    setFirstDateState(start_date);
    setLastDateState(end_date);
    const data = {
      start_date,
      end_date,
      report_type: "Admin",
      company_id: currentUser.portfolio_info[0].org_id,
    };
    generateCommonAdminReport(data)
      .then((resp) => {
        closeModal();
        setLoadingButton(false);
        console.log(resp.data.response);
        setdata(resp.data.response);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setLoadingButton(false);
      });
  };
  //   useEffect

  useEffect(() => {
    setLoading(true);
    const data = {
      start_date: firstDate,
      end_date: lastDate,
      report_type: "Admin",
      company_id: currentUser.portfolio_info[0].org_id,
    };

    generateCommonAdminReport(data)
      .then((resp) => {
        setLoading(false);
        console.log(resp.data.response);
        setdata(resp.data.response);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  console.log(data.hiring_rate);
  if (loading)
    return (
      <StaffJobLandingLayout
        adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Reports"}
        subAdminView={subAdminView}
      >
        <div className='reports__container'>
          <div className='reports__container_header'>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <button className='back' onClick={() => navigate(-1)}>
                  <MdArrowBackIosNew />
                </button>
                <h2>Get insights into your organization</h2>
              </div>
            </div>
          </div>
        </div>
        <LoadingSpinner />
      </StaffJobLandingLayout>
    );

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      subAdminView={subAdminView}
      hideSideBar={showCustomTimeModal}
    >
      <div className='reports__container'>
        <div className='reports__container_header'>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button className='back' onClick={() => navigate(-1)}>
                <MdArrowBackIosNew />
              </button>
              <h2>Get insights into your organization</h2>
            </div>
            <CSVLink data={[Object.keys(data), Object.values(data)]}>
              Download Me
            </CSVLink>
          </div>
          <div>
            <p></p>
            <select
              className='select_time_tage'
              onChange={handleSelectOptionsFunction}
              defaultValue={"last_7_days"}
            >
              <option value='' disabled>
                select time
              </option>
              <option value='last_7_days'>last 7 days</option>
              <option value='custom_time'>custom time</option>
            </select>
          </div>
        </div>
        <div className='graphs'>
          <div className='graph__Item'>
            <h6 style={{ marginBottom: 20 }}>jobs</h6>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <div style={{ width: "45%" }}>
                {data.no_of_active_jobs === 0 &&
                data.no_of_inactive_jobs === 0 ? (
                  <h4>
                    There are no active or inactive jobs created between{" "}
                    {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <>
                    <p>
                      <b>Doughnut chart showing active and inactive jobs</b>
                    </p>
                    <div style={{ width: "100%", height: 320 }}>
                      <Doughnut
                        data={{
                          labels: ["active jobs", "inactive jobs"],
                          datasets: [
                            {
                              label: "Poll",
                              data: [
                                data.no_of_active_jobs,
                                data.no_of_inactive_jobs,
                              ],
                              backgroundColor: ["#005734", "#D3D3D3"],
                              borderColor: ["#005734", "#D3D3D3"],
                            },
                          ],
                        }}
                      ></Doughnut>
                    </div>
                  </>
                )}
              </div>

              <div style={{ width: "45%" }}>
                <p>
                  <b>
                    Bar chart showing job most applied to and job least applied
                    to
                  </b>
                </p>
                {/* <p style={{marginTop:10}}>most applied job: {data.most_applied_job?.job_title}</p>
                <p>least applied job: {data.least_applied_job?.job_title}</p> */}
                <div style={{ width: "100%", height: 320 }}>
                  <Bar
                    data={{
                      labels: ["Job"],
                      datasets: [
                        {
                          label: data.most_applied_job?.job_title,
                          data: [data.most_applied_job?.no_job_applications],
                          backgroundColor: "#005734",
                          borderColor: "#005734",
                        },
                        {
                          label: data.least_applied_job?.job_title,
                          data: [data.least_applied_job?.no_job_applications],
                          backgroundColor: "#d3d3d3",
                          borderColor: "#d3d3d3",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='graph__Item'>
            <h6>applications</h6>
            <div className='application'>
              {!(
                data.job_applications ||
                data.nojob_applications_from_start_date_to_end_date
              ) ? (
                <h4>
                  There are no applications submitted between{" "}
                  {firstDateState.split(" ")[0]} and{" "}
                  {lastDateState.split(" ")[0]}
                </h4>
              ) : (
                <div style={{ width: 400, height: 300 }}>
                  <Doughnut
                    data={{
                      labels: [
                        "job applications",
                        "no job applications from start date to end date",
                      ],
                      datasets: [
                        {
                          label: "Poll",
                          data: [
                            data.job_applications,
                            data.nojob_applications_from_start_date_to_end_date,
                          ],
                          backgroundColor: ["#D3D3D3", "#005734"],
                          borderColor: ["#D3D3D3", "#005734"],
                        },
                      ],
                    }}
                  ></Doughnut>
                </div>
              )}
              {!extractNumber(data.hiring_rate) ? (
                <h4>
                  No candidates were hired between{" "}
                  {firstDateState.split(" ")[0]} and{" "}
                  {lastDateState.split(" ")[0]}
                </h4>
              ) : (
                <div style={{ width: 400, height: 300 }}>
                  <Doughnut
                    data={{
                      labels: ["hiring rate", "hiring total"],
                      datasets: [
                        {
                          label: "Poll",
                          data: [
                            extractNumber(data.hiring_rate),
                            100 - extractNumber(data.hiring_rate),
                          ],
                          backgroundColor: ["#D3D3D3", "#005734"],
                          borderColor: ["#D3D3D3", "#005734"],
                        },
                      ],
                    }}
                  ></Doughnut>{" "}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }} className='graph__Item'>
            <h6>candidates</h6>
            <div className='candidates_graph'>
              {!(
                data.hired ||
                data.rejected ||
                data.probationary_candidates ||
                data.rehired ||
                data.selected
              ) ? (
                <h4>
                  There is no candidate data between{" "}
                  {firstDateState.split(" ")[0]} and{" "}
                  {lastDateState.split(" ")[0]}
                </h4>
              ) : (
                <div style={{ width: 400, height: 300 }}>
                  <Bar
                    data={{
                      labels: [
                        "hired candidates",
                        "rejected candidates",
                        "probationary candidates",
                        "rehire candidates",
                        "selected candidates",
                      ],
                      datasets: [
                        {
                          label: "Poll",
                          data: [
                            data.hired,
                            data.rejected,
                            data.probationary_candidates,
                            data.rehired,
                            data.selected,
                          ],
                          backgroundColor: [
                            "#005734",
                            "#9146FF",
                            "#d3d3d3",
                            "black",
                            "pink",
                            "blue",
                          ],
                          borderColor: [
                            "#005734",
                            "#9146FF",
                            "#d3d3d3",
                            "black",
                            "pink",
                            "blue",
                          ],
                        },
                      ],
                    }}
                  ></Bar>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }} className='graph__Item'>
            <h6>Teams and tasks</h6>
            {!(data.teams || data.team_tasks || data.tasks) ? (
              <h4>
                There is no teams data between {firstDateState.split(" ")[0]}{" "}
                and {lastDateState.split(" ")[0]}
              </h4>
            ) : (
              <div style={{ width: 400, height: 300 }}>
                <Bar
                  data={{
                    labels: ["Teams", "team tasks", "individual tasks"],
                    datasets: [
                      {
                        label: "Poll",
                        data: [data.teams, data.tasks, data.tasks],
                        backgroundColor: ["#D3D3D3", "#005734", "black"],
                        borderColor: ["#D3D3D3", "#005734", "black"],
                      },
                    ],
                  }}
                ></Bar>
              </div>
            )}
            <div
              style={{
                display: `${
                  !(data.tasks_completed || data.tasks) ? "block" : "flex"
                }`,
              }}
            >
              <div>
                {!(data.tasks_completed || data.tasks) ? (
                  <h4>
                    There is no data between {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div style={{ width: 400, height: 300 }}>
                    <Doughnut
                      data={{
                        labels: ["tasks completed", "tasks"],
                        datasets: [
                          {
                            label: "Poll",
                            data: [data.tasks_completed, data.tasks],
                            backgroundColor: ["#D3D3D3", "#005734"],
                            borderColor: ["#D3D3D3", "#005734"],
                          },
                        ],
                      }}
                    ></Doughnut>
                  </div>
                )}
              </div>
              <div>
                {!(data.tasks_completed_on_time || data.tasks) ? (
                  <h4>
                    there is no data between {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div style={{ width: 400, height: 300 }}>
                    <Doughnut
                      data={{
                        labels: ["tasks completed on time", "tasks"],
                        datasets: [
                          {
                            label: "Poll",
                            data: [data.tasks_completed_on_time, data.tasks],
                            backgroundColor: ["#D3D3D3", "#005734"],
                            borderColor: ["#D3D3D3", "#005734"],
                          },
                        ],
                      }}
                    ></Doughnut>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='graph__Item'>
            <h6>Projects</h6>
            <p>
              project with most tasks: {data.project_with_most_tasks?.title}
            </p>
            <p>
              project with least tasks: {data.project_with_least_tasks?.title}
            </p>
            <div style={{ width: 400, height: 300 }}>
              <Bar
                data={{
                  labels: ["projects"],
                  datasets: [
                    {
                      label: data.project_with_most_tasks?.title,
                      data: [data.project_with_most_tasks?.tasks_added],
                      backgroundColor: "#005734",
                      borderColor: "#005734",
                    },
                    {
                      label: data.project_with_least_tasks?.title,
                      data: [data.project_with_least_tasks?.tasks_added],
                      backgroundColor: "#d3d3d3",
                      borderColor: "#d3d3d3",
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {showCustomTimeModal && (
        <FormDatePopup
          firstDate={firstDate}
          lastDate={lastDate}
          setFirstDate={setFirstDate}
          setLastDate={setLastDate}
          handleSubmitDate={handleSubmitDate}
          closeModal={closeModal}
          loading={loadingButton}
        />
      )}
    </StaffJobLandingLayout>
  );
};
export const FormDatePopup = ({
  setFirstDate,
  setLastDate,
  firstDate,
  lastDate,
  handleSubmitDate,
  closeModal,
  loading,
}) => {
  const handleFormSubmit = () => {
    if (firstDate && lastDate) {
      if (firstDate && lastDate) {
        handleSubmitDate(
          formatDateAndTime(firstDate),
          formatDateAndTime(lastDate)
        );
      } else {
        toast.error("the first or last date are not valid");
        console.log({
          firstDate,
          lastDate,
          isValidDatefirstDate: isValidDate(firstDate),
          isValidDateLastDate: isValidDate(lastDate),
        });
      }
    } else {
      toast.error("there is no first date or last date in ");
    }
  };
  return (
    <div className='overlay'>
      <div className='form_date_popup_container'>
        <div
          className='closebutton'
          onClick={loading ? () => {} : () => closeModal()}
        >
          {loading ? <></> : <AiOutlineClose />}
        </div>
        <label htmlFor='first_date'>Start Date</label>
        <input
          type='date'
          id='first_date'
          placeholder='mm/dd/yy'
          onChange={(e) => setFirstDate(e.target.value)}
        />
        <label htmlFor='first_date'>End Date</label>
        <input
          type='date'
          id='first_date'
          placeholder='mm/dd/yy'
          onChange={(e) => setLastDate(e.target.value)}
        />
        <button onClick={handleFormSubmit} disabled={loading}>
          {loading ? (
            <LoadingSpinner color='white' height={20} width={20} />
          ) : (
            "Get"
          )}
        </button>
      </div>
    </div>
  );
};
// asd
export default AdminReports;
function formatDateFromMilliseconds(milliseconds) {
  const dateObj = new Date(milliseconds);
  // comment
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
function formatDateAndTime(inputDate) {
  const dateObj = new Date(inputDate);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const formattedDateAndTime = `${month}/${day}/${year} 00:00:00`;
  return formattedDateAndTime;
}
function isValidDate(inputDate) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const dateRegex =
    /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/(19\d\d|20\d\d|2023)$/;
  if (!dateRegex.test(inputDate)) {
    return false;
  }
  const [month, day, year] = inputDate.split("/").map(Number);
  if (month < 1 || month > 12) {
    return false;
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }
  if (year !== currentYear && year !== currentYear - 1) {
    return false;
  }
  return true;
}

function extractNumber(inputString) {
  if (inputString === undefined) return 0;
  if (!isNaN(inputString)) return Number(inputString).toFixed(2);
  const cleanedString = inputString?.replace("%", "")?.trim();
  const number = parseFloat(cleanedString).toFixed(2);
  return parseFloat(number);
}
