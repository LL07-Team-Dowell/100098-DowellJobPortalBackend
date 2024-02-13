import { useEffect } from "react";
import { getSettingUserProject } from "../../../../../services/hrServices";
import { getJobsFromAdmin, getSettingUserSubProject } from "../../../../../services/adminServices";

export default function useLoadAdminDashboardData(
    dataLoaded, 
    userDetail,
    updateProjects,
    updateProjectsLoadingState,
    updateProjectsLoadedState,
    updateSubProjectsLoadingState,
    updateSubProjectsLoadedState,
    updateSubprojects,
    updateJobs,
    updateDataLoaded,
) {
    useEffect(() => {
        if (dataLoaded || !userDetail) return
      
        Promise.all([
            getSettingUserProject(),
            getSettingUserSubProject(),
            getJobsFromAdmin(userDetail?.portfolio_info[0]?.org_id),
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

            updateJobs(
                res[2]?.data?.response?.data
                ?.reverse()
                ?.filter(
                    (job) =>
                    job.data_type === userDetail?.portfolio_info[0]?.data_type
                )
                ? res[2]?.data?.response?.data
                    ?.reverse()
                    ?.filter(
                        (job) =>
                        job.data_type === userDetail?.portfolio_info[0]?.data_type
                    )
                    .reverse()
                : []
            );

            updateDataLoaded(true);

        }).catch(err => {
            console.log(err);

            updateProjectsLoadingState(false);
            updateSubProjectsLoadingState(false);
        })

    }, [dataLoaded, userDetail])
}