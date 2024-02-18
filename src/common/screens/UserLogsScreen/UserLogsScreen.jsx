import Calendar from "react-calendar";
import WeeklogsCount from "../../../components/WeeksLogCount/WeeklogsCount";
import { useCurrentUserContext } from "../../../contexts/CurrentUserContext";
import styles from './styles.module.css';
import React, { useEffect, useState } from "react";
import { calculateHoursOfLogs, checkIfDateIsToday, formatDateAndTime, formatDateForAPI } from "../../../helpers/helpers";
import useLoadLogsDates from "../../hooks/useLoadLogsDates";
import CheckboxItem from "../../components/CheckboxItem/CheckboxItem";
import { getCandidateTasksOfTheDayV2 } from "../../../services/candidateServices";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useLoadProjectAndSubproject from "../../hooks/useLoadProjectAndSubproject";
import DropdownButton from "../../../pages/TeamleadPage/components/DropdownButton/Dropdown";
import SubprojectSelectWithSearch from "../../../components/SubprojectSelectWithSearch/SubprojectSelectWithSearch";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { useMediaQuery } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import Button from "../../../pages/AdminPage/components/Button/Button";
import { BiSelectMultiple } from "react-icons/bi";
import BatchApproveModal from "../../../pages/TeamleadPage/components/CandidateTaskItem/BatchApproveModal/BatchApproveModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { approveTask } from "../../../services/teamleadServices";
import LogRequest from "./LogRequest/LogRequest";


