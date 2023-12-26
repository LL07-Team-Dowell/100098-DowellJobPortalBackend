import { useEffect } from "react";
import { getSettingUserProject } from "../../../../../services/hrServices";
import { getApplicationForAdmin, getJobsFromAdmin, getSettingUserSubProject, getTotalWorklogCountInOrganization, getWorklogDetailInOrganization } from "../../../../../services/adminServices";

export default function useLoadAdminDashboardData(
    dataLoaded, 
    userDetail,
    updateProjects,
    updateProjectsLoadingState,
    updateProjectsLoadedState,
    updateSubProjectsLoadingState,
    updateSubProjectsLoadedState,
    updateSubprojects,
    updateApplications,
    updateApplicationsLoadedState,
    updateJobs,
    updateWorklogCountInOrganization,
    updateWorklogLogDataForToday,
    updateWorklogLogDataForMonth,
    updateDataLoaded,
) {
    useEffect(() => {
        if (dataLoaded || !userDetail) return
      
        Promise.all([
            getSettingUserProject(),
            getSettingUserSubProject(),
            getApplicationForAdmin(userDetail?.portfolio_info[0]?.org_id),
            getJobsFromAdmin(userDetail?.portfolio_info[0]?.org_id),
            getTotalWorklogCountInOrganization(userDetail?.portfolio_info[0]?.org_id),
            getWorklogDetailInOrganization('logs_for_today', userDetail?.portfolio_info[0]?.org_id),
            getWorklogDetailInOrganization('logs_for_month', userDetail?.portfolio_info[0]?.org_id),
        ]).then(res => {

            const projectsGotten = res[0]?.data
              ?.filter(
                (project) =>
                  project?.data_type === userDetail?.portfolio_info[0]?.data_type &&
                  project?.company_id === userDetail?.portfolio_info[0]?.org_id &&
                  project.project_list &&
                  project.project_list.every(
                    (listing) => typeof listing === "string"
                  )
              )
              ?.reverse()
      
            if (projectsGotten.length > 0) {
                updateProjects(projectsGotten);
            }
            updateProjectsLoadingState(false);
            updateProjectsLoadedState(true);
      
            updateSubprojects(
                res[1]?.data?.data
                ?.filter(item => 
                    item.company_id === userDetail?.portfolio_info[0]?.org_id &&
                    item.data_type === userDetail?.portfolio_info[0]?.data_type
                )
                ?.reverse()
            );
            updateSubProjectsLoadingState(false);
            updateSubProjectsLoadedState(true);

            const applicationsFetched = res[2]?.data?.response?.data?.filter(
                (item) => userDetail?.portfolio_info[0]?.data_type === item.data_type
            )?.reverse()

            updateApplications(applicationsFetched)
            updateApplicationsLoadedState(true);

            updateJobs(
                res[3]?.data?.response?.data
                ?.reverse()
                ?.filter(
                    (job) =>
                    job.data_type === userDetail?.portfolio_info[0]?.data_type
                )
                ? res[3]?.data?.response?.data
                    ?.reverse()
                    ?.filter(
                        (job) =>
                        job.data_type === userDetail?.portfolio_info[0]?.data_type
                    )
                    .reverse()
                : []
            );

            updateWorklogCountInOrganization(res[4]?.data?.worklogs_count);

            const [ 
                projectLabelsForToday,
                projectLabelsForMonth, 
                projectCountForToday,
                projectCountForMonth, 
            ] = [
                Object.keys(res[5]?.data?.logs_for_today || {}),
                Object.keys(res[6]?.data?.logs_for_month || {}),
                Object.values(res[5]?.data?.logs_for_today || {}),
                Object.values(res[6]?.data?.logs_for_month || {}),
            ];

            updateWorklogLogDataForToday({
                labels: projectLabelsForToday,
                datasets: [
                    {
                        label: 'Logs Count',
                        data: projectCountForToday,
                        backgroundColor: '#005734',
                        maxBarThickness: 40,
                        borderRadius: 5,
                    },
                ]
            });

            updateWorklogLogDataForMonth({
                labels: projectLabelsForMonth,
                datasets: [
                    {
                        label: 'Logs Count',
                        data: projectCountForMonth,
                        backgroundColor: '#005734',
                        maxBarThickness: 40,
                        borderRadius: 5,
                    },
                ]
            });

            updateDataLoaded(true);

        }).catch(err => {
            console.log(err);

            updateProjectsLoadingState(false);
            updateSubProjectsLoadingState(false);
        })

    }, [dataLoaded, userDetail])
}