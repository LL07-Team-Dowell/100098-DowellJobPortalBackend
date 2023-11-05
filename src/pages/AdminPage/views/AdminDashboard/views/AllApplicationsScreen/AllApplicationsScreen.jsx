import { useEffect } from "react";
import { useJobContext } from "../../../../../../contexts/Jobs";
import StaffJobLandingLayout from "../../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import { getApplicationForAdmin } from "../../../../../../services/adminServices";
import { useCurrentUserContext } from "../../../../../../contexts/CurrentUserContext";
import styles from './styles.module.css';
import SearchBar from "../../../../../../components/SearchBar/SearchBar";
import React, { useState } from "react";
import FullApplicationCardItem from "../../components/FullApplicationCardItem/FullApplicationCardItem";
import { getSettingUserProject } from "../../../../../../services/hrServices";
import Select from "react-select";
import { changeToTitleCase } from "../../../../../../helpers/helpers";
import { candidateStatuses } from "../../../../../CandidatePage/utils/candidateStatuses";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { createArrayWithLength } from "../../../Landingpage/LandingPage";
import { JOB_APPLICATION_CATEGORIES } from "../../../../../CandidatePage/utils/jobCategories";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const AllApplicationsScreen = () => {
    const {
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        projectsAdded,
        setProjectsAdded,
        projectsLoaded,
        setProjectsLoaded,
        projectsLoading,
        setProjectsLoading,
    } = useJobContext();
    const { currentUser } = useCurrentUserContext();
    const [ searchValue, setSearchValue ] = useState('');
    const [ projectAssignedFilter, setProjectAssignedFilter ] = useState([]);
    const [ currentApplicationCategory, setCurrentApplicationCategory ] = useState([]);
    const [ statusFilter, setStatusFilter ] = useState('All');
    const [cardPagination, setCardPagination] = useState(0);
    const [cardIndex, setCardIndex] = useState(0);
    const [cardGroupNumber, setCardGroupNumber] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!applicationsLoaded) {
            getApplicationForAdmin(currentUser?.portfolio_info[0]?.org_id).then(res => {
                const applicationsFetched = res?.data?.response?.data?.filter(
                    (item) => currentUser?.portfolio_info[0]?.data_type === item.data_type
                )?.reverse()

                setApplications(applicationsFetched);
                setApplicationsLoaded(true);
            }).catch(err => {
                console.log('Failed to get applications for admin');
            })
        }
        if (!projectsLoaded) {
            setProjectsLoading(true);

            getSettingUserProject().then(res => {
                const projectsGotten = res?.data
                ?.filter(
                  (project) =>
                    project?.data_type === currentUser?.portfolio_info[0]?.data_type &&
                    project?.company_id === currentUser?.portfolio_info[0]?.org_id &&
                    project.project_list &&
                    project.project_list.every(
                      (listing) => typeof listing === "string"
                    )
                )
                ?.reverse()
        
                if (projectsGotten.length > 0) {
                    setProjectsAdded(projectsGotten);
                }
                
                setProjectsLoading(false);
                setProjectsLoaded(true);

            }).catch(err => {
                console.log('Failed to get projects for admin');
                setProjectsLoading(false);
            })
        }
    }, [])

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

    return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Applications'}
        >
            <div className={styles.wrapper}>
                
                <div className={styles.header__item}>
                    <div className={styles.header__Content}>
                        <div className={styles.back__Icon} onClick={() => navigate(-1)}>
                            <ArrowBackIos fontSize="1.2rem" />
                        </div>
                        <h2>Users</h2>
                    </div>
                    <SearchBar 
                        searchValue={searchValue}
                        handleSearchChange={setSearchValue}
                        placeholder={'Search user'}
                    />
                </div>
                <div className={styles.applications__Filter}>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by status</p>
                        <Select 
                            value={{ label: changeToTitleCase(statusFilter.replace('_', ' ')), value: statusFilter }}
                            options={[
                                { label: 'All', value: 'All'},
                                { label: 'Pending', value: 'Pending'},
                                { label: 'Guest Pending', value: 'Guest_Pending'},
                                { label: 'Shortlisted', value: 'shortlisted'},
                                { label: 'Selected', value: 'selected'},
                                { label: 'Hired', value: 'hired'},
                                { label: 'Rejected', value: 'Rejected'},
                                { label: 'Removed', value: 'Removed'},
                            ]}
                            onChange={(val) => {
                                    setStatusFilter(val.value);
                                    setCardPagination(0);
                                    setCardIndex(0);
                                }
                            }
                            className={styles.item__Filter}
                        />
                    </div>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by project</p>
                        <Select 
                            options={
                                projectsLoaded && projectsAdded[0] && projectsAdded[0]?.project_list ?
                                    [
                                        ...projectsAdded[0]?.project_list?.sort((a, b) => a.localeCompare(b))?.map(project => { return { label: project, value: project }})
                                    ]
                                :
                                []
                            }
                            isMulti={true}
                            onChange={(val) => setProjectAssignedFilter(val.map(item => item.value))}
                            className={styles.item__Filter}
                        />
                    </div>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by category</p>
                        <Select 
                            options={
                                [
                                    ...JOB_APPLICATION_CATEGORIES.map(category => {  return { label: category, value: category } }) 
                                ]
                            }
                            isMulti={true}
                            onChange={(val) => setCurrentApplicationCategory(val.map(item => item.value))}
                            className={styles.item__Filter}
                        />
                    </div>
                </div>
                <div className={styles.applications__Wrap}>
                    {
                        React.Children.toArray(
                            applications
                            .filter(application => {
                                if (currentApplicationCategory.length < 1) return true
                                return currentApplicationCategory.includes(application.job_category)
                            })
                            .filter(application => {
                                if (statusFilter === 'All') return true
                                return application.status === statusFilter
                            })
                            .filter(application => {
                                if (projectAssignedFilter.length < 1) return true
                                return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                            })
                            .filter(application => {
                                if (searchValue.length < 1) return true
                                return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                            })
                            ?.slice(cardIndex, cardIndex + 8)
                            .map(application => {
                                return <FullApplicationCardItem 
                                    application={application} 
                                    activeStatus={application.status === candidateStatuses.ONBOARDING}
                                />
                            })
                        )
                    }
                </div>
                <div className='JobsChanger_containter'>
                    <button
                        onClick={() =>
                            decrementStepPagination()
                        }
                    >
                        <IoIosArrowBack />
                    </button>

                    {createArrayWithLength(
                        Math.ceil(
                            applications
                            .filter(application => {
                                if (currentApplicationCategory.length < 1) return true
                                return currentApplicationCategory.includes(application.job_category)
                            })
                            .filter(application => {
                                if (statusFilter === 'All') return true
                                return application.status === statusFilter
                            })
                            .filter(application => {
                                if (projectAssignedFilter.length < 1) return true
                                return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                            })
                            .filter(application => {
                                if (searchValue.length < 1) return true
                                return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                            })?.length / 8
                        )
                    )
                    .slice(
                        cardPagination,
                        cardPagination + 8
                    )
                    .map((s, index) => (
                        <button
                        className={s !== cardIndex ? "active" : "desactive"}
                        onClick={() => {
                            setCardGroupNumber(index * 4);
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
                                8,
                                Math.ceil(
                                    applications
                                    .filter(application => {
                                        if (currentApplicationCategory.length < 1) return true
                                        return currentApplicationCategory.includes(application.job_category)
                                    })
                                    .filter(application => {
                                        if (statusFilter === 'All') return true
                                        return application.status === statusFilter
                                    })
                                    .filter(application => {
                                        if (projectAssignedFilter.length < 1) return true
                                        return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                                    })
                                    .filter(application => {
                                        if (searchValue.length < 1) return true
                                        return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                                    })?.length / 8
                                )
                            )
                        }
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
        </StaffJobLandingLayout>
    </>
}

export default AllApplicationsScreen;