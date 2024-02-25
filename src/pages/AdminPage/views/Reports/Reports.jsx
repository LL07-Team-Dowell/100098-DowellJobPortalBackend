import { useRef } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { CSVLink, CSVDownload } from "react-csv";
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
  PointElement,
  LineElement,
  Title,
} from "chart.js";
// don
import exportAsImage from "../../../../helpers/exportAsImage";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { generateCommonAdminReport } from "../../../../services/commonServices";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { changeToTitleCase, formatDateForAPI } from "../../../../helpers/helpers";
import ReportCapture from "../../../../components/ReportCapture/ReportCapture";
import { useModal } from "../../../../hooks/useModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// register chart.js
ChartJs.register(ArcElement, Tooltip, Legend);

ChartJs.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const AdminReports = ({ subAdminView, isPublicReportUser }) => {
  const {
    closeModal: closeReportCaptureModal,
    modalOpen: reportCaptureModal,
    openModal: openCaptureModal,
  } = useModal();
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
  const { currentUser, reportsUserDetails } = useCurrentUserContext();
  const [datasetForApplications, setDatasetForApplications] = useState(null);
  const [reportDataToDownload, setReportDataToDownload] = useState([]);
  const [PDFbtnDisabled, setPDFBtnDisabled] = useState(false);
  const csvLinkRef = useRef();
  const graphDivRef = useRef();

  const exportPDF = () => {
    const input = document.getElementById("reports__container");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCors: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG");
      pdf.save("goatrank.pdf");
    });
  };

  console.log({ selectOptions, lastDate, firstDate });
  const colors = [
    "#005734",
    "blue",
    "yellow",
    "purple",
    "pink",
    "black",
    "orange",
    "green",
    "blueviolet",
    "brown",
    "red",
    "d3d3d3",
    "rgb(53, 162, 235)",
    "indigo",
    "bisque",
    "burlywood",
    "aqua",
    "chocolate",
    "cornflowerblue",
    "#be6464",
    "turquoise",
    "teal",
    "springgreen",
    "skyblue",
    "royalblue",
  ];
  const exportRef = useRef();
  const captureScreen = () => exportAsImage(exportRef.current, "test");
  // handle functions
  const handleSelectOptionsFunction = (e) => {
    setSelectOptions(e.target.value);
    if (e.target.value === "custom_time") {
      setShowCustomTimeModal(true);
    } else {
      setLoading(true);
      setShowCustomTimeModal(false);
      const data = {
        start_date: formatDateFromMilliseconds(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        ),
        end_date: formatDateFromMilliseconds(new Date().getTime()),
        report_type: "Admin",
        company_id: isPublicReportUser
          ? reportsUserDetails?.company_id
          : currentUser.portfolio_info[0].org_id,
      };
      generateCommonAdminReport(data)
        .then((resp) => {
          setLoading(false);
          // console.log(resp.data.response);
          setdata(resp?.data?.data);
        })
        .catch((err) => console.log(err));
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
      company_id: isPublicReportUser
        ? reportsUserDetails?.company_id
        : currentUser.portfolio_info[0].org_id,
    };
    setDatasetForApplications(null);
    generateCommonAdminReport(data)
      .then((resp) => {
        closeModal();
        setLoadingButton(false);
        console.log(resp?.data?.data);
        setdata(resp?.data?.data);

        const months = Object.keys(
          resp?.data?.data?.job_applications?.months || {}
        );
        let currentTrack = 0;
        const datasetData = months
          .map((month, index) => {
            if (resp?.data?.data?.job_applications?.months[month] === 0)
              return null;
            return resp?.data?.data?.job_applications?.months[month].map(
              (item) => {
                if (currentTrack > colors.length - 1) {
                  currentTrack = 0;
                } else {
                  currentTrack += 1;
                }

                const dummyData = Array(months.length)
                  .fill()
                  .map((_, i) => 0);
                dummyData[index] = item.no_job_applications;
                return {
                  label: item.job_title,
                  data: dummyData,
                  backgroundColor: colors[currentTrack],
                  borderColor: colors[currentTrack],
                };
              }
            );
          })
          .filter((item) => item)
          .flat();
        setDatasetForApplications(datasetData);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setLoadingButton(false);
        toast.info(
          err.response
            ? err.response.status === 500
              ? "Report generation failed"
              : err?.response?.data?.message
            : "Report generation failed"
        );
      });
  };
  //   useEffect
  // ...

  useEffect(() => {
    setLoading(true);
    const data = {
      start_date: isPublicReportUser
        ? formatDateForAPI(reportsUserDetails?.reportStartDate, "report")
        : firstDate,
      end_date: isPublicReportUser
        ? formatDateForAPI(reportsUserDetails?.reportEndDate, "report")
        : lastDate,
      report_type: "Admin",
      company_id: isPublicReportUser
        ? reportsUserDetails?.company_id
        : currentUser.portfolio_info[0].org_id,
    };
    setDatasetForApplications(null);

    // Declare and initialize currentTrack here
    let currentTrack = 0;

    generateCommonAdminReport(data)
      .then((resp) => {
        setLoading(false);
        console.log(resp?.data?.data);
        setdata(resp?.data?.data);

        const months = Object.keys(
          resp?.data?.data?.job_applications?.months || {}
        );

        const datasetData = months
          .map((month, index) => {
            if (resp?.data?.data?.job_applications?.months[month] === 0)
              return null;
            return resp?.data?.data?.job_applications?.months[month].map(
              (item) => {
                if (currentTrack > colors.length - 1) {
                  currentTrack = 0;
                } else {
                  currentTrack += 1;
                }

                const dummyData = Array(months.length)
                  .fill()
                  .map((_, i) => 0);
                dummyData[index] = item.no_job_applications;
                return {
                  label: item.job_title,
                  data: dummyData,
                  backgroundColor: colors[currentTrack],
                  borderColor: colors[currentTrack],
                };
              }
            );
          })
          .filter((item) => item)
          .flat();

        // const datasets = months.map((month, index) => {
        //   if (resp.data.response.job_applications.months[month] === 0)
        //     return null;

        //   const dataPoints = months.map((_, i) => {
        //     return (
        //       resp.data.response.job_applications.months[month][i]
        //         ?.no_job_applications || 0
        //     );
        //   });

        //   if (currentTrack > colors.length - 1) {
        //     currentTrack = 0;
        //   } else {
        //     currentTrack += 1;
        //   }

        //   return {
        //     label: month, // Label for the line (could be the month)
        //     data: dataPoints, // An array of data points for this line
        //     borderColor: colors[currentTrack], // Line color
        //     fill: false, // To not fill the area under the line
        //   };
        // });

        // const datasetData = datasets.filter((item) => item);
        setDatasetForApplications(datasetData);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  console.log((data?.hired / data?.job_applications?.total) * 100);

  useEffect(() => {
    console.log(data);

    const reportDataKeys = ['ITEM', 'COUNT', 'TITLE'];

    const reportDataVals = Object.keys(data || {}).map(dataKey => {
      if (dataKey === 'job_applications') return null

      if (typeof data[dataKey] === 'object') {
        if (dataKey === 'least_applied_job') return [
          changeToTitleCase(dataKey.replaceAll('_', ' ')),
          data[dataKey]?.no_job_applications,
          data[dataKey]?.job_title
        ]

        if (dataKey === 'most_applied_job') return [
          changeToTitleCase(dataKey.replaceAll('_', ' ')),
          data[dataKey]?.no_job_applications,
          data[dataKey]?.job_title,
        ]

        return null
      }

      if (Array.isArray(data[dataKey])) {
        if (dataKey === 'project_with_least_tasks') return [
          changeToTitleCase(dataKey.replaceAll('_', ' ')),
          data[dataKey][0]?.tasks_added,
          data[dataKey][0]?.title,
        ]

        if (dataKey === 'project_with_most_tasks') return [
          changeToTitleCase(dataKey.replaceAll('_', ' ')),
          data[dataKey][0]?.tasks_added,
          data[dataKey][0]?.title,
        ]

        return null
      }

      return [
        changeToTitleCase(dataKey.replaceAll('_', ' ')),
        data[dataKey],
        ''
      ]

    }).filter(item => item);

    const [
      jobApplicationHeaderTitle,
      jobApplicationDataKeys,
      jobApplicationDataVals,
    ] = [
        ['MONTHLY JOB APPLICATION DATA'],
        [
          'MONTH',
          'COUNT OF APPLICATIONS',
        ],
        Object.keys(data?.job_applications?.months || {}).map(key => {
          return [
            key,
            data?.job_applications?.months[key],
          ]
        }),
      ];

    setReportDataToDownload([
      reportDataKeys,
      ...reportDataVals,
      [], // to act as spacing before next data
      [], // to act as spacing before next data
      [], // to act as spacing before next data
      [], // to act as spacing before next data
      jobApplicationHeaderTitle,
      [], // to act as spacing before next data
      jobApplicationDataKeys,
      ...jobApplicationDataVals,
    ]);

  }, [data]);

  // console.log(data?.hiring_rate);

  const handleDownloadExcelData = () => {

    if (!csvLinkRef.current) return

    csvLinkRef.current?.link?.click();

    closeReportCaptureModal();
    toast.success('Successfully downloaded report!');
  }

  const handleDownloadPDFData = (elemRef) => {
    if (!elemRef.current) return

    setPDFBtnDisabled(true);

    html2canvas(elemRef.current).then((canvas) => {
      let dataURL = canvas.toDataURL("image/png");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [elemRef.current.scrollHeight, elemRef.current.scrollWidth]
      });

      doc.addImage(dataURL, 'PNG', 1, 1);
      doc.save("report.pdf");

      setPDFBtnDisabled(false);
      closeReportCaptureModal();
      toast.success('Successfully downloaded report!');
    });
  }

  if (loading)
    return (
      <StaffJobLandingLayout
        adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Reports"}
        subAdminView={subAdminView}
        newSidebarDesign={!subAdminView ? true : false}
      >
        <div className='reports__container' id='reports__container'>
          <div className='reports__container_header'>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {isPublicReportUser ? (
                  <>
                    <h2>Organization report</h2>
                  </>
                ) : (
                  <>
                    <button className='back' onClick={() => navigate(-1)}>
                      <MdArrowBackIosNew />
                    </button>
                    <h2>Get insights into your organization</h2>
                  </>
                )}
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
      newSidebarDesign={!subAdminView ? true : false}
    >
      <>
        <div className='reports__container' ref={exportRef}>
          <div className='reports__container_header'>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {isPublicReportUser ? (
                  <>
                    <h2>Organization report</h2>
                  </>
                ) : (
                  <>
                    <button className='back' onClick={() => navigate(-1)}>
                      <MdArrowBackIosNew />
                    </button>
                    <h2>Get insights into your organization</h2>
                  </>
                )}
              </div>
              <CSVLink
                data={reportDataToDownload}
                ref={csvLinkRef}
                style={{ display: 'none' }}
              >
                Download Me
              </CSVLink>
              <button
                className={'download__Report__Btn'}
                onClick={() => {
                  openCaptureModal();
                }}
              >
                Download report
              </button>
            </div>
            <br />
            {!isPublicReportUser && (
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
            )}
          </div>
          <div className='graphs' ref={graphDivRef}>
            <div className='graph__Item'>
              <h6 style={{ marginBottom: 20 }}>jobs</h6>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ width: "48%" }}>
                  {data?.no_of_active_jobs === 0 &&
                    data?.no_of_inactive_jobs === 0 ? (
                    <h4>
                      There are no active or inactive jobs created between{" "}
                      {firstDateState.split(" ")[0]} and{" "}
                      {lastDateState.split(" ")[0]}
                    </h4>
                  ) : (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <b>Doughnut chart showing active and inactive jobs</b>
                      </p>
                      <div
                        style={{
                          width: "100%",
                          height: 320,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Doughnut
                          data={{
                            labels: ["active jobs", "inactive jobs"],
                            datasets: [
                              {
                                label: "Poll",
                                data: [
                                  data?.no_of_active_jobs,
                                  data?.no_of_inactive_jobs,
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

                <div style={{ width: "48%" }}>
                  <p style={{ textAlign: "center" }}>
                    <b>
                      Pie chart showing job most applied to and job least
                      applied to
                    </b>
                  </p>
                  {/* <p style={{marginTop:10}}>most applied job: {data.most_applied_job?.job_title}</p>
                <p>least applied job: {data.least_applied_job?.job_title}</p> */}
                  <div
                    style={{
                      width: "100%",
                      height: 320,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pie
                      data={{
                        labels: [
                          data?.most_applied_job?.job_title,
                          data?.least_applied_job?.job_title,
                        ],
                        datasets: [
                          {
                            data: [
                              data?.most_applied_job?.no_job_applications,
                              data?.least_applied_job?.no_job_applications,
                            ],
                            backgroundColor: ["#005734", "#d3d3d3"],
                            borderColor: ["#005734", "#d3d3d3"],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: true, // You can set this to false if you want to hide the legend
                          },
                        },
                        responsive: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='graph__Item'>
              <h6>applications</h6>
              <div
                className='application'
                style={{
                  flexDirection:
                    datasetForApplications?.length > 12 ? "column" : "row",
                  gap: datasetForApplications?.length > 12 ? "5rem" : "unset",
                }}
              >
                {!(
                  data?.job_applications ||
                  data?.nojob_applications_from_start_date_to_end_date
                ) ? (
                  <h4>
                    There are no applications submitted between{" "}
                    {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div
                    style={{
                      width:
                        datasetForApplications?.length > 12 ? "100%" : "48%",
                      height:
                        datasetForApplications?.length > 12
                          ? "max-content"
                          : 400,
                      maxWidth: "100%",
                    }}
                  >
                    {datasetForApplications ? (
                      <>
                        <p style={{ marginBottom: 20 }}>
                          <b>Line chart showing job applications</b>
                        </p>
                        <Line
                          data={{
                            labels: Object.keys(
                              data?.job_applications.months || {}
                            ),
                            datasets: datasetForApplications,
                          }}
                          options={chartOptions}
                          style={{ height: "max-content", width: "100%" }}
                        />
                      </>
                    ) : (
                      <>
                        <h4>
                          There are no applications submitted between{" "}
                          {firstDateState.split(" ")[0]} and{" "}
                          {lastDateState.split(" ")[0]}
                        </h4>
                      </>
                    )}
                    {/* <Doughnut
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
                  ></Doughnut> */}
                  </div>
                )}
                {!extractNumber(data?.hiring_rate) ? (
                  <h4>
                    No candidates were hired between{" "}
                    {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div style={{ width: "48%", height: 400 }}>
                    <p
                      style={{
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <b>Doughnut chart showing hiring rate</b>
                    </p>
                    {/* <Doughnut
                    data={{
                      labels: ["hiring rate", "non-hiring rate"],
                      datasets: [
                        {
                          label: "Poll",
                          data: [
                            extractNumber(data.hiring_rate),
                            100 - extractNumber(data.hiring_rate),
                          ],
                          backgroundColor: ["#005734", "#D3D3D3"],
                          borderColor: ["#005734", "#D3D3D3"],
                        },
                      ],
                    }}
                    options={chartOptions}
                    style={{ margin: "0 auto" }}
                  ></Doughnut> */}
                    <div style={{ width: 200, height: 200, margin: "auto" }}>
                      <CircularProgressbar
                        style={{
                          width: "100%",
                          height: "100%",
                          margin: "auto",
                        }}
                        value={
                          data?.job_applications?.total
                            ? (
                              (data?.hired / data?.job_applications?.total) *
                              100
                            ).toFixed(2)
                            : "0"
                        }
                        text={
                          data?.job_applications?.total
                            ? `${(
                              (data?.hired / data?.job_applications?.total) *
                              100
                            ).toFixed(2)}%`
                            : "00%"
                        }
                        styles={buildStyles({
                          pathColor: `#005734`,
                          textColor: "#005734",
                          trailColor: "#efefef",
                          backgroundColor: "#005734",
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }} className='graph__Item'>
              <h6>candidates</h6>
              <div className='candidates_graph'>
                {!(
                  data?.hired ||
                  data?.rejected ||
                  data?.probationary_candidates ||
                  data?.rehired ||
                  data?.selected
                ) ? (
                  <h4>
                    There is no candidate data between{" "}
                    {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      height: 320,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bar
                      data={{
                        labels: [
                          "candidates",
                          // "hired candidates",
                          // "rejected candidates",
                          // "probationary candidates",
                          // "rehire candidates",
                          // "selected candidates",
                          // "shortlisted candidates",
                        ],
                        datasets: [
                          {
                            label: "Hired candidates",
                            data: [data?.onboarded],
                            backgroundColor: ["#005734"],
                            borderColor: ["#005734"],
                            maxBarThickness: 40,
                          },
                          {
                            label: "Rejected candidates",
                            data: [data?.rejected],
                            backgroundColor: ["#9146FF"],
                            borderColor: ["#9146FF"],
                            maxBarThickness: 40,
                          },
                          {
                            label: "Probationary candidates",
                            data: [data?.probationary_candidates],
                            backgroundColor: ["black"],
                            borderColor: [],
                            maxBarThickness: 40,
                          },
                          {
                            label: "Rehired candidates",
                            data: [data?.rehired],
                            backgroundColor: ["pink"],
                            borderColor: ["pink"],
                            maxBarThickness: 40,
                          },
                          {
                            label: "Selected candidates",
                            data: [data?.selected],
                            backgroundColor: ["blue"],
                            borderColor: ["blue"],
                            maxBarThickness: 40,
                          },
                          {
                            label: "Shortlisted candidates",
                            data: [data?.shortlisted],
                            backgroundColor: ["orange"],
                            borderColor: ["orange"],
                            maxBarThickness: 40,
                          },
                        ],
                      }}
                      options={chartOptions}
                    ></Bar>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }} className='graph__Item'>
              <h6>Teams and work logs</h6>
              <div className='teams__And_Tasks__Wrapper'>
                {!(data?.teams || data?.team_tasks || data?.tasks) ? (
                  <h4>
                    There is no teams data between{" "}
                    {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                ) : (
                  <div style={{ marginBottom: 60 }}>
                    <div style={{ width: 400, height: 300 }}>
                      <p style={{ marginBottom: 20 }}>
                        <b>Doughnut chart showing teams and work logs</b>
                      </p>
                      <Doughnut
                        data={{
                          labels: [
                            "Teams",
                            "Team Tasks",
                            "Individual Work logs",
                          ],
                          datasets: [
                            {
                              data: [data?.teams, data?.tasks, data?.tasks],
                              backgroundColor: [
                                "#D3D3D3",
                                "#005734",
                                "#160291",
                              ],
                              borderColor: ["#D3D3D3", "#005734", "#160291"],
                            },
                          ],
                        }}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                )}
                <div>
                  {!(data?.tasks_completed || data?.tasks) ? (
                    <h4>
                      There is no data between {firstDateState.split(" ")[0]}{" "}
                      and {lastDateState.split(" ")[0]}
                    </h4>
                  ) : (
                    <div style={{ width: 450, height: 300 }}>
                      <p style={{ marginBottom: 20 }}>
                        <b>Doughnut chart showing work logs completed</b>
                      </p>
                      <Doughnut
                        data={{
                          labels: [
                            "work logs uncompleted",
                            "work logs completed",
                          ],
                          datasets: [
                            {
                              label: "Poll",
                              data: [
                                data?.tasks_uncompleted,
                                data?.tasks_completed,
                              ],
                              backgroundColor: ["#D3D3D3", "#005734"],
                              borderColor: ["#D3D3D3", "#005734"],
                            },
                          ],
                        }}
                      // asdsadsad
                      ></Doughnut>
                    </div>
                  )}
                </div>
                <div>
                  {!(data?.tasks_completed_on_time || data?.tasks) ? (
                    <h4>
                      there is no data between {firstDateState.split(" ")[0]}{" "}
                      and {lastDateState.split(" ")[0]}
                    </h4>
                  ) : (
                    <div style={{ width: 400, height: 300 }}>
                      <p style={{ marginBottom: 20 }}>
                        <b>
                          Doughnut chart showing work logs completed on time
                        </b>
                      </p>
                      <Doughnut
                        data={{
                          labels: ["work logs completed on time"],
                          datasets: [
                            {
                              label: "Poll",
                              data: [data?.tasks_completed_on_time],
                              backgroundColor: ["#005734"],
                              borderColor: ["#005734"],
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
              {/* <p>
              project with most tasks: {data.project_with_most_tasks?.title}
            </p>
            <p>
              project with least tasks: {data.project_with_least_tasks?.title}
            </p> */}
              {!data?.project_with_most_tasks?.title ||
                !data?.project_with_most_tasks?.title ? (
                <>
                  <h4>
                    there is no data between {firstDateState.split(" ")[0]} and{" "}
                    {lastDateState.split(" ")[0]}
                  </h4>
                </>
              ) : (
                <>
                  <p
                    style={{
                      marginBottom: 20,
                      marginTop: 40,
                      textAlign: "center",
                    }}
                  >
                    <b>
                      Doughnut chart showing the project with the most work logs
                      added and project with the least work logs added
                    </b>
                  </p>
                  <div
                    style={{
                      width: 450,
                      height: 300,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Doughnut
                      data={{
                        labels: [
                          data?.project_with_most_tasks?.title,
                          data?.project_with_least_tasks?.title,
                        ],
                        datasets: [
                          {
                            data: [
                              data?.project_with_most_tasks?.tasks_added,
                              data?.project_with_least_tasks?.tasks_added,
                            ],
                            backgroundColor: ["#005734", "#d3d3d3"],
                            borderColor: ["#005734", "#d3d3d3"],
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                </>
              )}
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
        {reportCaptureModal && (
          <ReportCapture
            closeModal={() => closeReportCaptureModal()}
            htmlToCanvaFunction={exportPDF}
            handleExcelItemDownload={handleDownloadExcelData}
            htmlToPdfFunction={() => handleDownloadPDFData(graphDivRef)}
            pdfBtnIsDisabled={PDFbtnDisabled}
          />
        )}
      </>
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
          onClick={loading ? () => { } : () => closeModal()}
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
function formatDateString(inputDate) {
  // Parse the input date string
  const dateParts = inputDate.split(" ")[0].split("/");
  const timePart = inputDate.split(" ")[1];

  // Create a Date object
  const date = new Date(
    parseInt(dateParts[2]), // Year
    parseInt(dateParts[1]) - 1, // Month (0-based, so subtract 1)
    parseInt(dateParts[0]) // Day
  );

  // Format the date as 'YYYY-MM-DD'
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return formattedDate;
}

// Test the function
const inputDate = "09/07/2023 22:35:15";
const formattedDate = formatDateString(inputDate);
console.log(formattedDate); // Output: '2023-07-09'
