import React, { useState, useEffect } from 'react';
import './Job.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNavigationContext } from '../../../../contexts/NavigationContext';
import ErrorPage from '../../../ErrorPage/ErrorPage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { jobKeys } from '../../../AdminPage/utils/jobKeys';
import TogglerNavMenuBar from '../../../../components/TogglerNavMenuBar/TogglerNavMenuBar';
import JobCard from '../../../../components/JobCard/JobCard';
import TitleNavigationBar from '../../../../components/TitleNavigationBar/TitleNavigationBar';
import { changeToTitleCase } from '../../../../helpers/helpers';
import { useCandidateJobsContext } from '../../../../contexts/CandidateJobsContext';
import { getAppliedJobs, getCandidateApplication, getCandidateTask, getJobs } from '../../../../services/candidateServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { useJobContext } from '../../../../contexts/Jobs';
import { SettingsAccessibility } from '@mui/icons-material';
import { IoMdRefresh } from 'react-icons/io';
import { getCandidateApplicationsForHr } from '../../../../services/hrServices';
import notFOundImage from '../../../../assets/images/user-not-found.jpg';

function JobScreen() {
    const { jobs, setJobs } = useJobContext();
    const [jobsLoading, setJobsLoading] = useState(true);
    const { candidateJobs, setCandidateJobs } = useCandidateJobsContext();
    const navigate = useNavigate();
    const { section } = useNavigationContext();
    const [isLoading, setLoading] = useState(true);
    const [allRequestsDone, setAllRequestsDone] = useState(false);
    const [jobsMatchingCategory, setJobsMatchingCategory] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("all");
    const [params, setParams] = useSearchParams();
    const [jobSelectionHasCategory, setJobSelectionHasCategory] = useState(false);
    const [jobSelectionCategories, setJobSelectionCategories] = useState(null);
    const [currentJobCategory, setCurrentJobCategory] = useState(null);
    const [jobsToDisplay, setJobsToDisplay] = useState([]);
    const { currentUser, isPublicUser, publicUserDetails, isProductUser, productUserDetails,  } = useCurrentUserContext();
    console.log(jobs);
    useEffect(() => {
        // console.log(jobs);
        // const findJobsMatchingCategory = (category) => jobs.filter(job => job.job_category.toLocaleLowerCase().includes(category.toLocaleLowerCase()) || category.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase()));
        // const findJobsMatchingCategory = (category) => jobs.filter(job => console.log(category));
        const findJobsMatchingCategory = (category) => jobs.filter(job => {

            // if (job.job_category && category) {
            //     return job.job_category.toLocaleLowerCase().includes(category.toLocaleLowerCase()) || category.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase());
            // } else {
            //     return false;
            // }

            return new Promise((resolve, reject) => {
                const matchedJobs = jobs.filter(job => {
                    if (job.job_category && category) {
                        return job.job_category.toLocaleLowerCase().includes(category.toLocaleLowerCase()) || category.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase());
                    } else {
                        return false;
                    }
                });
                resolve(matchedJobs);
            });
        });
        const jobCategoryParam = params.get('jobCategory');
        const currentJobStream = params.get('stream');
        // console.log(jobs);
        if (jobCategoryParam) {
            setCurrentCategory(jobCategoryParam);
            if (jobCategoryParam === "all") return setJobsMatchingCategory(jobs);
            setJobSelectionHasCategory(true);

            const matchedJobs = findJobsMatchingCategory(jobCategoryParam);
            setJobsMatchingCategory(matchedJobs);
            // console.log(matchedJobs)

            if (jobCategoryParam === "Internship") {
                setJobSelectionCategories(["Full time", "Part time"])
                const jobsToDisplayForCurrentCategory = matchedJobs.filter(job => job.type_of_job === currentJobCategory);
                console.log(jobsToDisplayForCurrentCategory);
                if (jobsToDisplayForCurrentCategory.length === 0) return setJobsToDisplay(jobs.filter(job => job.job_category.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase())))
                setJobsToDisplay(jobsToDisplayForCurrentCategory);
            }

            if (jobCategoryParam === "Employee") {
                setJobSelectionCategories(["Full time"])
                const jobsToDisplayForCurrentCategory = matchedJobs.filter(job => job.type_of_job === currentJobCategory);
                console.log(jobsToDisplayForCurrentCategory);
                if (jobsToDisplayForCurrentCategory.length === 0) return setJobsToDisplay(jobs.filter(job => job.job_category.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase())))
                setJobsToDisplay(jobsToDisplayForCurrentCategory);
            }

            if (jobCategoryParam === "Research Associate") {
                setJobSelectionCategories(["Full time", "Part time"])
                const jobsToDisplayForCurrentCategory = matchedJobs.filter(job => job.others[jobKeys.othersResearchAssociateJobType] === currentJobCategory);
                if (jobsToDisplayForCurrentCategory.length === 0) return setJobsToDisplay(jobs.filter(job => job.typeof.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.typeof.toLocaleLowerCase())))
                setJobsToDisplay(jobsToDisplayForCurrentCategory);
            }

            if (jobCategoryParam === "Freelancer") {
                setJobSelectionCategories(["Task based", "Time based"])
                const jobsToDisplayForCurrentCategory = matchedJobs?.filter(job => job.type_of_job === currentJobCategory);
                if (jobsToDisplayForCurrentCategory.length === 0) return setJobsToDisplay(jobs.filter(job => job.job_category.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase())))
                setJobsToDisplay(jobsToDisplayForCurrentCategory);
            }

            return;
        }

    }, [jobs, params])

    useEffect(() => {

        if (!jobSelectionCategories) return
        setCurrentJobCategory(jobSelectionCategories[0]);

    }, [jobSelectionCategories])

    useEffect(() => {
        if (!currentJobCategory) return
        if (currentCategory === "Internship") {
            const matchedJobs = jobsMatchingCategory.filter(job => job.type_of_job === currentJobCategory);
            if (matchedJobs.length === 0) return setJobsToDisplay(jobs?.filter(job => job.job_category.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase())))
            setJobsToDisplay(matchedJobs);
        }

        if (currentCategory === "Employee") return

        if (currentCategory === "Research Associate") {

            const matchedJobs = jobsMatchingCategory.filter(job => job.others[jobKeys.othersResearchAssociateJobType] === currentJobCategory);
            if (matchedJobs.length === 0) return setJobsToDisplay(jobs?.filter(job => job.typeof.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.typeof.toLocaleLowerCase())))
            setJobsToDisplay(matchedJobs);

        }

        if (currentCategory === "Freelancer") {
            const matchedJobs = jobsMatchingCategory.filter(job => job.type_of_job === currentJobCategory);
            if (matchedJobs.length === 0) return setJobsToDisplay(jobs?.filter(job => job.job_category.toLocaleLowerCase().includes(currentCategory.toLocaleLowerCase()) || currentCategory.toLocaleLowerCase().includes(job.job_category.toLocaleLowerCase())))
            setJobsToDisplay(matchedJobs);
        }

    }, [currentJobCategory])

    // useEffect(() => {
    //     if (jobs.length > 0) {
    //         setAllRequestsDone(true);
    //         setJobsLoading(false);
    //         return
    //     }
    //     const datass = currentUser.portfolio_info[0].org_id;
    //     getJobs(datass).then(res => {
    //         // setJobs(res.data.sort((a, b) => a.title.localeCompare(b.title)));
    //         const filterJob = res.data.response.data.filter(job => job.data_type === currentUser?.portfolio_info[0].data_type);
    //         setJobs(filterJob.sort((a, b) => a.job_title.localeCompare(b.job_title)));
    //         setJobsLoading(false);
    //         // setAllRequestsDone(true);
    //     }).catch(err => {
    //         console.log(err);
    //         setJobsLoading(false)
    //         setAllRequestsDone(true);
    //     })

    //     if (!currentUser) return setLoading(false);
    //     if (Array.isArray(candidateJobs.appliedJobs) && candidateJobs.appliedJobs.length > 0) return setLoading(false);

    //     getAppliedJobs(datass).then(res => {
    //         const userApplication = res.data.response.data?.filter(
    //             (application) => application.data_type === currentUser?.portfolio_info[0].data_type
    //         )
    //         const currentUserAppliedJobs = userApplication?.filter(
    //             (application) =>
    //                 application.username === currentUser.userinfo.username
    //         );

    //         setCandidateJobs((prevJobs) => { return { ...prevJobs, "appliedJobs": currentUserAppliedJobs } });
    //         //setLoading(false);
    //         setAllRequestsDone(true);

    //     }).catch(err => {
    //         console.log(err);
    //         //  setLoading(false);
    //         setAllRequestsDone(true);
    //     })

    // }, []);

    useEffect(() => {
        if (jobs.length > 0) {
            setAllRequestsDone(true);
            setJobsLoading(false);
            return;
        }

        if (!currentUser) {
            if (!isPublicUser && !isProductUser) {
                setAllRequestsDone(true);
                setJobsLoading(false);
                return
            }

            const [
                companyIdToUse,
                dataTypeToUse,
            ] = [
                isPublicUser ? publicUserDetails?.company_id : productUserDetails?.company_id,
                isPublicUser ? publicUserDetails?.data_type : productUserDetails?.data_type,
            ]

            getJobs(companyIdToUse).then(res => {
                const filterJob = res.data.response.data.filter(job => job.data_type === dataTypeToUse);
                setJobs(filterJob.sort((a, b) => new Date(b.created_on) - new Date(a.created_on)));

            }).catch(err => {
                console.log(err);
            })

            setJobsLoading(false);
            setAllRequestsDone(true);

            return
        }

        const datass = currentUser.portfolio_info[0].org_id;

        Promise.all([
            getJobs(datass),
            getAppliedJobs(datass)
        ]).then(([jobsResponse, appliedJobsResponse]) => {
            const filterJob = jobsResponse.data.response.data.filter(job => job.data_type === currentUser?.portfolio_info[0].data_type);
            setJobs(filterJob.sort((a, b) => new Date(b.created_on) - new Date(a.created_on)));

            setJobsLoading(false);
            setAllRequestsDone(true);

            const userApplication = appliedJobsResponse.data.response.data?.filter(
                (application) => application.data_type === currentUser?.portfolio_info[0].data_type
            )
            const currentUserAppliedJobs = userApplication?.filter(
                (application) =>
                    application.username === currentUser.userinfo.username
            );

            setCandidateJobs((prevJobs) => { return { ...prevJobs, "appliedJobs": currentUserAppliedJobs } });
        }).catch(err => {
            console.log(err);
            setJobsLoading(false)
            setAllRequestsDone(true);
        });

        if (!currentUser) return setLoading(false);
        if (Array.isArray(candidateJobs.appliedJobs) && candidateJobs.appliedJobs.length > 0) return setLoading(false);
    }, []);



    useEffect(() => {
        if (!allRequestsDone) return;
        setLoading(false);
    }, [allRequestsDone])

    const handleApplyButtonClick = (currentJob) => {
        navigate(`/apply/job/${currentJob._id}`, { state: { currentUser: currentUser } })
    }

    const handleRefreshForCandidateApplications = () => {
        if (!currentUser) {
            setJobsLoading(true);

            const [
                companyIdToUse,
                dataTypeToUse,
            ] = [
                isPublicUser ? publicUserDetails?.company_id : productUserDetails?.company_id,
                isPublicUser ? publicUserDetails?.data_type : productUserDetails?.data_type,
            ]

            getJobs(companyIdToUse).then(res => {
                const filterJob = res.data.response.data.filter(job => job.data_type === dataTypeToUse);
                setJobs(filterJob.sort((a, b) => new Date(b.created_on) - new Date(a.created_on)));
                setJobsLoading(false);
                setAllRequestsDone(true);
            }).catch(err => {
                console.log(err);
                setJobsLoading(false);
                setAllRequestsDone(true);
            })

            return
        }

        const datass = currentUser.portfolio_info[0].org_id;
        setJobsLoading(true);
        Promise.all([
            getJobs(datass),
            getAppliedJobs(datass)
        ]).then(([jobsResponse, appliedJobsResponse]) => {
            const filterJob = jobsResponse.data.response.data.filter(job => job.data_type === currentUser?.portfolio_info[0].data_type);
            setJobs(filterJob.sort((a, b) => new Date(b.created_on) - new Date(a.created_on)));

            setJobsLoading(false);
            setAllRequestsDone(true);

            const userApplication = appliedJobsResponse.data.response.data?.filter(
                (application) => application.data_type === currentUser?.portfolio_info[0].data_type
            )
            const currentUserAppliedJobs = userApplication?.filter(
                (application) =>
                    application.username === currentUser.userinfo.username
            );

            setCandidateJobs((prevJobs) => { return { ...prevJobs, "appliedJobs": currentUserAppliedJobs } });
        }).catch(err => {
            console.log(err);
            setJobsLoading(false)
            setAllRequestsDone(true);
        });

        if (!currentUser) return setLoading(false);
        if (Array.isArray(candidateJobs.appliedJobs) && candidateJobs.appliedJobs.length > 0) return setLoading(false);
    }

    return <div className='candidate__Jobs__Wrapper'>

        {
            isLoading ? <LoadingSpinner /> :

                isProductUser && productUserDetails.onlySingleJobCategoryPermitted && (productUserDetails.categoryPassed !== currentCategory) ? <>
                    <TitleNavigationBar 
                        title={`Category not found`} 
                        showSearchBar={false} 
                        handleBackBtnClick={() => navigate(`/jobs/?jobCategory=${productUserDetails.categoryPassed}`)}
                    />
                    <div className='category__Not__Found'>
                        <img src={notFOundImage} alt='not found illustration' />
                    </div>
                </> :
                <>
                    <TitleNavigationBar 
                        title={`${changeToTitleCase(currentCategory)} Jobs`} 
                        hideBackBtn={isProductUser && productUserDetails.onlySingleJobCategoryPermitted ? true : false} 
                        showSearchBar={true} 
                        handleBackBtnClick={() => currentCategory ? navigate(-1) : navigate("/home")} 
                    />

                    <div className='candidate__Jobs__Container'>
                        {/* <div className="refresh-container" onClick={handleRefreshForCandidateApplications} id='refresh-container'>
                            <IoMdRefresh />
                        </div> */}
                        <button
                            className="refresh-container"
                            id='refresh-container'
                            onClick={handleRefreshForCandidateApplications}
                        >
                            <div className="refresh-btn">
                                <IoMdRefresh />
                                <p>Refresh</p>
                            </div>
                        </button>
                        {
                            jobsLoading || !jobSelectionHasCategory ? <></> :
                                <TogglerNavMenuBar className={`candidate__Job__Selections__Toggler ${currentCategory.toLocaleLowerCase() === "employee" ? "single__Item" : ""}`} menuItems={jobSelectionCategories} currentActiveItem={currentJobCategory} handleMenuItemClick={(item) => setCurrentJobCategory(item)} />
                        }

                        <div className='all__Current__Jobs__Container'>
                            {
                                section == undefined || section === "home" ? <>
                                    {
                                        jobsLoading ? <LoadingSpinner /> :

                                            jobsToDisplay.length === 0 ? <>No '{currentCategory}' jobs currently available</> :

                                                jobsToDisplay.length >= 1 && currentCategory !== "all" && jobsToDisplay.every(job => !job.is_active) ? <>No '{currentCategory}' jobs currently available</> :

                                                    React.Children.toArray(jobsToDisplay.map(job => {

                                                        if (!job.is_active) return <></>
                                                        return <><JobCard
                                                            job={job}
                                                            candidateViewJob={true}
                                                            subtitle={currentCategory}
                                                            disableActionBtn={
                                                                currentUser ? 
                                                                    candidateJobs.appliedJobs.find(appliedJob => appliedJob.job_number === job.job_number) == undefined ? false : true 
                                                                :
                                                                isProductUser ?
                                                                    productUserDetails?.jobsAppliedFor?.includes(job._id) ? true : false   
                                                                : false
                                                            }
                                                            buttonText={
                                                                currentUser ? 
                                                                    candidateJobs.appliedJobs.find(appliedJob => appliedJob.job_number === job.job_number) == undefined ? "Apply" : "Applied" 
                                                                : 
                                                                isProductUser ?
                                                                    productUserDetails?.jobsAppliedFor?.includes(job._id) ? "Applied" : 'Apply'  :
                                                                "Apply"
                                                            }
                                                            handleBtnClick={(job) => handleApplyButtonClick(job)}
                                                        />
                                                        </>
                                                    }))
                                    }
                                </> :
                                    <>
                                        <ErrorPage disableNav={true} />
                                    </>
                            }
                        </div>
                    </div>
                </>
        }

    </div>
}

export default JobScreen