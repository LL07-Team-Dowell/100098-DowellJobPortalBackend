import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import './style.css';
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getAllOnBoardedCandidate } from "../../../../services/candidateServices";
import { getSettingUserProject } from "../../../../services/hrServices";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Avatar from "react-avatar";

const AttendanceReport = () => {
    const [selectedUser, setSelectedUser] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showAttendaceReport, setShowAttendaceReport] = useState(false);
    const { currentUser } = useCurrentUserContext();
    const [candidateOptions, setCandidateOptions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    // const [usersVisibility, setUsersVisibility] = useState(false);
    const [userForAttendance, setUserForAttendance] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const companyId = "6385c0f18eca0fb652c94561";

    const isWeekend = (dayIndex) => dayIndex === 5 || dayIndex === 6;

    //dummy data
    const attendanceDetails = [
        [true, false, true, true, false, false, false],
    ];

    useEffect(() => {
        setSelectedUser([]);
        setShowAttendaceReport(false);
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
            const onboardingCandidates = res?.data?.response?.data;
            const hiredCandidates = onboardingCandidates.filter(candidate => candidate.status === 'hired');

            const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
                candidate.project && candidate.project.includes(selectedProject)
            );

            const options = candidatesInSelectedProject.map(candidate => ({
                value: candidate._id,
                label: candidate.applicant,
            }));
            console.log(">>>>>>>>>>>>>>>>", options.length);
            setCandidateOptions(options);
            setUserForAttendance(options[0].label);
        }).catch(err => {
            setUserForAttendance("");
            console.log('onboarded failed to load');
        })
    }, [selectedProject]);

    const handleChange = (selectedOptions) => {
        setSelectedUser(selectedOptions);
        // console.log(">>>>>>>>>>>>>>>>>>>",selectedOptions.length);
        selectedOptions.length > 0 ? setUserForAttendance(selectedOptions[0].label) : setShowAttendaceReport(false);
    };

    const handleGetAttendanceClick = () => {
        if (selectedUser.length === 0 && startDate === "" && selectedProject === "") {
            return toast.error("Please select Project, User(s) and a Start Date.");
        } else if (selectedProject === "") {
            return toast.error("Please select a project.");
        } else if (selectedUser.length === 0) {
            return toast.error("Please select user(s).");
        } else if (startDate === "") {
            return toast.error("Please select a start date.");
        } else {
            // setUsersVisibility(true);
            setShowAttendaceReport(true);
        }
    }

    useEffect(() => {
        if (startDate) {
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 7);
            setEndDate(newEndDate.toISOString().split('T')[0]);
        }
    }, [startDate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = (await getSettingUserProject()).data;
                const companyProjects = data.filter(
                    (project) =>
                        project.company_id === currentUser?.portfolio_info[0]?.org_id &&
                        project.data_type === currentUser?.portfolio_info[0]?.data_type
                ).reverse();
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

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
    };

    const renderingAttendance = (candidate) => {
        setUserForAttendance(candidate);
    }

    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
        >
            <section className="att_report_main">
                <h3>Attendance</h3>
                <div className="check">
                    <div className="item__Filter__Wrap">
                        <p>Select Project:</p>
                        <select
                            value={selectedProject}
                            onChange={handleProjectChange}
                            className="att_select_input"
                        >
                            <option value="">Select a Project</option>
                            {
                                projects.map((project, index) => (
                                    <option key={index} value={project}>
                                        {project}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="item__Filter__Wrap">
                        <p>Select User:</p>
                        <Select
                            options={candidateOptions}
                            isMulti={true}
                            value={selectedUser}
                            onChange={handleChange}
                            className="item__Filter"
                        />
                    </div>

                    <div className="item__Filter__Wrap">
                        <p>Start Date</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="att__Date__Input"
                        />
                    </div>

                    <div className="item__Filter__Wrap">
                        <p>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            readOnly
                            className="att__Date__Input"
                        />
                    </div>
                    <button onClick={handleGetAttendanceClick} className="hr__Att__Btn">Get Attendance</button>

                </div>

                {
                    showAttendaceReport &&
                    <>
                        <div className="users_info">
                            <p>Candidates:</p>
                            {
                                // usersVisibility &&
                                selectedUser.map((candidate) => (
                                    <button key={candidate.value} className="candidateButton" onClick={() => renderingAttendance(candidate.label)}>
                                        {candidate.label}
                                    </button>

                                ))
                            }
                        </div>
                        <div className="att_rep">
                            <div className="att_name txt_color">
                                <div className="profile">
                                    <Avatar
                                        name={userForAttendance[0]}
                                        round={true}
                                        size='8rem'
                                        color="#807f7f"
                                    />
                                </div>
                                <div className="candidate_info">
                                    <h4>{userForAttendance}</h4>
                                    <p>Freelancer</p>
                                    <p>Project: <b>{selectedProject}</b></p>
                                </div>
                                <div className="att_percentage">
                                    <CircularProgressbar
                                        value={82}
                                        styles={
                                            buildStyles({
                                                pathColor: `#18d462`,
                                                trailColor: '#f5f5f5',
                                            })
                                        }
                                    />
                                    <div>
                                        <p>Present</p>
                                        <b>82%</b>
                                    </div>
                                </div>
                                <div className="att_percentage">
                                    <CircularProgressbar
                                        value={18}
                                        styles={
                                            buildStyles({
                                                pathColor: `#f02a2b`,
                                                trailColor: '#f5f5f5',
                                            })
                                        }
                                    />
                                    <div>
                                        <p>Absent</p>
                                        <b>18%</b>
                                    </div>
                                </div>
                            </div>
                            <h2 className="title">Attendance Report</h2>
                            <div className="tbl_rep">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Monday</th>
                                            <th>Tuesday</th>
                                            <th>Wednesday</th>
                                            <th>Thursday</th>
                                            <th>Friday</th>
                                            <th>Saturday</th>
                                            <th>Sunday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceDetails.map((weekData, weekIndex) => (
                                            <tr key={weekIndex}>
                                                {weekData.map((isPresent, dayIndex) => (
                                                    <td key={dayIndex}>
                                                        {isWeekend(dayIndex) ? <><FaCircleCheck className="holiday table_data" />Holiday</> : isPresent ? <><FaCircleCheck className="present table_data" />Present</> : <><MdCancel className="absent table_data" />Absent</>}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            </section>
        </StaffJobLandingLayout>
    );
}

export default AttendanceReport;