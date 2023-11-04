import { useEffect } from "react";
import { getSettingUserProject } from "../../../../../services/hrServices";
import { getApplicationForAdmin, getJobsFromAdmin, getSettingUserSubProject, getTotalWorklogCountInOrganization } from "../../../../../services/adminServices";

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
                res[1]?.data?.data?.filter(item => item.company_id === userDetail?.portfolio_info[0]?.org_id)
                .filter(item => item.data_type === userDetail?.portfolio_info[0]?.data_type)
                .reverse()
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

            updateDataLoaded(true);

        }).catch(err => {
            console.log(err);

            updateProjectsLoadingState(false);
            updateSubProjectsLoadingState(false);
        })

    }, [dataLoaded, userDetail])
}