const UsersLogsScreen = ({ 
    className,
    isLeadUser,
    isApprovalView,
    limitProjectsAllowedToView,
}) => {
    const { currentUser } = useCurrentUserContext();
    const [ datesWithLogsInfo, setDatesWithLogsInfo ] = useState({
        dates: [],
        datesLoading: true,
        datesLoaded: false,
    })
    const [ activeFilters, setActiveFilters ] = useState({
        showApproved: false,
        showPendingApproval: false,
        showTaskTypeLogs: false,
        showMeetingTypeLogs: false,
    })
    const [ selectedDate, setSelectedDate ] = useState(formatDateForAPI(new Date()));
    const [ logsLoading, setLogsLoading ] = useState(true);
    const [ logsData, setLogsData ] = useState([]);
    const [ logsToDisplay, setLogsToDisplay ] = useState([]);
    const [ projects, setProjects ] = useState([]);
    const [ projectsLoading, setProjectsLoading ] = useState(true);
    const [ projectsLoaded, setProjectsLoaded ] = useState(false);
    const [ subprojects, setSubprojects ] = useState([]);
    const [ subprojectsLoading, setSubProjectsLoading ] = useState(true);
    const [ subprojectsLoaded, setSubProjectsLoaded ] = useState(false);
    const [ selectedProject, setSelectedProject ] = useState(null);
    const [ selectedSubproject, setSelectedSubproject ] = useState(null);
    const [ logsBeingApproved, setLogsBeingApproved ] = useState({});
    const [ showBatchApprovalModal, setShowBatchApprovalModal ] = useState(false);
    const [ batchApprovalLoading, setBatchApprovalLoading ] = useState(false);
    const [ showLogRequestModal, setShowLogRequestModal ] = useState(false);
    const [ limitedProjects, setLimitedProjects ] = useState([]);

    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    const [searchParams, setSearchParams] = useSearchParams();
    const applicantPassed = searchParams.get('applicant');
    const userIdPassed = searchParams.get('user-id');
    const projectPassed = searchParams.get('project');

    const handleUpdateDatesWithLogsInfo = (keyToUpdate, value) => {
        setDatesWithLogsInfo((prevData) => {
            return {
                ...prevData,
                [keyToUpdate]: value
            }
        });
    }

    const handleUpdateFilters = (keyToUpdate, value) => {
        setActiveFilters((prevData) => {
            return {
                ...prevData,
                [keyToUpdate]: value
            }
        });
    }

    useLoadProjectAndSubproject({
        currentUser,
        projectsLoaded,
        setProjects,
        setProjectsLoaded,
        setProjectsLoading,
        subprojectsLoaded,
        setSubprojects,
        setSubProjectsLoaded,
        setSubProjectsLoading,
    })

    useLoadLogsDates({
        user: currentUser,
        dataLoaded: datesWithLogsInfo.datesLoaded,
        updateLogDatesData: (valPassed) => handleUpdateDatesWithLogsInfo('dates', valPassed),
        updateDataLoaded: (valPassed) => handleUpdateDatesWithLogsInfo('datesLoaded', valPassed),
        updateDataLoading: (valPassed) => handleUpdateDatesWithLogsInfo('datesLoading', valPassed),
        useOtherUserID: userIdPassed ? true : false,
        otherUserID: userIdPassed,
    })

    useEffect(() => {
        setLogsLoading(true);

        const dataToPost = {
            "company_id": currentUser.portfolio_info[0].org_id,
            "user_id": isApprovalView && userIdPassed ? 
                userIdPassed 
                : 
            currentUser.userinfo.userID,
            "data_type": currentUser.portfolio_info[0].data_type,
            "task_created_date": selectedDate,
        }

        getCandidateTasksOfTheDayV2(dataToPost).then(res => {
            setLogsLoading(false);

            const parentTaskOfTheDay = res.data?.task_details?.find(task => task.task_created_date === selectedDate);
            if (!parentTaskOfTheDay) return;

            const logsMatchingParentLog = res.data?.task?.filter(
                task => task.task_id === parentTaskOfTheDay?._id &&
                task.is_active && 
                task.is_active === true
            );

            setLogsData(logsMatchingParentLog);

            const limitedProjectsToShow = [...new Set(logsMatchingParentLog.map(log => log.project))];
            setLimitedProjects(limitedProjectsToShow);

            if (isApprovalView && projectPassed) {
                if (logsMatchingParentLog.filter(log => log.project === projectPassed).length < 1 && limitedProjectsToShow.length > 0) {
                    return setSelectedProject(limitedProjectsToShow[0]);
                }

                setSelectedProject(projectPassed);
            }

        }).catch(err => {
            console.log(err?.response?.data);
            setLogsLoading(false);
        })

    }, []);

    useEffect(() => {
        if (projectsLoading) return setSelectedProject('None selected') 

        if (isApprovalView && projectPassed) return;
        
        if (currentUser?.candidateAssignmentDetails?.assignedProjects && !isLeadUser) return setSelectedProject(currentUser?.candidateAssignmentDetails?.assignedProjects?.flat()[0]);
        
        if (
            isLeadUser &&
            currentUser?.settings_for_profile_info?.profile_info[currentUser?.settings_for_profile_info?.profile_info?.length - 1]?.project 
        ) {
            return setSelectedProject(
                currentUser?.settings_for_profile_info?.profile_info[currentUser?.settings_for_profile_info?.profile_info.length - 1]?.project
            );
        }

        setSelectedProject(projects[0]);
    
    }, [currentUser, projectsLoading, projects, isLeadUser, isApprovalView])

    useEffect(() => {
        const filteredData = logsData.filter(
            log => {
                if (activeFilters.showApproved && activeFilters.showPendingApproval) return true
                if (activeFilters.showApproved) {
                    if (log?.approved === true || log?.approval === true) return true
                    return false
                }
                return true
            }
        ).filter(
            log => {
                if (activeFilters.showApproved && activeFilters.showPendingApproval) return true
                if (activeFilters.showPendingApproval) {
                    if (log?.approved === false || log?.approval === false) return true
                    return false
                }
                return true
            }
        ).filter(
            log => {
                if (activeFilters.showMeetingTypeLogs) {
                    if (log.task_type === 'MEETING UPDATE') return true
                    return false 
                }

                return true
            }
        ).filter(
            log => {
                if (activeFilters.showTaskTypeLogs) {
                    if (log.task_type === 'TASK UPDATE') return true
                    return false 
                }

                return true
            }
        );

        setLogsToDisplay(filteredData);
    }, [activeFilters, logsData])

    const tileClassName = ({ date, view }) => {
        // Add class to tiles in month view only
        if (view === "month") {
          // Check if a date React-Calendar wants to check is on the list of dates to add class to
          if (datesWithLogsInfo.datesLoading) return styles.log__Date__Tile;
          if (datesWithLogsInfo?.dates?.find((dDate) => formatDateForAPI(dDate) === formatDateForAPI(date))) {
            return `${styles.active__Task__Tile} ${styles.log__Date__Tile}`;
          }
          return styles.log__Date__Tile;
        }
    };

    const handleSelectDate = async (daySelected) => {
        setLogsData([]);
        setSelectedDate(formatDateForAPI(daySelected));
        setLogsLoading(true);

        const dataToPost = {
            "company_id": currentUser.portfolio_info[0].org_id,
            "user_id": isApprovalView && userIdPassed ? 
                userIdPassed 
                : 
            currentUser.userinfo.userID,
            "data_type": currentUser.portfolio_info[0].data_type,
            "task_created_date": formatDateForAPI(daySelected),
        }

        try {
            const res = (await getCandidateTasksOfTheDayV2(dataToPost)).data;
            setLogsLoading(false);

            const parentTaskOfTheDay = res?.task_details?.find(task => task.task_created_date === formatDateForAPI(daySelected));
            if (!parentTaskOfTheDay) return;

            const logsMatchingParentLog = res?.task?.filter(
                task => task.task_id === parentTaskOfTheDay?._id &&
                task.is_active && 
                task.is_active === true
            );

            setLogsData(logsMatchingParentLog);

            const limitedProjectsToShow = [...new Set(logsMatchingParentLog.map(log => log.project))];
            setLimitedProjects(limitedProjectsToShow);

            if (isApprovalView && projectPassed) {
                if (logsMatchingParentLog.filter(log => log.project === projectPassed).length < 1 && limitedProjectsToShow.length > 0) {
                    return setSelectedProject(limitedProjectsToShow[0]);
                }

                setSelectedProject(projectPassed);
            }
        } catch (error) {
            setLogsLoading(false);
        }

    }

    const handleApproveSingleLog = async (log) => {
        const copyOfLogsBeingApproved = structuredClone(logsBeingApproved);
        const copyOfLogsData = logsData.slice();

        if (copyOfLogsBeingApproved[log._id]) return;

        copyOfLogsBeingApproved[log._id] = true;
        setLogsBeingApproved(copyOfLogsBeingApproved);

        try {
            const dataToPost = {
                document_id: log._id,
                lead_username: currentUser?.userinfo?.username,
            };

            const response = (await approveTask(dataToPost)).data;
            console.log(response);

            delete copyOfLogsBeingApproved[log._id];
            setLogsBeingApproved(copyOfLogsBeingApproved);

            const foundApprovedLogInState = copyOfLogsData.find(singleLog => singleLog._id === log._id);
            if (foundApprovedLogInState) {
                foundApprovedLogInState.approval = true;
                foundApprovedLogInState.approved = true;
                setLogsData(copyOfLogsData);
            }

            toast.success('Log approved');
        } catch (error) {
            delete copyOfLogsBeingApproved[log._id];
            setLogsBeingApproved(copyOfLogsBeingApproved);

            toast.error(
                error.response ? 
                    error.response.status === 500 ? 
                        'Log approval failed'
                    : 
                    error.response.data.message
                : 
                'Log approval failed'
            );
        }

    }

    const handleApproveSelectedLogs = async (logs) => {
        const copyOfLogsBeingApproved = structuredClone(logsBeingApproved);
        const copyOfLogsData = logsData.slice();
        const logsToApprove = [];

        logs.forEach(logId => {
            if (!copyOfLogsData[logId]) {
                copyOfLogsData[logId] = true;
                logsToApprove.push(logId);
            }
        });

        setBatchApprovalLoading(true);

        const taskApprovalResponses = await Promise.all(logsToApprove.map(async (logId) => {
            try {
                const dataToPost = {
                    document_id: logId,
                    lead_username: currentUser?.userinfo?.username,
                };
    
                const response = (await approveTask(dataToPost)).data;
                console.log(response);
                
                delete copyOfLogsBeingApproved[logId];
                setLogsBeingApproved(copyOfLogsBeingApproved);

                const foundApprovedLogInState = copyOfLogsData.find(singleLog => singleLog._id === logId);
                if (foundApprovedLogInState) {
                    foundApprovedLogInState.approval = true;
                    foundApprovedLogInState.approved = true;
                    setLogsData(copyOfLogsData);
                }

                return true
            } catch (error) {
                delete copyOfLogsBeingApproved[logId];
                setLogsBeingApproved(copyOfLogsBeingApproved);
                return false            
            }
        }));

        const tasksSuccessfullyApproved = taskApprovalResponses.filter(item => item === true).length

        setShowBatchApprovalModal(false);
        setBatchApprovalLoading(false);

        toast.success(`Successfully approved ${tasksSuccessfullyApproved} work logs`);
    }

    
    return <>
        <div className={`${styles.user__log__Wrap} ${className ? className : ''}`}>
            <div 
                className={styles.user__Filter_Wrap} 
                style={{ 
                    pointerEvents: (datesWithLogsInfo.datesLoading || logsLoading) ? 'none' : 'all'
                }}
            >
                {
                    datesWithLogsInfo.datesLoading ?
                        <p className={styles.loading__Date__Text}>Loading data...</p> 
                        :
                    <></>
                }
                {
                    isSmallScreen && !isApprovalView && <>
                        <WeeklogsCount
                            user={currentUser}
                        />
                        <br />
                        <br />
                    </>
                }
                <Calendar
                    tileClassName={tileClassName}
                    onClickDay={(day) => handleSelectDate(day)}
                    value={selectedDate}
                    tileContent={
                        ({ activeStartDate, date, view }) => {
                            if (
                                view === 'month' && 
                                logsToDisplay.filter(item => 
                                    item.project === selectedProject    
                                )?.find(
                                    log => 
                                        formatDateForAPI(date) === formatDateForAPI(log?.task_created_date) &&
                                        (
                                            log?.approved === false || log?.approval === false
                                        )
                                )
                            ) return <div className={styles.pending__Indicator}></div>
                            return null
                        }
                    }
                />
                <div className={styles.filters__Wrap}>
                    <h3>Filters</h3>
                    <div className={styles.filter__items}>
                        <CheckboxItem 
                            label={'Show only worklogs pending approval'}
                            checked={activeFilters.showPendingApproval}
                            handleSelectItem={
                                (val) => handleUpdateFilters('showPendingApproval', val)
                            }
                        />

                        <CheckboxItem 
                            label={'Show only approved worklogs'}
                            checked={activeFilters.showApproved}
                            handleSelectItem={
                                (val) => handleUpdateFilters('showApproved', val)
                            }
                        />
                        <CheckboxItem 
                            label={'Show only task type worklogs'}
                            checked={activeFilters.showTaskTypeLogs}
                            handleSelectItem={
                                (val) => handleUpdateFilters('showTaskTypeLogs', val)
                            }
                        />
                        <CheckboxItem 
                            label={'Show only meeting type worklogs'}
                            checked={activeFilters.showMeetingTypeLogs}
                            handleSelectItem={
                                (val) => handleUpdateFilters('showMeetingTypeLogs', val)
                            }
                        />
                    </div>
                </div>
                <div className={styles.divider}></div>
            </div>
            <div className={styles.user__log__Details}>
                {
                    !isSmallScreen && !isApprovalView && 
                    <WeeklogsCount
                        user={currentUser}
                    />
                }

                <div>
                    <h2>Worklog Details for {isApprovalView && applicantPassed ? applicantPassed + ' on ' : ''} {formatDateAndTime(selectedDate, true)}</h2>

                    {
                        logsLoading ? <div className={styles.log__Load__Wrap}>
                            <p>Loading logs...</p>
                            <LoadingSpinner 
                                className={styles.loader}
                                width={'0.875rem'}
                                height={'0.875rem'}
                            />
                        </div>
                        :
                        <>
                            {
                                isApprovalView && <>
                                    <br />
                                </>
                            }
                            <div className={styles.log__Detail__Wrap}>
                                <div className={styles.pro__Select__Wrap}>
                                    <p>Select Project: </p>
                                    <DropdownButton
                                        currentSelection={
                                            projectsLoading ? 'None selected' 
                                            :
                                            selectedProject
                                        } 
                                        selections={
                                            limitProjectsAllowedToView ?
                                                limitedProjects.sort((a, b) => a.localeCompare(b))
                                            :
                                            projects.sort((a, b) => a.localeCompare(b))
                                        } 
                                        disabled={projectsLoading}
                                        handleSelectionClick={(project) => setSelectedProject(project)}
                                        className={styles.select__Project}
                                        selectionsDropDownClassName={styles.project__Listing}
                                    />
                                </div>
                                <div className={styles.pro__Select__Wrap}>
                                    <p>Select Subproject: </p>
                                    {
                                        selectedSubproject && <div className={styles.selected__Subproject__item}>
                                            <p>{selectedSubproject}</p>
                                            <AiOutlineClose 
                                                onClick={() => setSelectedSubproject(null)} 
                                                cursor={'pointer'}
                                            />
                                        </div>
                                    }
                                    <SubprojectSelectWithSearch
                                        searchPlaceholder={'Filter by subproject'}
                                        subprojects={subprojects.filter(item => item.parent_project === selectedProject)}
                                        selectedSubProject={selectedSubproject}
                                        handleSelectItem={(subproject, project) => {
                                            setSelectedSubproject(subproject);
                                        }}
                                        hideSelectionsMade={true}
                                    />
                                </div>
                                {
                                    isApprovalView && <>
                                        <br />
                                    </>
                                }
                                <div className={styles.log__Heading}>
                                    <div>
                                        <p>Logs Added</p>
                                        {
                                            isApprovalView &&
                                            <p className={styles.sub__Log__Heading}>
                                                {applicantPassed} added logs in a total of {limitedProjects?.length} projects
                                            </p>
                                        }
                                        <p className={styles.sub__Log__Heading}>
                                            {
                                                logsToDisplay.filter(item => 
                                                item.project === selectedProject    
                                                )?.length
                                            } logs, {
                                                calculateHoursOfLogs(
                                                    logsToDisplay.filter(item => 
                                                        item.project === selectedProject    
                                                    )
                                                )
                                            } hours
                                        </p>
                                    </div>
                                    {
                                        isApprovalView &&
                                        <Button
                                            text={"Batch Approval"}
                                            icon={<BiSelectMultiple />}
                                            handleClick={() => setShowBatchApprovalModal(true)}
                                            className={styles.batch__Approve__Btn}
                                        />
                                    }
                                </div>
                                <div className={styles.logs__Wrap}>
                                    {
                                        (
                                            !isApprovalView && 
                                            
                                            !checkIfDateIsToday(selectedDate) && 

                                            logsToDisplay.length < 1
                                        ) ? <>
                                            <Button
                                                text={"Request to update"}
                                                icon={<AddCircleOutlineIcon fontSize="0.75rem" />}
                                                handleClick={() => setShowLogRequestModal(true)}
                                                className={`${styles.single__Approve__Btn} ${styles.request__Log__Btn}`}
                                            />
                                        </>
                                        :
                                        React.Children.toArray(
                                            logsToDisplay.filter(item => 
                                                item.project === selectedProject    
                                            )
                                            .filter(item => {
                                                if (selectedSubproject) {
                                                    if (item.subproject === selectedSubproject) return true
                                                    return false
                                                }
                                                return true
                                            }).map(log => {
                                                const logIsApproved = log?.approved === true || log?.approval === true;

                                                return <div className={styles.single__log__Detail__Wrap}>
                                                    <p className={`${styles.single__log__Detail} ${logIsApproved ? styles.approved__log : ''}`}>
                                                        {
                                                            logIsApproved ? 
                                                                <AiOutlineCheckCircle 
                                                                    fontSize={'0.8rem'} 
                                                                    color="#005734" 
                                                                />
                                                            :
                                                            <></>
                                                        }
                                                        <span className={styles.date__log}>{formatDateAndTime(log?.task_created_date)}</span>
                                                        <span className={styles._log}>
                                                            {log?.task}
                                                        </span>
                                                        <span className={styles.log__Timing}>from {log?.start_time} to {log?.end_time}</span>
                                                    </p>
                                                    {
                                                        isApprovalView &&
                                                        !logIsApproved &&
                                                        <Button
                                                            text={logsBeingApproved[log._id] ? "Approving" : "Approve Log"}
                                                            icon={<AddCircleOutlineIcon fontSize="0.75rem" />}
                                                            handleClick={() => handleApproveSingleLog(log)}
                                                            className={styles.single__Approve__Btn}
                                                        />
                                                    }
                                                </div>
                                            })
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>

        {
            showBatchApprovalModal && 
            <BatchApproveModal 
                logs={
                    logsData
                    ?.filter(item => 
                        item.project === selectedProject    
                    )
                    ?.filter(
                        log => {
                            if (log?.approved === false || log?.approval === false) return true
                            return false
                        }
                    )
                }
                batchApprovalLoading={batchApprovalLoading}
                handleCloseModal={
                    batchApprovalLoading ?
                        () => {}
                    :
                    () => setShowBatchApprovalModal(false)
                }
                handleApproveSelected={handleApproveSelectedLogs}
            />
        }

        {
            showLogRequestModal &&
            <LogRequest 
                updatetaskdate={formatDateForAPI(selectedDate)}
                projects={projects}
                setShowModal={setShowLogRequestModal}
            />
        }
    </>
}

export default UsersLogsScreen;
