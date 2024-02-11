import { useEffect } from "react";
import { getSettingUserProject } from "../../services/hrServices";
import { getSettingUserSubProject } from "../../services/adminServices";

export default function useLoadProjectAndSubproject({
    currentUser,
    projectsLoaded,
    setProjects,
    setProjectsLoaded,
    setProjectsLoading,
    subprojectsLoaded,
    setSubprojects,
    setSubProjectsLoaded,
    setSubProjectsLoading,
}) {
    useEffect(() => {
        if (!currentUser) return

        if (!projectsLoaded) {
            getSettingUserProject().then(res => {
                const projectsGotten = res.data
                    ?.filter(
                    (project) =>
                        project?.data_type ===
                        currentUser?.portfolio_info[0]?.data_type &&
                        project?.company_id === currentUser?.portfolio_info[0]?.org_id &&
                        project.project_list &&
                        project.project_list.every(
                            (listing) => typeof listing === "string"
                        )
                    )
                    ?.reverse();

                setProjectsLoaded(true);
                setProjectsLoading(false);

                if (projectsGotten.length < 1) {
                    setProjects([]);
                    return;
                }

                setProjects(projectsGotten[0]?.project_list);

            }).catch(err => {
                setProjectsLoading(false);
                setProjectsLoaded(false);
            })
        }

        if (!subprojectsLoaded) {
            getSettingUserSubProject().then(res => {
                setSubprojects(
                    res.data?.data
                    ?.filter(
                        (item) =>
                          item.company_id === currentUser?.portfolio_info[0]?.org_id &&
                          item.data_type === currentUser?.portfolio_info[0]?.data_type
                      )
                    .reverse()
                )
                setSubProjectsLoaded(true);
                setSubProjectsLoading(false);
            }).catch(err => {
                setSubProjectsLoading(false);
                setSubProjectsLoaded(false);
            })
        }

    }, [projectsLoaded, subprojectsLoaded, currentUser])
}