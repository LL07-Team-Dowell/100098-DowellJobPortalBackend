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
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { getAllEvents } from "../../../../../services/hrServices";
import { addAttendance } from "../../../../../services/hrServices";
import { toast } from "react-toastify";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import { candidateStatuses } from "../../../../CandidatePage/utils/candidateStatuses";

const AttendanceUpdatePage = () => {
    const navigate = useNavigate();
    const { currentUser, allApplications, userRemovalStatusChecked } = useCurrentUserContext();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [usersInSelectedProject, setUsersInSelectedProject] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceStates, setAttendanceStates] = useState([]);
    const [eventNames, setEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [usersPresent, setUsersPresent] = useState([]);
    const [usersAbsent, setUsersAbsent] = useState([]);
    const [isAttendanceUpdated, setIsAttendanceUpdated] = useState(false);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const [isProjectLoading, setIsProjectLoading] = useState(false);
    const [userNames, setUserNames] = useState([]);
    const companyId = "6385c0f18eca0fb652c94561";

    const today = new Date();
    const mondayOfThisWeek = today.getDay() === 0 ?
        new Date(new Date(today.setDate(today.getDate() - 6)).setHours(0, 0, 0, 0))
        :
        new Date(new Date(today.setDate(today.getDate() - today.getDay() + 1)).setHours(0, 0, 0, 0));
    const sundayOfNextWeek = new Date(new Date().setDate(mondayOfThisWeek.getDate() + 6));

    useEffect(() => {
        setIsProjectLoading(true);
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
                    setIsLoading(false);
                    setIsProjectLoading(false);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const dataForFetchingEvents = {
        company_id: currentUser?.portfolio_info[0]?.org_id,
        data_type: currentUser?.portfolio_info[0]?.data_type,
    }

    useEffect(() => {
        setIsEventLoading(true);
        const fetchEvents = async () => {
            // if (!selectedEvent) return toast.warn('Select an Event!');
            try {
                const data = (await getAllEvents(dataForFetchingEvents)).data.data?.filter(event =>
                    event.data_type === currentUser?.portfolio_info[0]?.data_type
                );
                const eventNamesList = data.map(event => ({
                    id: event._id,
                    value: event.is_mendatory,
                    label: event.event_name,
                }));
                console.log(">>>>>>>>>>mamnd", eventNamesList);
                setEventNames(eventNamesList);
                setIsEventLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setAttendanceStates([]);
        setUsersInSelectedProject([]);
        setUsersPresent([]);
        // currentUser?.portfolio_info[0].org_id

        if (!userRemovalStatusChecked) return;
        const hiredCandidates = allApplications.filter(candidate => candidate.status === candidateStatuses.ONBOARDING || candidate.status === candidateStatuses.RENEWCONTRACT);

        const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
            candidate.project && candidate.project.includes(selectedProject?.value)
        );

        const options = candidatesInSelectedProject.map(candidate => candidate.applicant);
        const optionsUsername = candidatesInSelectedProject.map(candidate => candidate.username);

        // console.log('user names', optionsUsername);
        setUsersInSelectedProject(options);
        setUserNames(optionsUsername);
        if (selectedEvent.value === true) {
            setUsersAbsent(optionsUsername);
        }
        setIsLoading(false);

        // getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
        //     const onboardingCandidates = res?.data?.response?.data;
        //     const hiredCandidates = onboardingCandidates.filter(candidate => candidate.status === 'hired');

        //     const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
        //         candidate.project && candidate.project.includes(selectedProject?.value)
        //     );

        //     const options = candidatesInSelectedProject.map(candidate => candidate.applicant);
        //     const optionsUsername = candidatesInSelectedProject.map(candidate => candidate.username);
        //     console.log('user names', optionsUsername);
        //     setUsersInSelectedProject(options);
        //     setUserNames(optionsUsername);
        //     if (selectedEvent.value === true) {
        //         setUsersAbsent(optionsUsername);
        //     }
        //     setIsLoading(false);
        // }).catch(err => {
        //     console.log('onboarded failed to load');
        //     setIsLoading(false);
        // })
    }, [selectedProject, userRemovalStatusChecked]);

    const handleProjectChange = async (event) => {
        setSelectedProject(event);
    };

    const handleDateChange = (date) => {
        setSelectedDate(formatDateForAPI(date));
    };

    const handleAttendanceChange = (index) => {
        const updatedAttendanceStates = [...attendanceStates];
        updatedAttendanceStates[index] = !updatedAttendanceStates[index];
        setAttendanceStates(updatedAttendanceStates);

        // const user = usersInSelectedProject[index];
        const user = userNames[index];
        if (updatedAttendanceStates[index]) {
            setUsersPresent(prevUsers => [...prevUsers, user]);
            setUsersAbsent(prevUsers => prevUsers.filter(u => u !== user));
        } else {
            setUsersAbsent(prevUsers => [...prevUsers, user]);
            setUsersPresent(prevUsers => prevUsers.filter(u => u !== user));
        }
        if (selectedEvent?.value === 'False') {
            setUsersAbsent([]);
        }
    };

    const dataToPost = {
        "user_present": usersPresent,
        "user_absent": usersAbsent,
        "date_taken": selectedDate,
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "event_id": selectedEvent.id,
        "project": selectedProject.label,
        "data_type": "Real_Data",
    }
    const handleUpdateClick = async () => {
        if (!selectedDate) {
            return toast.warn('Please select the date');
        } else if (!selectedEvent) {
            return toast.warn('Please select an event ');
        } else {
            setIsAttendanceUpdated(true);
        }
        await addAttendance(dataToPost)
            .then(() => {
                toast.success('Attendance Updated Successfully');
            })
            .catch((error) => {
                toast.error('Unable to update Attendance');
            });
        setIsAttendanceUpdated(false);
    };

    const handleEventChange = (selectedOption) => {
        setSelectedEvent(selectedOption);
    }

    useEffect(() => {
        setUsersPresent([]);
        setAttendanceStates([]);
        if (selectedEvent?.value === true) {
            setUsersAbsent(usersAbsent);
        } else {
            setUsersAbsent([]);
        }
    }, [selectedEvent])
    // console.log("dataaaa>>>>>>>", dataToPost);
    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
            pageTitle={'Attendance'}
        >
            <div className="att_title"><div className="back_icon" onClick={() => navigate(-1)}><IoChevronBack /></div><h3>Update Attendance</h3></div>
            <div className="upd_att_wrap">
                <div className="att_upd_calendar">
                    <div className="upd_calendar">
                        <p>Select Date:</p>
                        <br />
                        <Calendar
                            minDate={mondayOfThisWeek}
                            maxDate={sundayOfNextWeek}
                            onChange={handleDateChange}
                            className="react-calendar"
                            tileDisabled={
                                ({ activeStartDate, date, view }) => (
                                    date.getDay() === 0 ||
                                    date.getDay() === 6
                                )
                            }
                        />
                    </div>
                </div>
                <div className="att_upd_candidates">
                    <div className="att_upd_input">
                        <div className="att_upd_select">
                            <label>
                                <span>Select Event:</span>
                                <Select
                                    options={eventNames}
                                    isMulti={false}
                                    isLoading={isEventLoading}
                                    value={selectedEvent}
                                    onChange={(selectedOption) => {
                                        handleEventChange(selectedOption);
                                    }}
                                    // hideSelectedOptions={true}
                                    isOptionSelected={(option, selectValue) => selectValue.some(i => i === option)}
                                    className="item_Filter"
                                />
                            </label>
                        </div>
                        <div className="att_upd_select">
                            <label>
                                <span>Select Project:</span>
                                <Select
                                    options={projects}
                                    isMulti={false}
                                    isLoading={isProjectLoading}
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    className="item_Filter"
                                />
                            </label>
                        </div>
                    </div>
                    {
                        (isLoading && projects.length !== 0) ? (
                            <div className="loading_users">
                                <p>Crunching user(s):</p>
                                <LoadingSpinner width={"1.2rem"} height={"1.2rem"} />
                            </div>
                        ) : usersInSelectedProject.length === 0 ? (
                            selectedProject.label ? (
                                <div className="loading_users">
                                    <p>{`No user(s) found in ${selectedProject.label}`}</p>
                                </div>
                            ) : (
                                <></>
                            )
                        ) :
                            <>

                                {
                                    usersInSelectedProject.length > 0 &&
                                    (
                                        <>
                                            <div className="update_att">
                                                <p>Candidates in selected project:</p>
                                                <button
                                                    onClick={
                                                        () => { handleUpdateClick() }
                                                    }
                                                    disabled={isAttendanceUpdated ? true : false}
                                                >
                                                    {
                                                        isAttendanceUpdated ?
                                                            <>
                                                                <LoadingSpinner
                                                                    width={"1rem"}
                                                                    height={"1rem"}
                                                                    color={'#fff'}
                                                                />
                                                            </>
                                                            :
                                                            <>
                                                                Update
                                                            </>
                                                    }
                                                </button>
                                            </div>
                                            <div className="user_boxes">
                                                {usersInSelectedProject.map((user, index) => (
                                                    <div key={user + index} className="user_box">
                                                        <div className="mark_att" onClick={() => handleAttendanceChange(index)}>
                                                            {
                                                                attendanceStates[index] ?
                                                                    <>
                                                                        <FaCircleCheck
                                                                            className="present"
                                                                            fontSize={'1.4rem'}
                                                                            data-tooltip-id={"check-status-present"}
                                                                        />
                                                                        <Tooltip
                                                                            id="check-status-present"
                                                                            content={
                                                                                'Update to absent'
                                                                            }
                                                                        />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <MdCancel
                                                                            className="absent"
                                                                            fontSize={'1.4rem'}
                                                                            data-tooltip-id={"check-status-absent"}
                                                                        />
                                                                        <Tooltip
                                                                            id="check-status-absent"
                                                                            content={
                                                                                'Update to present'
                                                                            }
                                                                        />
                                                                    </>
                                                            }
                                                        </div>
                                                        <Avatar
                                                            name={user[0]}
                                                            round={true}
                                                            size='6rem'
                                                            color="#005734"
                                                        />
                                                        <h6>{user}</h6>
                                                        <b>{selectedProject.label}</b>
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