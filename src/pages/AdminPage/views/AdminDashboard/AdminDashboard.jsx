import { AiOutlinePlus } from "react-icons/ai";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import useLoadAdminDashboardData from "./hooks/useLoadAdminDashboardData";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MainStatCard from "./components/MainStatCard/MainStatCard";
import { FaUsers } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { ImStack } from "react-icons/im";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ApplicationCardItem from "./components/ApplicationCardItem/ApplicationCardItem";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import CompanyProgressOverview from "./components/CompanyProgressOverview/CompanyProgressOverview";
import skeletonStyles from "./styles/skeleton.module.css";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const generateOptionObj = (title, position) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: position ? position : 'top',
            },
            title: {
                display: true,
                text: title ?title : 'Chart',
            },
        },
    }
};

const AdminDashboard = ({ subAdminView }) => {
    const {
        dashboardDataLoaded, 
        setDashboardDataLoaded,
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        jobs,
        setJobs,
        projectsLoading,
        projectsLoaded, 
        setProjectsLoaded,
        setProjectsLoading,
        setProjectsAdded,
        projectsAdded,
        subProjectsAdded,
        setSubProjectsAdded,
        setSubProjectsLoaded,
        subProjectsLoading,
        setSubProjectsLoading,
        totalWorklogCountInOrg,
        setTotalWorklogCountInOrg,
    } = useJobContext();
    const { currentUser } = useCurrentUserContext();
    const navigate = useNavigate();
    const [ greeting, setGreeting ] = useState('');
    const [ logOverviewDataFilter, setLogOverviewDataFilter ] = useState('today');
    const [ logOverviewData, setLogOverviewData ] = useState(null)
    const [ logOverviewData2, setLogOverviewData2 ] = useState(null)

    useLoadAdminDashboardData(
        dashboardDataLoaded,
        currentUser,
        setProjectsAdded,
        setProjectsLoading,
        setProjectsLoaded,
        setSubProjectsLoading,
        setSubProjectsLoaded,
        setSubProjectsAdded,
        setApplications,
        setApplicationsLoaded,
        setJobs,
        setTotalWorklogCountInOrg,
        setDashboardDataLoaded
    )

    useEffect(() => {
        setLogOverviewData({
            labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6', 'Project 7', 'Project 8', 'Project 9', 'Project 10'],
            datasets: [
                {
                    label: 'Logs Count',
                    data: [129, 50, 150, 300, 39, 45, 200, 63, 80, 33, 290],
                    backgroundColor: '#005734',
                    maxBarThickness: 40,
                    borderRadius: 8,
                },
            ]
        })

        setLogOverviewData2({
            labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6', 'Project 7', 'Project 8', 'Project 9', 'Project 10'],
            datasets: [
                {
                    label: 'Logs Count',
                    data: [19, 10, 10, 50, 19, 15, 20, 23, 20, 3, 90],
                    backgroundColor: '#005734',
                    maxBarThickness: 40,
                    borderRadius: 8,
                },
            ]
        })

        // set greeting
        const time = new Date().getHours();
        if (time < 10) return setGreeting("Good morning");
        if (time < 20) return setGreeting("Good day");
        
        setGreeting("Good evening");

    }, [])
    
    return <>
        <StaffJobLandingLayout
            adminView={true}
            subAdminView={subAdminView}
            adminAlternativePageActive={true}
            pageTitle={'Dashboard'}
        >
            <section className={styles.admin__Dash}>
                <section className={styles.top__Nav__Content}>
                    <h2>
                        <span className={styles.user__Title}>Hello {currentUser?.userinfo?.first_name} {currentUser?.userinfo?.last_name},</span>
                        <span>{greeting}</span>
                    </h2>
                    <button
                        onClick={
                            subAdminView ? 
                                () => navigate('/add-job')
                            :
                            () => navigate('/add')
                        }
                    >
                        <AiOutlinePlus />
                        <span>Add</span>
                    </button>
                </section>
                <section className={styles.top__Stats__Wrap}>
                    <MainStatCard 
                        icon={<FaUsers />}
                        title={'Total Applications'}
                        dataLoading={!applicationsLoaded}
                        dataLoaded={applicationsLoaded}
                        data={applications?.length}
                        action={subAdminView ? null : '/all-applications'}
                    />
                    <MainStatCard 
                        icon={<MdOutlineWorkOutline />}
                        title={'Total Jobs'}
                        dataLoading={!dashboardDataLoaded}
                        dataLoaded={jobs?.length}
                        data={jobs.length}
                        action={'/jobs'}
                    />
                    <MainStatCard 
                        icon={<GoTasklist />}
                        title={'Total Projects'}
                        dataLoading={projectsLoading}
                        dataLoaded={projectsLoaded}
                        data={projectsAdded[0]?.project_list?.length}
                        action={'/add'}
                        locationState={'showProject'}
                    />
                    <MainStatCard 
                        icon={<ImStack />}
                        title={'Total Logs'}
                        action={'/logs'}
                        dataLoading={!dashboardDataLoaded}
                        dataLoaded={dashboardDataLoaded}
                        data={totalWorklogCountInOrg}
                    />
                </section>
                <section className={styles.stat__overview}>
                    <h2 className={styles.stat__mini__Title}>Logs Overview</h2>
                    <select 
                        value={logOverviewDataFilter} 
                        onChange={({ target }) => setLogOverviewDataFilter(target.value)}
                        className={styles.log__Filter}
                    >
                        <option value={'today'}>Today</option>
                        <option value={'this month'}>This Month</option>
                    </select>
                    {
                        (!logOverviewData || !logOverviewData2) ? <></> 
                        :
                        <Bar 
                            options={generateOptionObj(`Log Overview for ${logOverviewDataFilter}`)} 
                            data={
                                logOverviewDataFilter === 'today' ?
                                    logOverviewData2
                                :
                                logOverviewDataFilter === 'this month' ?
                                    logOverviewData
                                :
                                {
                                    datasets: [],
                                    labels: []
                                }
                            } 
                        />
                    }
                </section>
                <section className={styles.bottom__Stats__Nav}>
                    <section className={styles.application__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Recent Applications</h2>
                        <div className={styles.applications__WRap__Items}>
                            {
                                applicationsLoaded ?
                                    React.Children.toArray(applications.slice(0, 4).map((application, index) => {
                                        return <ApplicationCardItem 
                                            application={application}
                                            greyJobCardColor={(index + 1) % 2 === 0 ? true : false}
                                        />
                                    }))
                                :
                                    <ApplicationCardItem 
                                        loading={!applicationsLoaded}
                                    />
                            }
                        </div>
                    </section>
                    <section className={styles.company__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Company Overview</h2>
                        <div className={`${styles.company__Overview__Wrap} ${!dashboardDataLoaded ? skeletonStyles.skeleton : ''}`}>
                            {
                                !dashboardDataLoaded ? <>
                                    <div style={{ width: '100%', height: '10rem', borderRadius: 8}}></div>
                                </> :
                                <>
                                    <div>
                                        <h2 className={styles.comp__mini__Title}>Active jobs</h2>
                                        <CompanyProgressOverview 
                                            tooltipId={'active_jobs'}
                                            toolTipContent={`You currently have ${jobs?.filter(job => job.is_active)?.length} active jobs out of ${jobs?.length} jobs`}
                                            value={jobs?.length < 1 ? 0 : Number(jobs?.filter(job => job.is_active)?.length) / ( Number(jobs?.length) ) * 100}
                                        />
                                    </div>
                                    <div>
                                        <h2 className={styles.comp__mini__Title}>Active Applicants</h2>
                                        <CompanyProgressOverview 
                                            tooltipId={'active_users'}
                                            toolTipContent={`You currently have ${applications?.filter(application => application.status === candidateStatuses.ONBOARDING)?.length} hired users out of ${applications?.length} applications`}
                                            value={applications?.length < 1 ? 0 : Number(applications?.filter(application => application.status === candidateStatuses.ONBOARDING)?.length) / ( Number(applications?.length) ) * 100}
                                        />
                                    </div>    
                                </>
                            }
                        </div>
                    </section>
                    <section className={styles.project__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Project Overview</h2>
                        <div className={`${styles.project__item} ${projectsLoading ? skeletonStyles.skeleton : ''}`}>
                            <h3>{projectsLoading ? '' : projectsAdded[0]?.project_list?.length}</h3>
                            <p>{projectsLoading ? '' : 'total projects'}</p>
                        </div>
                        <div className={`${styles.project__item} ${styles.grey__Bg} ${subProjectsLoading ? skeletonStyles.skeleton : ''}`}>
                            <h3>{subProjectsLoading ? '' : subProjectsAdded?.length}</h3>
                            <p>{subProjectsLoading ? '' : 'total subprojects'}</p>
                        </div>
                    </section>
                </section>
            </section>
        </StaffJobLandingLayout>
    </>
}

export default AdminDashboard;