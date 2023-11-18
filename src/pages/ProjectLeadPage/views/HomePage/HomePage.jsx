import React, { useState } from "react";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useEffect } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getCandidateTasksV2 } from "../../../../services/teamleadServices";
import { getAllOnBoardedCandidate } from "../../../../services/candidateServices";
import { extractNewTasksAndAddExtraDetail } from "../../../TeamleadPage/util/extractNewTasks";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from "react-icons/io";
import SelectedCandidates from "../../../TeamleadPage/components/SelectedCandidates/SelectedCandidates";
import JobCard from "../../../../components/JobCard/JobCard";
import { useNavigate } from "react-router-dom";
import { createArrayWithLength } from "../../../AdminPage/views/Landingpage/LandingPage";
import { toast } from "react-toastify";
import { getSettingUserProject } from "../../../../services/hrServices";

const ProjectLeadHomePage = () => {
    const { currentUser } = useCurrentUserContext();
    const { 
        tasksLoaded, 
        setTasksLoaded,
        fetchedOnboardingUsers,
        setFetchedOnboardingUsers,
        fetchedOnboardingUsersLoaded,
        setFetchedOnboardingUsersLoaded,
        allProjects,
        setAllProjects,
        initialTasksLoaded,
        setInitialTasksLoaded,
    } = useCandidateTaskContext();
    const [searchValue, setSearchValue] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [cardPagination, setCardPagination] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [tasksToDisplayForLead, setTasksToDisplayForLead] = useState([]);
    const [currentSelectedProjectForLead, setCurrentSelectedProjectForLead] = useState('');
    const [currentSortOption, setCurrentSortOption] = useState(null);
    const [sortResults, setSortResults] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [cardGroupNumber, setCardGroupNumber] = useState(0);
    const [taskForProjectLoading, setTaskForProjectLoading] = useState(false);
    const [ refreshLoading, setRefreshLoading ] = useState(false);

    const navigate = useNavigate();


    const incrementStepPagination = (steps, length) => {
        if (steps + 1 <= length) {
            if (steps + cardPagination !== length) {
                setCardPagination(cardPagination + 1);
            }
        }
    };

    const decrementStepPagination = () => {
        if (cardPagination !== 0) {
            setCardPagination(cardPagination - 1);
        }
    };

    const handleSearch = (value) => {
        console.log("value", value);
        setSearchValue(value);
        setFilteredTasks(
        tasksToDisplayForLead.filter(
            (task) =>
            (typeof task.applicant === "string" &&
                task.applicant &&
                task.applicant
                .toLocaleLowerCase()
                .includes(value.toLocaleLowerCase())) ||
            (typeof task.applicantName === "string" &&
                task.applicantName &&
                task.applicantName
                .toLocaleLowerCase()
                .includes(value.toLocaleLowerCase()))
        )
        );
        console.log("filteredTasks", filteredTasks);
    };

    const handleViewTaskBtnClick = (data) => {
        navigate(`/new-task-screen?applicant=${data.applicant}&project=${data.project}&name=${data.applicantName}`);
    };

    useEffect(() => {
        if (!fetchedOnboardingUsersLoaded) {
            setLoading(true);

            getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
                const onboardingCandidates = res?.data?.response?.data
                .filter(
                (application) =>
                    application.data_type === currentUser?.portfolio_info[0].data_type
                );

                setFetchedOnboardingUsers(onboardingCandidates);
                setFetchedOnboardingUsersLoaded(true);
            }).catch(err => {
                console.log('onboarded failed to load');
                setFetchedOnboardingUsersLoaded(true);
            })

            return
        }
    }, [])

    useEffect(() => {
        if (!fetchedOnboardingUsersLoaded) return

        if (allProjects.length > 0) {
            const tasksForMainProject = tasksLoaded?.find(item => item.project === allProjects[0]);

            if (initialTasksLoaded && tasksForMainProject) {
                setLoading(false);
                setCurrentSelectedProjectForLead(tasksForMainProject?.project);
                return
            }
        }

        setInitialTasksLoaded(false);
        setLoading(true);

        getSettingUserProject().then((res) => {
            const projectsGotten = res.data
            ?.filter(
              (project) =>
                project?.data_type === currentUser.portfolio_info[0].data_type &&
                project?.company_id === currentUser.portfolio_info[0].org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse()
            
            let allProjectsFetched;

            if (projectsGotten.length > 0) {
                allProjectsFetched = projectsGotten[0]?.project_list.sort((a, b) => a.localeCompare(b));
                setAllProjects(allProjectsFetched);
            }

            const initialProjectSelected = allProjectsFetched[0];

            setCurrentSelectedProjectForLead(initialProjectSelected);

            const requestDataToPost = {
                "company_id": currentUser.portfolio_info[0].org_id,
                "data_type": currentUser.portfolio_info[0].data_type,
                "project": initialProjectSelected,
            }

            getCandidateTasksV2(requestDataToPost)
            .then(res => {

                const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res?.data?.task_details, res?.data?.task, false, fetchedOnboardingUsers);

                const usersWithTasks = [
                    ...new Map(
                        updatedTasksForMainProject.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
                    ).values(),
                ].sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date));

                setTasksLoaded((prevDetail) => {
                    return [
                        ...prevDetail,
                        {
                            project: initialProjectSelected,
                            tasksForProject: usersWithTasks,
                        }
                    ]
                })

                setTasksToDisplayForLead(usersWithTasks)

                setInitialTasksLoaded(true);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
            })

        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
        
    }, [fetchedOnboardingUsersLoaded])

    useEffect(() => {
        if (currentSelectedProjectForLead.length < 1) return

        const tasksLoadedForProject = tasksLoaded?.find(item => item.project === currentSelectedProjectForLead);

        if (tasksLoadedForProject && tasksLoadedForProject?.project) {
            setTasksToDisplayForLead(tasksLoadedForProject?.tasksForProject)
            return
        }

        setTaskForProjectLoading(true);

        const requestDataToPost = {
            "company_id": currentUser.portfolio_info[0].org_id,
            "data_type": currentUser.portfolio_info[0].data_type,
            "project": currentSelectedProjectForLead,
        }

        getCandidateTasksV2(requestDataToPost).then(res => {

            const tasksForProject = extractNewTasksAndAddExtraDetail(res?.data?.task_details, res?.data?.task, false, fetchedOnboardingUsers);
            const usersWithTasks = [
                ...new Map(
                    tasksForProject.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
                ).values(),
            ].sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date));

            setTasksLoaded((prevDetail) => {
                return [
                    ...prevDetail,
                    {
                        project: currentSelectedProjectForLead,
                        tasksForProject: usersWithTasks,
                    }
                ]
            })

            setTasksToDisplayForLead(usersWithTasks)
            setTaskForProjectLoading(false);
            
        }).catch(err => {
            console.log(err);
            setTaskForProjectLoading(false);
        })

    }, [currentSelectedProjectForLead])

    useEffect(() => {

        if (!currentSortOption) return;
    
        const categories = {};
        const newArray = [];
    
        const getCategoryArray = (propertyName, date) => {
    
          tasksToDisplayForLead?.forEach(task => {
            if (date) {
    
              if (categories.hasOwnProperty(new Date(task[`${propertyName}`]).toDateString())) return
    
              categories[`${new Date(task[propertyName]).toDateString()}`] = new Date(task[`${propertyName}`]).toDateString();
              return
    
            }
    
            if (!categories.hasOwnProperty(task[`${propertyName}`])) {
              categories[`${task[propertyName]}`] = task[`${propertyName}`]
            }
          })
    
          let categoryObj = {};
    
          Object.keys(categories || {}).forEach(key => {
    
            if (key === "undefined") return;
    
            if (date) {
              const matchingTasks = tasksToDisplayForLead?.filter(task => new Date(task[`${propertyName}`]).toDateString() === key);
              categoryObj.name = key;
              categoryObj.data = matchingTasks;
              newArray.push(categoryObj);
              categoryObj = {};
              return
            }
    
            const matchingTasks = tasksToDisplayForLead?.filter(task => task[`${propertyName}`] === key);
            categoryObj.name = key;
            categoryObj.data = matchingTasks;
            newArray.push(categoryObj);
            categoryObj = {};
          })
    
          return newArray;
        }
    
        switch (currentSortOption) {
          case "applicant":
            const applicantCategoryData = getCategoryArray('applicantName');
            setSortResults(applicantCategoryData);
            break;
          case "date":
            const dateCategoryData = getCategoryArray("task_created_date", true);
            setSortResults(dateCategoryData.sort((a, b) => new Date(b.name) - new Date(a.name)));
            break;
          default:
            setSortResults([]);
            break;
        }
    
    }, [currentSortOption])
    
    const handleRefreshForCandidateTask = async () => {
        if (currentSelectedProjectForLead.length < 1 || refreshLoading) return
        
        setRefreshLoading(true);

        const dataToPost = {
            "company_id": currentUser.portfolio_info[0].org_id,
            "data_type": currentUser.portfolio_info[0].data_type,
            "project": currentSelectedProjectForLead,
        }

        try {
            const res = (await getCandidateTasksV2(dataToPost)).data;
            const tasksForProject = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, false, fetchedOnboardingUsers);
            
            const usersWithTasks = [
                ...new Map(
                    tasksForProject.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
                ).values(),
            ].sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date));
            
            const copyOfUserTasks = tasksLoaded.slice();
            const previousIndexOfTasksLoadedForProject = copyOfUserTasks.findIndex(item => item.project === currentSelectedProjectForLead);
            if (previousIndexOfTasksLoadedForProject !== -1) {
                copyOfUserTasks[previousIndexOfTasksLoadedForProject].tasksForProject = usersWithTasks;
            }

            setTasksLoaded(copyOfUserTasks);
            setTasksToDisplayForLead(usersWithTasks);
            setRefreshLoading(false);
            toast.success('Successfully refreshed work logs')

        } catch (error) {
            setRefreshLoading(false);
            toast.info('Refresh for logs failed')
        }
    }

    return (
        <StaffJobLandingLayout
            projectLeadView={true}
            searchValue={searchValue}
            setSearchValue={handleSearch}
            searchPlaceHolder={'user'}
        >
            {
                loading ? 
                    <LoadingSpinner />
                :
                <>
                    <TitleNavigationBar 
                        title={'Work Logs'}
                        hideBackBtn={true}
                    />

                    <button
                        className="refresh-container-teamlead desktop"
                    >
                        <div className="refresh-btn refresh-btn-teamlead" onClick={refreshLoading ? () => {} : () => handleRefreshForCandidateTask()}
                        >
                        {
                            refreshLoading ? 
                            <LoadingSpinner 
                                width={'0.8rem'} 
                                height={'0.8rem'} 
                            /> 
                            :
                            <IoMdRefresh />
                        }
                        <p>Refresh</p>
                        </div>
                    </button>

                    <SelectedCandidates
                        showTasks={true}
                        tasksCount={
                          currentSortOption ?
                            searchValue.length > 0 ?
                              sortResults.filter(
                                item =>
                                  item.data.find(
                                    task => typeof task?.applicantName === 'string' && task?.applicantName?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase()))
                              ).length
                              :
                              sortResults.length
                            :
                            searchValue.length >= 1
                              ? filteredTasks.length
                              : tasksToDisplayForLead?.length
                        }
                        availableSortOptions={sortOptionsForLead}
                        sortActive={currentSortOption ? true : false}
                        handleSortOptionClick={(data) => setCurrentSortOption(data)}
                    />

                    <div className="project__Select__Wrapper">
                        <select defaultValue={''} value={currentSelectedProjectForLead} onChange={({ target }) => setCurrentSelectedProjectForLead(target.value)}>
                          <option value={''} disabled>Select project</option>
                          {
                            React.Children.toArray(
                              allProjects.map(project => {
                                return <option value={project}>{project}</option>
                              })
                            )
                          }
                        </select>
                    </div>

                    <div className="tasks-container">
                        <>
                            {
                                taskForProjectLoading ? <>
                                    <LoadingSpinner width={'2rem'} height={'2rem'} />
                                </>
                                :
                                searchValue.length >= 1 ? (
                                    React.Children.toArray(
                                    filteredTasks.map((dataitem, index) => {
                                        return (
                                        <JobCard
                                            buttonText={"View"}
                                            candidateCardView={true}
                                            candidateData={dataitem}
                                            jobAppliedFor={null}
                                            handleBtnClick={handleViewTaskBtnClick}
                                            taskView={true}
                                            className={index % 2 !== 0 ? 'remove__mar' : ''}
                                            externalLinkingEnabled={true}
                                            externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
                                        />
                                        );
                                    })
                                    )
                                ) : (
                                    currentSortOption ? (
                                    <>
                                        {
                                        React.Children.toArray(
                                            sortResults
                                            ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                            .map(result => {
                                                return <>
                                                <p className='lead__sort__Title__Item'><b>{result.name}</b></p>
                                                <>
                                                    {
                                                    React.Children.toArray(result.data.map((dataitem, index) => {
                                                        return <JobCard
                                                        buttonText={"View"}
                                                        candidateCardView={true}
                                                        candidateData={dataitem}
                                                        jobAppliedFor={null}
                                                        handleBtnClick={handleViewTaskBtnClick}
                                                        taskView={true}
                                                        className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                        externalLinkingEnabled={true}
                                                        externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
                                                        />
                                                    }))
                                                    }
                                                </>
                                                <br />
                                                </>
                                            }))
                                        }
                                    </>
                                    )
                                    :
                                    React.Children.toArray(
                                        tasksToDisplayForLead
                                        ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                        ?.map((dataitem, index) => {
                                            return (
                                                <JobCard
                                                buttonText={"View"}
                                                candidateCardView={true}
                                                candidateData={dataitem}
                                                jobAppliedFor={null}
                                                handleBtnClick={handleViewTaskBtnClick}
                                                taskView={true}
                                                className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                externalLinkingEnabled={true}
                                                externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
                                                />
                                            );
                                        })
                                    )
                                )
                            }
                        </>
                        {
                            taskForProjectLoading ? <></> 
                            :
                            <div className='JobsChanger_containter'>
                                <button
                                onClick={() =>
                                    decrementStepPagination()
                                }
                                >
                                <IoIosArrowBack />
                                </button>

                                {createArrayWithLength(
                                currentSortOption ?
                                    Math.ceil(sortResults.length / 6)
                                    :
                                    searchValue.length >= 1 ?
                                    Math.ceil(filteredTasks.length / 6)
                                    :
                                    Math.ceil(tasksToDisplayForLead?.length / 6)
                                )
                                .slice(
                                    cardPagination,
                                    cardPagination + 6
                                )
                                .map((s, index) => (
                                    <button
                                    className={s !== cardIndex ? "active" : "desactive"}
                                    onClick={() => {
                                        setCardGroupNumber(index * 6);
                                        setCardIndex(index);
                                    }}
                                    key={`${s}_button`}
                                    >
                                    {s + 1}
                                    </button>
                                ))}

                                <button
                                onClick={() =>
                                    incrementStepPagination(
                                    6,
                                    currentSortOption ?
                                        Math.ceil(sortResults.length / 6)
                                        :
                                        searchValue.length >= 1 ?
                                        Math.ceil(filteredTasks.length / 6)
                                        :
                                        Math.ceil(tasksToDisplayForLead?.length / 6)
                                    )
                                }
                                >
                                <IoIosArrowForward />
                                </button>
                            </div>
                        }
                    </div>
                    
                </>
            }
        </StaffJobLandingLayout>
    );
};


const sortOptionsForLead = [
    'date',
    'applicant',
]

export default ProjectLeadHomePage;
