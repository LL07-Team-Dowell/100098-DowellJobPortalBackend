import React from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../../UnderConstructionPage/ConstructionPage";
import Calendar from "react-calendar";
import './style.css';
import { getSettingUserProject } from "../../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { useState, useEffect } from "react";
import { formatDateForAPI } from "../../../../../helpers/helpers";
import { getAllOnBoardedCandidate } from "../../../../../services/candidateServices";
import Avatar from "react-avatar";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const AttendanceUpdatePage = () => {
    const { currentUser } = useCurrentUserContext();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [usersInSelectedProject, setUsersInSelectedProject] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceStates, setAttendanceStates] = useState([]);
    // const [isPresent, setIsPresent] = useState(false);
    // const companyId = "6385c0f18eca0fb652c94561";

    const today = new Date();
    const mondayOfThisWeek = today.getDay() === 0 ?
        new Date(new Date(today.setDate(today.getDate() - 6)).setHours(0, 0, 0, 0))
        :
        new Date(new Date(today.setDate(today.getDate() - today.getDay() + 1)).setHours(0, 0, 0, 0));
    const sundayOfNextWeek = new Date(new Date().setDate(mondayOfThisWeek.getDate() + 6));

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

    useEffect(() => {
        setIsLoading(true);
        setUsersInSelectedProject([]);
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
            setUsersInSelectedProject(options);
            setIsLoading(false);
            console.log(">>>>>>>>>>>>>>>>", options.length);
        }).catch(err => {
            console.log('onboarded failed to load');
        })
    }, [selectedProject]);

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
    };

    const handleDateChange = (date) => {
        // console.log(">>>>>>>>>>>>>>>>",formatDateForAPI(date));
        setSelectedDate(formatDateForAPI(date));
    };

    const handleAttendanceChange = (index) => {
        const updatedAttendanceStates = [...attendanceStates];
        updatedAttendanceStates[index] = !updatedAttendanceStates[index];
        setAttendanceStates(updatedAttendanceStates);
    };

    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
            pageTitle={'Attendance'}
        >
            <div className="att_title"><h3>Update Attendance</h3></div>
            <div className="upd_att_wrap">
                <div className="att_upd_calendar">
                    <div className="upd_calendar">
                        <p>Select Date:</p>
                        <Calendar minDate={mondayOfThisWeek} maxDate={sundayOfNextWeek} onChange={handleDateChange} />
                    </div>
                </div>
                <div className="att_upd_candidates">
                    <div className="att_upd_input">
                        <div className="att_upd_select">
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
                        <div className="att_upd_select">
                            <label>
                                <span>Event</span>
                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                >
                                    <option value="">Select an Event</option>
                                    {/* {
                                        projects.map((project, index) => (
                                            <option key={index} value={project}>
                                                {project}
                                            </option>
                                        ))} */}
                                </select>
                            </label>
                        </div>
                    </div>
                    {
                        isLoading ? <><LoadingSpinner /></> :
                            <>

                                {
                                    usersInSelectedProject.length > 0 &&
                                    (
                                        <>
                                            <p>Candidates in selected project:</p>
                                            <div className="user_boxes">
                                                {usersInSelectedProject.map((user, index) => (
                                                    <div key={index} className="user_box">
                                                        <div className="mark_att" onClick={() => handleAttendanceChange(index)}>
                                                            {attendanceStates[index] ? <FaCircleCheck className="present" /> : <MdCancel className="absent" />}
                                                        </div>
                                                        <Avatar
                                                            name={user.label[0]}
                                                            round={true}
                                                            size='6rem'
                                                            color="#005734"
                                                        />
                                                        <h6>{user.label}</h6>
                                                        <b>{selectedProject}</b>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                            </>
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}
export default AttendanceUpdatePage;