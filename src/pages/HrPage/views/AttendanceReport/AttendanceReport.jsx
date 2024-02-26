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
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";

const AttendanceReport = () => {
    const navigate = useNavigate();
    const { currentUser, allCompanyApplications, userRemovalStatusChecked } = useCurrentUserContext();
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
    const screens = ['Project Wise', 'User Wise'];
    const SCREEN_PROJECT_USER = 0;
    const SCREEN_PROJECT_USER_EVENT = 1;
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
    const [selectedProjectForMulti, setSelectedProjectForMulti] = useState(null);
    const [foundUserEventAttendanceDetail, setFoundUserEventAttendanceDetail] = useState(null);
    const [selectedEventForUserWise, setSelectedEventforUserWise] = useState([]);

    const isWeekend = (dayIndex) => dayIndex === 5 || dayIndex === 6;
    // const companyId = "6385c0f18eca0fb652c94561";

    useEffect(() => {
        setSelectedUser([]);
        setDataLoading({ ...dataLoading, isUserLoading: true });
        setShowAttendaceReport(false);

        if (!userRemovalStatusChecked) return;
        const hiredCandidates = allCompanyApplications.filter(candidate => candidate.status === candidateStatuses.ONBOARDING || candidate.status === candidateStatuses.RENEWCONTRACT);
        setAllHiredCandidates(hiredCandidates);
        const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
            candidate.project && candidate.project.includes(selectedProject?.value)
        );

        const options = candidatesInSelectedProject.map(candidate => ({
            value: candidate.username,
            label: candidate.applicant,
        }));
        setCandidateOptions(options);
        setUserForAttendance(options[0]?.label);
        setDataLoading({ ...dataLoading, isUserLoading: false });
    }, [selectedProject, userRemovalStatusChecked]);

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
        setSelectedProjectForMulti(null);
        setFoundUserEventAttendanceDetail(null);

        if (views.multiProjectView) {
            if (selectedUser.length === 0 && startDate === null && selectedMultiProjects.length === 0 && selectedEvent === '') {
                setIsLoading(false);
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
            }
        } else if (views.userWiseView) {
            if (selectedUser.length === 0 && startDate === null && selectedMultiProjects.length === 0 && selectedEvent === '') {
                setIsLoading(false);
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
                setIsLoading(false);
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



    useEffect(() => {
        const dataForFetchingEvents = {
            company_id: currentUser?.portfolio_info[0]?.org_id,
            data_type: currentUser?.portfolio_info[0]?.data_type,
        }

        setDataLoading({ ...dataLoading, isEventLoading: true });
        const fetchEvents = async () => {
            try {
                const data = (await getAllEvents(dataForFetchingEvents)).data.data?.filter(event =>
                    event.data_type === currentUser?.portfolio_info[0]?.data_type
                );
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
        setSelectedProjectForMulti(null);
        setFoundUserEventAttendanceDetail(null);

        switch (index) {
            case SCREEN_PROJECT_USER:
                setViews({ projectWiseView: false, multiProjectView: true, userWiseView: true, eventWiseView: true })
                break;
            case SCREEN_PROJECT_USER_EVENT:
                setViews({ projectWiseView: true, multiProjectView: false, userWiseView: true, eventWiseView: false })
                break;
            // case SCREEN_EVENT:
            //     setViews({ projectWiseView: false, multiProjectView: false, userWiseView: false, eventWiseView: true })
            //     break;
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

    const renderingAttendance = (candidate, username) => {
        setUserForAttendance(candidate);
        if (views.userWiseView) {
            const userAttendance = userWiseResponse[username];
            console.log('user attttt', userAttendance);
            if (userAttendance && userAttendance.length > 0) {
                // setPercentage('');
                setAttendanceDetails(userAttendance);
                const foundEventAttendance = userAttendance?.find(attendance => attendance?.event_id === selectedEvent.id);

                setPercentage(
                    foundEventAttendance?.dates_present ?
                        foundEventAttendance?.dates_present.length
                        :
                        ''
                );
                setFoundUserEventAttendanceDetail(foundEventAttendance);
            }
        }
    }

    const renderingEventAttendance = (eventId) => {
        const foundEvent = eventNames?.find(event => event?.id === eventId);
        if (!foundEvent) return

        setSelectedEvent({
            id: eventId,
            value: foundEvent?.value,
            label: foundEvent?.label,
        });
        setFoundUserEventAttendanceDetail(null);

        const foundEventAttendance = attendanceDetails?.find(attendance => attendance?.event_id === eventId);
        if (!foundEventAttendance) {
            setPercentage('');
            return
        }

        setPercentage(
            foundEventAttendance?.dates_present ?
                foundEventAttendance?.dates_present.length
                :
                ''
        );
        setFoundUserEventAttendanceDetail(foundEventAttendance);
    }

    const handleSelectProjectForMulti = (project) => {
        const attendanceDataForProject = projectWiseresponse[project?.value];
        if (!attendanceDataForProject) return

        setSelectedProjectForMulti(project);

        const attendanceDataForUsersAndEvent = attendanceDataForProject.filter(
            item =>
                item.event_id === selectedEvent?.id &&
                (
                    item.user_present.some(userPresent => selectedUser.map(user => user.value).includes(userPresent)) ||
                    item.user_absent.some(userPresent => selectedUser.map(user => user.value).includes(userPresent))
                )
        )

        const presentCount = attendanceDataForUsersAndEvent?.map(item => {
            if (
                item.user_present.some(userPresent => selectedUser.map(user => user.value).includes(userPresent))
            ) return 1
            return 0;
        })?.reduce((x, y) => x + y, 0);

        setPercentage(presentCount);
        setAttendanceDetails(attendanceDataForUsersAndEvent);
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
                            <p>Select Project(s):</p>
                            <Select
                                options={projects}
                                isMulti={true}
                                isLoading={dataLoading.isProjectLoading}
                                value={selectedMultiProjects}
                                onChange={(projectsSelected) => {
                                    setSelectedMultiProjects(projectsSelected);

                                    const usersFromProjectsSelected = allHiredCandidates?.filter(
                                        candidate =>
                                            candidate.project &&
                                            candidate.project?.find(
                                                item => projectsSelected?.find(project => project?.value === item)
                                            )
                                    )?.map(
                                        candidate => {
                                            return {
                                                label: candidate?.applicant,
                                                value: candidate?.username,
                                            }
                                        }
                                    )
                                    // console.log(usersFromProjectsSelected);
                                    setSelectedUser(usersFromProjectsSelected);
                                    // handleMultiProjectChange()
                                }}
                                className="item__Filter"
                            />
                        </div>
                    }
                    {
                        views.userWiseView &&
                        <>
                            {
                                views.multiProjectView ? <></> :
                                    <div className="item__Filter__Wrap">
                                        <p>Select User(s):</p>
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
                        </>
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
                    <button
                        onClick={handleGetAttendanceClick}
                        className="hr__Att__Btn"
                        disabled={isLoading ? true : false}
                    >
                        {
                            isLoading ?
                                <LoadingSpinner width={18} height={18} color={'#fff'} /> :
                                `Get Attendance`
                        }
                    </button>
                </div>

                {
                    showAttendaceReport &&
                    <>
                        <div className="users_info">
                            {
                                views.multiProjectView ? <>
                                    <p>Projects:</p>
                                    {
                                        React.Children.toArray(selectedMultiProjects.map(project => {
                                            return <button
                                                onClick={() => handleSelectProjectForMulti(project)}
                                            >
                                                {project.label}
                                            </button>
                                        }))
                                    }
                                </> :
                                    views.userWiseView ? <>
                                        <p>Candidates:</p>
                                        {
                                            selectedUser.map((candidate) => (
                                                <button
                                                    key={candidate.value}
                                                    onClick={() => {
                                                        renderingAttendance(candidate.label, candidate.value);
                                                        // renderingEventAttendance(selectedEvent.id);
                                                    }}
                                                >
                                                    {candidate.label}
                                                </button>

                                            ))
                                        }
                                    </> :
                                        <>

                                        </>
                            }
                        </div>
                        {
                            (
                                (percentage.length < 1 && attendanceDetails?.length < 1)
                                ||
                                (views.multiProjectView && !selectedProjectForMulti)
                            ) ?
                                <></>
                                :
                                <div className="att_rep">
                                    <div className="att_name txt_color">
                                        <div className="profile">
                                            <Avatar
                                                name={
                                                    views.multiProjectView ?
                                                        selectedProjectForMulti?.value :
                                                        userForAttendance[0]
                                                }
                                                round={true}
                                                size='8rem'
                                                color="#807f7f"
                                            />
                                        </div>
                                        <div className="candidate_info">
                                            <h4>
                                                {
                                                    selectedProjectForMulti ?
                                                        selectedProjectForMulti?.value
                                                        :
                                                        userForAttendance
                                                }
                                            </h4>
                                            <>
                                                {
                                                    views.multiProjectView ? <>
                                                        <p style={{ fontSize: '0.75rem' }}>
                                                            Members: {
                                                                allHiredCandidates?.filter(
                                                                    candidate =>
                                                                        candidate.project &&
                                                                        candidate.project?.includes(selectedProjectForMulti?.value)
                                                                )?.map(
                                                                    candidate => candidate?.applicant
                                                                )?.flat()?.join(', ')
                                                            }
                                                        </p>
                                                    </> :
                                                        <>
                                                            <p>Freelancer</p>
                                                            <p>Project: <b>{selectedProject?.value}</b></p>
                                                        </>
                                                }
                                            </>
                                        </div>
                                        {
                                            views.userWiseView && !views.multiProjectView && selectedEvent?.length < 1 ? <></>
                                                :
                                                <>
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
                                                </>
                                        }
                                    </div>
                                    {
                                        views.userWiseView && views.projectWiseView &&
                                        <div className="users_info">
                                            <div className="select__Event__Wrap">
                                                <p>Filter by Event</p>
                                                <Select
                                                    options={eventNames}
                                                    onChange={(val) => {
                                                        // const foundEventIndex = eventNames.findIndex(event => event._id === val._id);
                                                        // if (foundEventIndex === -1) return
                                                        renderingEventAttendance(val?.id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        attendanceDetails?.length < 1 ? <></> :
                                            views.userWiseView && !views.multiProjectView && selectedEvent?.length < 1 ? <></> :
                                                <>
                                                    <h2 className="title">Attendance Report</h2>
                                                    <div className="tbl_rep">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    {
                                                                        views.multiProjectView &&
                                                                        <th>User</th>
                                                                    }
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
                                                                <>
                                                                    {
                                                                        views.multiProjectView ? <>
                                                                            {
                                                                                !selectedProjectForMulti ? <></> :
                                                                                    <>
                                                                                        {
                                                                                            React.Children.toArray(selectedUser?.map(user => {
                                                                                                const usersForCurrentMultiProject = allHiredCandidates?.filter(
                                                                                                    candidate =>
                                                                                                        candidate.project &&
                                                                                                        candidate.project?.includes(selectedProjectForMulti?.value)
                                                                                                )?.map(
                                                                                                    candidate => candidate?.username
                                                                                                )

                                                                                                if (!usersForCurrentMultiProject?.includes(user?.value)) return <></>

                                                                                                return <tr>
                                                                                                    <td>{user?.label}</td>
                                                                                                    {
                                                                                                        React.Children.toArray(datesForToolTip.map((date, index) => {
                                                                                                            return <td
                                                                                                                Tooltip={formatTooltip(index)}
                                                                                                                data-tooltip-id="my-tooltip"
                                                                                                                data-tooltip-content={isWeekend(index) ? `Holiday` : `${new Date(datesForToolTip[index]).toDateString()}`}
                                                                                                                data-tooltip-place="top"
                                                                                                            >
                                                                                                                {
                                                                                                                    isWeekend(index) ?
                                                                                                                        <>
                                                                                                                            <FaCircleCheck className="holiday table_data" />Holiday
                                                                                                                        </>
                                                                                                                        :
                                                                                                                        attendanceDetails?.find(
                                                                                                                            item =>
                                                                                                                                item.user_present?.includes(user?.value)
                                                                                                                                &&
                                                                                                                                formatDateForAPI(item.date_taken) === formatDateForAPI(date)
                                                                                                                        ) ?
                                                                                                                            <>
                                                                                                                                <FaCircleCheck className="present table_data" />Present
                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <>
                                                                                                                                <MdCancel className="absent table_data" />Absent
                                                                                                                            </>
                                                                                                                }
                                                                                                            </td>
                                                                                                        }))
                                                                                                    }
                                                                                                    <td
                                                                                                        Tooltip={formatTooltip(6)}
                                                                                                        data-tooltip-id="my-tooltip"
                                                                                                        data-tooltip-content={`Holiday`}
                                                                                                        data-tooltip-place="top"
                                                                                                    >
                                                                                                        <>
                                                                                                            <FaCircleCheck className="holiday table_data" />Holiday
                                                                                                        </>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            }))
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </> :
                                                                            views.userWiseView ? <>
                                                                                {
                                                                                    selectedEvent?.length < 1 ? <></> :
                                                                                        <tr>
                                                                                            {
                                                                                                React.Children.toArray(datesForToolTip?.map((date, index) => {
                                                                                                    return <td
                                                                                                        Tooltip={formatTooltip(index)}
                                                                                                        data-tooltip-id="my-tooltip"
                                                                                                        data-tooltip-content={isWeekend(index) ? `Holiday` : `${new Date(datesForToolTip[index]).toDateString()}`}
                                                                                                        data-tooltip-place="top"
                                                                                                    >
                                                                                                        {
                                                                                                            isWeekend(index) ?
                                                                                                                <>
                                                                                                                    <FaCircleCheck className="holiday table_data" />Holiday
                                                                                                                </>
                                                                                                                :
                                                                                                                (
                                                                                                                    Array.isArray(foundUserEventAttendanceDetail?.dates_present) &&
                                                                                                                    foundUserEventAttendanceDetail?.dates_present?.includes(formatDateForAPI(date))
                                                                                                                ) ?
                                                                                                                    <>
                                                                                                                        <FaCircleCheck className="present table_data" />Present
                                                                                                                    </>
                                                                                                                    :
                                                                                                                    <>
                                                                                                                        <MdCancel className="absent table_data" />Absent
                                                                                                                    </>
                                                                                                        }
                                                                                                    </td>
                                                                                                }))
                                                                                            }
                                                                                            <td
                                                                                                Tooltip={formatTooltip(6)}
                                                                                                data-tooltip-id="my-tooltip"
                                                                                                data-tooltip-content={`Holiday`}
                                                                                                data-tooltip-place="top"
                                                                                            >
                                                                                                <>
                                                                                                    <FaCircleCheck className="holiday table_data" />Holiday
                                                                                                </>
                                                                                            </td>
                                                                                        </tr>
                                                                                }
                                                                            </> :
                                                                                <></>
                                                                    }
                                                                </>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                    }
                                </div>
                        }
                    </>
                }
            </section>
        </StaffJobLandingLayout>
    );
}

export default AttendanceReport;