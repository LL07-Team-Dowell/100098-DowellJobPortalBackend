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
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import DatePicker from "react-datepicker";
import getDay from "date-fns/getDay";
import { getAllEvents, getProjectWiseAttendance, getUserWiseAttendance } from "../../../../services/hrServices";
import { formatDateForAPI } from "../../../../helpers/helpers";
import { Tooltip } from "react-tooltip";
import { addDays } from "date-fns";

const AttendanceReport = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();
    const [selectedUser, setSelectedUser] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [showAttendaceReport, setShowAttendaceReport] = useState(true);
    const [candidateOptions, setCandidateOptions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedMultiProjects, setSelectedMultiProjects] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [userForAttendance, setUserForAttendance] = useState("");
    const [activeScreen, setActiveScreen] = useState(0);
    const [eventNames, setEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [allHiredCandidates, setAllHiredCandidates] = useState([]);
    const screens = ['Project Wise', 'User Wise', 'Event Wise'];
    const SCREEN_PROJECT_USER = 0;
    const SCREEN_PROJECT_USER_EVENT = 1;
    const SCREEN_EVENT = 2;
    const [datesForToolTip, setDatesForToolTip] = useState([]);
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [percentage, setPercentage] = useState('');
    const [userWiseResponse, setUserWiseResponse] = useState({});
    const [projectWiseresponse, setProjectWiseResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState({
        isProjectLoading: false,
        isUserLoading: false,
        isEventLoading: false,
    })
    const [views, setViews] = useState({
        projectWiseView: false,
        multiProjectView: true,
        userWiseView: true,
        eventWiseView: true,
    })
    const isWeekend = (dayIndex) => dayIndex === 5 || dayIndex === 6;
    // const companyId = "6385c0f18eca0fb652c94561";

    //dummy data
    // const attendanceDetail = [
    //     [true, false, true, true, false, false, false],
    // ];

    useEffect(() => {
        setSelectedUser([]);
        setDataLoading({ ...dataLoading, isUserLoading: true });
        setShowAttendaceReport(false);
        // currentUser?.portfolio_info[0].org_id
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
            const onboardingCandidates = res?.data?.response?.data;
            const hiredCandidates = onboardingCandidates.filter(candidate => candidate.status === 'hired');
            setAllHiredCandidates(hiredCandidates);
            const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
                candidate.project && candidate.project.includes(selectedProject?.value)
            );

            const options = candidatesInSelectedProject.map(candidate => ({
                // username: candidate.username,
                value: candidate.username,
                label: candidate.applicant,
            }));
            setCandidateOptions(options);
            setUserForAttendance(options[0].label);
            setDataLoading({ ...dataLoading, isUserLoading: false });
        }).catch(err => {
            setUserForAttendance("");
            console.log('onboarded failed to load', err);
        })
    }, [selectedProject]);

    const handleChange = (selectedOptions) => {
        setSelectedUser(selectedOptions);
        selectedOptions.length > 0 ? setUserForAttendance(selectedOptions[0].label) : setShowAttendaceReport(false);
    };

    useEffect(() => {
        const filteredUsers = allHiredCandidates.filter(user => {
            if (user.project && Array.isArray(user.project)) {
                return user.project.some(
                    project => selectedMultiProjects.some(
                        selectedProject => selectedProject.label === project
                    ));
            }
            return false;
        });
        const selectedUsers = filteredUsers.map(user => ({
            label: user.applicant,
            value: user.username,
        }));

        setCandidateOptions(selectedUsers);
        setDataLoading({ ...dataLoading, isUserLoading: false });
    }, [selectedMultiProjects])

    const prepareProjectWiseData = () => {
        const projectsForAPI = selectedMultiProjects.map((project) => project.label);
        const usersForAPI = selectedUser.map((user) => user.value);

        return {
            usernames: usersForAPI,
            start_date: selectedStartDate,
            end_date: endDate,
            company_id: currentUser?.portfolio_info[0]?.org_id,
            meeting: selectedEvent.label,
            limit: '0',
            offset: '0',
            project: projectsForAPI,
        };
    };

    const prepareUserWiseData = () => {
        const usersForAPI = selectedUser.map((user) => user.value);

        return {
            usernames: usersForAPI,
            start_date: selectedStartDate,
            end_date: endDate,
            company_id: currentUser?.portfolio_info[0]?.org_id,
            limit: '0',
            offset: '0',
            project: selectedProject.label,
        };
    };

    const handleGetAttendanceClick = async () => {
        setIsLoading(true);
        setShowAttendaceReport(false);
        setPercentage('');
        setAttendanceDetails([]);
        if (views.multiProjectView) {
            if (selectedUser.length === 0 && startDate === null && selectedMultiProjects.length === 0 && selectedEvent === '') {
                return toast.error("Please select Project(s), User(s), Event and a Start Date.");
            } else {
                const dataToPost = prepareProjectWiseData();
                await getProjectWiseAttendance(dataToPost).then(res => {
                    toast.success('Attendance Retrieved Successfully!');
                    console.log('projectwise>>>>>>>>>>>>>>', res.data.data);
                    setProjectWiseResponse(res.data.data)
                    setShowAttendaceReport(true);
                    setIsLoading(false);
                }).catch(() => {
                    setIsLoading(false);
                    toast.error('Unable to Retrieve Attendance!');
                })
                if (projectWiseresponse) {
                    renderingAttendance(selectedUser[0].label);
                }
            }
        } else if (views.userWiseView) {
            if (selectedUser.length === 0 && startDate === null && selectedMultiProjects.length === 0 && selectedEvent === '') {
                return toast.error("Please select Project, User(s) , Event and a Start Date.");
            } else {
                const dataToPost = prepareUserWiseData();
                await getUserWiseAttendance(dataToPost).then(res => {
                    toast.success('Attendance Retrieved Successfully!');
                    setShowAttendaceReport(true);
                    setUserWiseResponse(res?.data?.data);
                    console.log('user wise', res?.data?.data);
                    setIsLoading(false);
                }).catch(() => {
                    setIsLoading(false);
                    toast.error('Unable to Retrieve Attendance!');
                })
                if (userWiseResponse) {
                    renderingAttendance(selectedUser[0].label);
                }
            }
        } else if (views.eventWiseView) {
            if (selectedEvent === '' && startDate === null) {
                return toast.error("Please select an Event and a Start Date.");
            }
            else {
                toast.error('Under Construction!');
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (startDate) {
            const selectedDates = [];
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 5);
            setEndDate(newEndDate.toISOString().split('T')[0]);
            setSelectedStartDate(formatDateForAPI(startDate));

            let currentDate = new Date(startDate);
            while (currentDate <= newEndDate) {
                selectedDates.push(new Date(currentDate));
                currentDate = addDays(currentDate, 1);
            }

            setDatesForToolTip(selectedDates);
        }
    }, [startDate]);

    useEffect(() => {
        setDataLoading({ ...dataLoading, isProjectLoading: true })
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
                    const options = projectList.map((projectName) => ({
                        label: projectName,
                        value: projectName,
                    }));
                    setProjects(options);
                    setDataLoading({ ...dataLoading, isProjectLoading: false })
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectChange = async (event) => {
        setSelectedProject(event);
        console.log(">>>>>>>>>>all hired candidates", allHiredCandidates);
    };

    const renderingAttendance = (candidate, username) => {
        setUserForAttendance(candidate);
        console.log('candidate>>>>>>>>>>>>>', candidate);

        if (views.multiProjectView) {
            const projectData = projectWiseresponse['Business development'];

            if (Array.isArray(projectData)) {
                const userData = projectData.filter(data =>
                    (data.user_present.includes(candidate) || data.user_absent.includes(candidate)) && data.meeting === selectedEvent.label
                );

                const userAttendance = Array(userData.length + 2).fill(false);

                userData.forEach((data, index) => {
                    if (data.user_present.includes(candidate)) {
                        userAttendance[index] = true;
                    }
                });

                const numberOfDaysPresent = userAttendance.filter(value => value === true).length;

                setPercentage(numberOfDaysPresent);
                setAttendanceDetails([userAttendance]);
            }
        } else if (views.userWiseView) {
            const userAttendance = userWiseResponse[username];
            if (userAttendance && userAttendance.length > 0) {
                const allDates = [...userAttendance[0].dates_present, ...userAttendance[0].dates_absent];
                const sortedDates = allDates.sort();
                console.log('date', userAttendance[0].dates_present);
                const updatedAttendanceDetails = sortedDates.map(date => {
                    return userAttendance[0].dates_present.includes(date);
                });
                updatedAttendanceDetails.push(false, false);
                const numberOfDaysPresent = updatedAttendanceDetails.filter(value => value === true).length;
                setPercentage(numberOfDaysPresent);
                setAttendanceDetails([updatedAttendanceDetails]);
            }
        }
    }

    const dataForFetchingEvents = {
        company_id: currentUser?.portfolio_info[0].org_id,
    }

    useEffect(() => {
        setDataLoading({ ...dataLoading, isEventLoading: true });
        const fetchEvents = async () => {
            try {
                const data = (await getAllEvents(dataForFetchingEvents)).data.data;
                const eventNamesList = data.map(event => ({
                    id: event._id,
                    value: event.event_name,
                    label: event.event_name,
                }));
                setEventNames(eventNamesList);
                setDataLoading({ ...dataLoading, isEventLoading: false });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const isMonday = (date) => {
        const day = getDay(date);
        return day === 1;
    };

    const handleOptionClick = (index) => {
        setActiveScreen(index);
        setSelectedUser([]);
        setSelectedProject('');
        setSelectedMultiProjects([]);
        setSelectedEvent('');
        setCandidateOptions([]);
        setShowAttendaceReport(false);
        setPercentage('');
        setSelectedStartDate('');
        setStartDate(null);
        setAttendanceDetails([]);
        setEndDate('');
        switch (index) {
            case SCREEN_PROJECT_USER:
                setViews({ projectWiseView: false, multiProjectView: true, userWiseView: true, eventWiseView: true })
                break;
            case SCREEN_PROJECT_USER_EVENT:
                setViews({ projectWiseView: true, multiProjectView: false, userWiseView: true, eventWiseView: false })
                break;
            case SCREEN_EVENT:
                setViews({ projectWiseView: false, multiProjectView: false, userWiseView: false, eventWiseView: true })
                break;
            default:
                console.log(`${index} is not defined`)
                break;
        }
    };

    const formatTooltip = (dayIndex) => {
        if (startDate) {
            const selectedDate = new Date(startDate);
            selectedDate.setDate(selectedDate.getDate() + dayIndex);
            return selectedDate.toDateString();
        }
        return '';
    };

    const renderingEventAttendance = (index) => {
        const filteredUser = selectedUser?.filter((user) => user.label === userForAttendance);

        if (filteredUser.length !== 0) {
            const username = filteredUser[0].value;
            const userAttendance = userWiseResponse[username][index];

            if (userAttendance) {
                const allDates = [
                    ...(Array.isArray(userAttendance.dates_present) ? userAttendance.dates_present : []),
                    ...(Array.isArray(userAttendance.dates_absent) ? userAttendance.dates_absent : []),
                ];
                console.log(allDates);
                const sortedDates = allDates.sort();

                const updatedAttendanceDetails = sortedDates.map(date => {
                    return userAttendance.dates_present.includes(date);
                });
                updatedAttendanceDetails.push(false, false);
                const numberOfDaysPresent = updatedAttendanceDetails.filter(value => value === true).length;

                setPercentage(numberOfDaysPresent);
                setAttendanceDetails([updatedAttendanceDetails]);
            }
        }
    }

    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
        >
            <div className="att_title"><div className="back_icon" onClick={() => navigate(-1)}><IoChevronBack /></div><h3>Attendance</h3></div>
            <div className="switch_screen">
                {screens.map((option, index) => (
                    <p
                        key={index}
                        className={`switch_option ${activeScreen === index ? 'active' : ''}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </p>
                ))}
            </div>
            <section className="att_report_main">
                <div className="check">
                    {
                        views.projectWiseView &&
                        <div className="item__Filter__Wrap">
                            <p>Select Project:</p>
                            <Select
                                options={projects}
                                isMulti={false}
                                isLoading={dataLoading.isProjectLoading}
                                value={selectedProject}
                                onChange={handleProjectChange}
                                className="item__Filter"
                            />
                        </div>
                    }
                    {
                        views.multiProjectView &&
                        <div className="item__Filter__Wrap">
                            <p>Select Project:</p>
                            <Select
                                options={projects}
                                isMulti={true}
                                isLoading={dataLoading.isProjectLoading}
                                value={selectedMultiProjects}
                                onChange={(projectName) => (
                                    setSelectedMultiProjects(projectName)
                                    // handleMultiProjectChange()
                                )}
                                className="item__Filter"
                            />
                        </div>
                    }
                    {
                        views.userWiseView &&
                        <div className="item__Filter__Wrap">
                            <p>Select User:</p>
                            <Select
                                options={candidateOptions}
                                isMulti={true}
                                isLoading={dataLoading.isUserLoading}
                                value={selectedUser}
                                onChange={handleChange}
                                className="item__Filter"
                            />
                        </div>
                    }
                    {
                        views.eventWiseView &&
                        <div className="item__Filter__Wrap">
                            <p>Select Event:</p>
                            <Select
                                isLoading={dataLoading.isEventLoading}
                                options={eventNames}
                                isMulti={false}
                                value={selectedEvent}
                                onChange={(selectedOption) => {
                                    setSelectedEvent(selectedOption);
                                }}
                                className="item__Filter"
                            />
                        </div>}
                    <div className="item__Filter__Wrap">
                        <p>Start Date</p>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            filterDate={isMonday}
                            placeholderText="dd/mm/yyyy"
                            className="att__Date__Input"
                            dateFormat="dd/MM/yyyy"
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
                    <button onClick={handleGetAttendanceClick} className="hr__Att__Btn">
                        {isLoading ? <LoadingSpinner width={23} height={23} /> :
                            `Get Attendance`}</button>

                </div>

                {
                    showAttendaceReport &&
                    <>
                        <div className="users_info">
                            <p>Candidates:</p>
                            {
                                selectedUser.map((candidate) => (
                                    <button key={candidate.value} onClick={() => renderingAttendance(candidate.label, candidate.value)}>
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
                                    <p>Project: <b>{selectedProject?.value}</b></p>
                                </div>
                                <div className="att_percentage">
                                    <CircularProgressbar
                                        value={(Number(percentage) / 5) * 100}
                                        styles={
                                            buildStyles({
                                                pathColor: `#18d462`,
                                                trailColor: '#f5f5f5',
                                            })
                                        }
                                    />
                                    <div>
                                        <p>Present</p>
                                        <b>{`${(Number(percentage) / 5) * 100}%`}</b>
                                    </div>
                                </div>
                                <div className="att_percentage">
                                    <CircularProgressbar
                                        value={100 - ((Number(percentage) / 5) * 100)}
                                        styles={
                                            buildStyles({
                                                pathColor: `#f02a2b`,
                                                trailColor: '#f5f5f5',
                                            })
                                        }
                                    />
                                    <div>
                                        <p>Absent</p>
                                        <b>{`${100 - ((Number(percentage) / 5) * 100)}%`}</b>
                                    </div>
                                </div>
                            </div>
                            {
                                views.userWiseView && views.projectWiseView &&
                                <div className="users_info">
                                    {/* <div className="item__Filter__Wrap">
                                        <p>Events</p>
                                        <Select
                                            options={eventNames}
                                            onChange={}
                                        />
                                    </div> */}
                                    <p>Events:</p>

                                    {
                                        eventNames.map((event, index) => (
                                            <button key={event.value} onClick={() => renderingEventAttendance(index)}>
                                                {event.label}
                                            </button>

                                        ))
                                    }
                                </div>
                            }
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
                                        <Tooltip
                                            id="my-tooltip"
                                        />
                                        {attendanceDetails.map((weekData, weekIndex) => (
                                            <tr key={weekIndex}>
                                                {weekData.map((isPresent, dayIndex) => (
                                                    <td key={dayIndex} Tooltip={formatTooltip(dayIndex)}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={isWeekend(dayIndex) ? `Holiday` : `${new Date(datesForToolTip[dayIndex]).toDateString()}`}
                                                        data-tooltip-place="top">
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