import React, { useEffect, useState } from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import './style.css';
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Bar } from 'react-chartjs-2';
import { getSettingUserProject } from "../../../../../services/hrServices";
import { getSettingUserSubProject } from "../../../../../services/adminServices";

const AgendaReport = () => {
    //dummy data
    const hoursChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Hours Report',
                data: [30, 40, 50, 15, 18, 20, 35],
                backgroundColor: [
                    '#fe6a6a',
                    '#fe6a6a',
                    '#fe6a6a',
                    '#fe6a6a',
                    '#fe6a6a',
                    '#fe6a6a',
                    '#fe6a6a',
                ],
                maxBarThickness: 30,
                borderRadius: 30,
            },
        ],
    };

    const subTaskChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'SubProject Report',
                data: [15, 18, 20, 60, 30, 40, 50],
                backgroundColor: [
                    '#52beff',
                    '#52beff',
                    '#52beff',
                    '#52beff',
                    '#52beff',
                    '#52beff',
                    '#52beff',
                ],
                maxBarThickness: 30,
                borderRadius: 30,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // const data02 = [
    //     { name: 'completed', value: 80 },
    //     { name: 'incompleted', value: 20 },
    // ];

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [subProjects, setSubProjects] = useState([]);
    const [selectedSubProject, setSelectedSubProject] = useState("");
    const [resultVisibility, setResultVisibility] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [agendaTitle, setAgendaTitle] = useState("");
    const [agendaDescription, setAgendaDescription] = useState("");
    const [leadName, setLeadName] = useState("");
    const [tableData, setTableData] = useState([]);
    const [totalHours, setTotalHours] = useState("");
    const [totalSubTasks, setTotalSubTasks] = useState("");
    const [evaluatorResponse, setEvaluatorResponse] = useState([]);
    const [noResultFound, setNoResultFound] = useState(false);

    const companyId = "6385c0f18eca0fb652c94561";

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(
                    "https://100098.pythonanywhere.com/settinguserproject/",
                );
                const data = response.data;
                const companyProjects = data.filter(
                    (project) => project.company_id === companyId,
                );

                if (companyProjects.length > 0) {
                    const projectList = companyProjects[0].project_list || [];
                    setProjects(projectList);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const fetchSubProjects = async (selectedProjectId) => {
        try {
            const response = await axios.get(
                "https://100098.pythonanywhere.com/settingusersubproject/",
            );

            if (response.data && Array.isArray(response.data.data)) {
                const data = response.data.data;

                const selectedProjectData = data.find(
                    (projectData) => projectData.parent_project === selectedProjectId,
                );

                if (selectedProjectData) {
                    setSubProjects(selectedProjectData.sub_project_list || []);
                } else {
                    setSubProjects([]);
                }
            } else {
                console.error("No 'data' array found in the response");
            }
        } catch (error) {
            console.error("Error fetching sub-projects:", error);
        }
    };

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        setSelectedSubProject("");
        if (projectId) {
            await fetchSubProjects(projectId);
        } else {
            setSubProjects([]);
        }
    };

    const handleSubProjectChange = async (event) => {
        const subProjectId = event.target.value;
        setSelectedSubProject(subProjectId);
    };

    function capitalizeFirstLetter(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    useEffect(() => {
        if (startDate) {
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 7);
            setEndDate(newEndDate.toISOString().split('T')[0]);
        }
    }, [startDate]);

    const handleResultVisibilty = async () => {
        if (!selectedProject) {
            return toast.info("Please select a project");
        } else if (!selectedSubProject) {
            return toast.info("Please select a subproject");
        } else if (!startDate || !endDate) {
            return toast.info("Please select both start and end dates");
        } else {
            const diffInDays = Math.floor((new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000));
            if (diffInDays !== 7) {
                return toast.info("The difference between start and end dates should be exactly 7 days");
            }
        }
        const processedSubProject = selectedSubProject.replace(/ /g, "-");

        // axios.post(`https://100098.pythonanywhere.com/weekly_agenda/?type=all_weekly_agendas&limit=1&offset=1&sub_project=${processedSubProject}&project=${selectedProject}`)
        //     .then(response => {
        //         console.log("testinggggggggggggg", response.data);

        //         const timelineData = response.data.response[0].timeline;
        //         const processedLeadName = capitalizeFirstLetter(response.data.response[0].lead_name);
        //         const totalSubtasksCount = timelineData.length;

        //         setAgendaTitle(response.data.response[0].agenda_title);
        //         setAgendaDescription(response.data.response[0].aggregate_agenda);
        //         setLeadName(processedLeadName);
        //         setTotalHours(response.data.response[0].total_time);

        //         const formattedTableData = timelineData.map(entry => {
        //             const entryStartDate = new Date(entry.timeline_start);
        //             const entryEndDate = new Date(entry.timeline_end);
        //             const formattedStartDate = entryStartDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        //             const formattedEndDate = entryEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        //             const formattedDateRange = `${formattedStartDate}-${formattedEndDate}`;

        //             return {
        //                 name: entry.subtask,
        //                 status: 'Completed',
        //                 dueDate: formattedDateRange,
        //                 hours: entry.hours,
        //                 assignee: entry.assignees.join(', '),
        //             };
        //         });

        //         setEvaluatorResponse(response.data.response[0].evaluator_response);
        //         setTableData(formattedTableData);
        //         setTotalSubTasks(totalSubtasksCount);
        //         if (response.data.response.length > 0) {
        //             setResultVisibility(true);
        //         } else {
        //             setNoResultFound(true);
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Errorrrrrrrrrrr:', error);
        //     });

        axios.post(`https://100098.pythonanywhere.com/weekly_agenda/?type=all_weekly_agendas&limit=1&offset=1&sub_project=${processedSubProject}&project=${selectedProject}`)
            .then(response => {
                console.log("testinggggggggggggg", response.data);

                if (Array.isArray(response.data.response) && response.data.response.length > 0) {
                    const timelineData = response.data.response[0].timeline;
                    const processedLeadName = capitalizeFirstLetter(response.data.response[0].lead_name);
                    const totalSubtasksCount = timelineData.length;

                    setAgendaTitle(response.data.response[0].agenda_title);
                    setAgendaDescription(response.data.response[0].aggregate_agenda);
                    setLeadName(processedLeadName);
                    setTotalHours(response.data.response[0].total_time);

                    const formattedTableData = timelineData.map(entry => {
                        const entryStartDate = new Date(entry.timeline_start);
                        const entryEndDate = new Date(entry.timeline_end);
                        const formattedStartDate = entryStartDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                        const formattedEndDate = entryEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                        const formattedDateRange = `${formattedStartDate}-${formattedEndDate}`;

                        return {
                            name: entry.subtask,
                            status: 'Completed',
                            dueDate: formattedDateRange,
                            hours: entry.hours,
                            assignee: entry.assignees.join(', '),
                        };
                    });

                    setEvaluatorResponse(response.data.response[0].evaluator_response);
                    setTableData(formattedTableData);
                    setTotalSubTasks(totalSubtasksCount);
                    setResultVisibility(true);
                    setNoResultFound(false);
                } else {
                    setResultVisibility(false);
                    setNoResultFound(true);
                }
            })
            .catch(error => {
                console.error('Errorrrrrrrrrrr:', error);
            });
    }

    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Reports"}
        >
            <div className="parent_div">
                <div className="main_div">
                    <div className="wrapper">
                        <h2>Weekly Agenda Detailed Report</h2>
                        <div className="internal_div">
                            <div>
                                <label>
                                    <span>Project</span>
                                    <select
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                    >
                                        <option value="">Select a Project</option>
                                        {
                                            projects.map((project, index) => (
                                                <option key={index} value={project}>
                                                    {project}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Sub Project</span>
                                    <select
                                        value={selectedSubProject}
                                        onChange={handleSubProjectChange}
                                    >
                                        <option value="">Select a Sub Project</option>
                                        {subProjects.map((subProject, index) => (
                                            <option key={index} value={subProject}>
                                                {subProject}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label>
                                    <span>Start Date</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    <span>End Date</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        readOnly
                                    />
                                </label>
                            </div>

                            <button onClick={handleResultVisibilty}>Show Results</button>
                        </div>
                    </div>
                    {
                        resultVisibility &&
                        <>
                            <div className="graph_main_div">
                                <div>
                                    <h3>Total Subtasks</h3>
                                    <h2>{totalSubTasks}</h2>
                                    <div>
                                        <Bar data={subTaskChartData} options={chartOptions} />
                                        {/* <ResponsiveContainer width="90%" height="90%">
                                        <BarChart width={150} height={40} data={data}>
                                            <XAxis dataKey="name" />
                                            <Bar dataKey="uv" fill="#52beff" />
                                        </BarChart>
                                    </ResponsiveContainer> */}
                                    </div>
                                </div>
                                <div>
                                    <h3>Total Hours</h3>
                                    <h2 style={{ color: '#fe6a6a' }}>{totalHours}</h2>
                                    <div>
                                        <Bar data={hoursChartData} options={chartOptions} />
                                        {/* <ResponsiveContainer width="90%" height="90%">
                                        <BarChart width={150} height={40} data={data}>
                                            <XAxis dataKey="name" />
                                            <Bar dataKey="uv" fill="#fe6a8a" />
                                        </BarChart>
                                    </ResponsiveContainer> */}
                                    </div>
                                </div>
                                <div className="lead_assignee">
                                    <h3>Team Members</h3>
                                    <p>Lead</p>
                                    <div>
                                        <div className="profile"><p>{leadName[0]?.toUpperCase()}</p></div>
                                        <div className="lead_name">
                                            <h4>{leadName}</h4>
                                            <p>{selectedProject}</p>
                                        </div>
                                    </div>
                                    <p>Assignees</p>
                                    <div>
                                        <div className="profile"><p>{tableData[0]?.assignee[0]?.toUpperCase()}</p></div>
                                        <div className="lead_name">
                                            <h4>{tableData.map(item => item.assignee).join(', ')}</h4>
                                            <p>Task Management and rehire</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="progress_main_div">
                                <div className="report">
                                    <div className="report_agenda">
                                        <h2>{agendaTitle}</h2>
                                        <p>{agendaDescription}</p>
                                    </div>
                                    <div className="report_agenda_list">
                                        <h3>Timeline of weekly agenda</h3>
                                        <div className="weekly_agenda_list_table_div ">
                                            <table className="weekly_agenda_list_table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>Due Date</th>
                                                        <th>Hours</th>
                                                        <th>Assignee</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="name-column">{item.name}</td>
                                                            <td className={item.status.toLowerCase()}>{item.status}</td>
                                                            <td>{item.dueDate}</td>
                                                            <td>{item.hours}</td>
                                                            <td><div className="table_profile"><p>{item.assignee[0].toUpperCase()}</p></div></td>
                                                            {/* <td>{item.assignee}</td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="overall_progress">
                                    <p>Overall Progress</p>
                                    <div>
                                        <CircularProgressbar
                                            value={80}
                                            text={'80%'}
                                            styles={
                                                buildStyles({
                                                    pathColor: `#18d462`,
                                                    textColor: '#3e3e3e',
                                                    trailColor: '#fe6a6a',
                                                    backgroundColor: '#005734',
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="label_div">
                                        <ul>
                                            <li>
                                                <FaCircle className="bullet-icon completed" />
                                                Completed - 140/160
                                            </li>
                                            <li>
                                                <FaCircle className="bullet-icon incompleted" />
                                                Incompleted - 20/160
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="evaluator">
                                <h3>Evaluator Response</h3>
                                <div>
                                    <div className="circular_progress_bar">
                                        <div>
                                            <CircularProgressbar
                                                value={parseFloat(evaluatorResponse["Confidence level created by AI"])}
                                                text={evaluatorResponse["Confidence level created by Human"]}
                                                styles={
                                                    buildStyles({
                                                        pathColor: `#fe6a6a`,
                                                        textColor: '#3e3e3e',
                                                        trailColor: '#18d462',
                                                        backgroundColor: '#005734',
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="response">
                                            <p>Confidence level created by AI: <b className="evaluator_reponse_color_p">{evaluatorResponse["Confidence level created by AI"]}</b></p>
                                            <p>Confidence level created by Human: <b className="evaluator_reponse_color_g">{evaluatorResponse["Confidence level created by Human"]}</b></p>
                                        </div>
                                    </div>
                                    <div className="circular_progress_bar">
                                        <div>
                                            <CircularProgressbar
                                                value={parseFloat(evaluatorResponse["Creative"])}
                                                text={evaluatorResponse["Creative"]}
                                                styles={
                                                    buildStyles({
                                                        pathColor: `#18d462`,
                                                        textColor: '#3e3e3e',
                                                        trailColor: '#fe6a6a',
                                                        backgroundColor: '#005734',
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="response">
                                            <p>Plagarized: <b className="evaluator_reponse_color_p">{evaluatorResponse["Plagiarised"]}</b></p>
                                            <p>Creative: <b className="evaluator_reponse_color_g">{evaluatorResponse["Creative"]}</b></p>
                                        </div>
                                    </div>
                                    <div className="circular_progress_bar">
                                        <div className="character_count">
                                            <p>Total Characters - <b>{evaluatorResponse["Total characters"]}</b></p>
                                            <p>Total Sentences - <b>{evaluatorResponse["Total sentences"]}</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {
                        noResultFound && <>
                            <div className="no_data_found"><p>No data Found for given Project and Sub Project!</p></div>
                        </>
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}

export default AgendaReport;