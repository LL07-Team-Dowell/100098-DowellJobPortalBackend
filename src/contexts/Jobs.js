import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUserContext } from "./CurrentUserContext";
import { getSettingUserProject } from "../services/hrServices";
import { getSettingUserSubProject } from "../services/adminServices";

const JobContext = createContext();

export const useJobContext = () => {
  return useContext(JobContext);
};

export const JobContextProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [list, setlist] = useState([]);
  const [jobs2, setjobs2] = useState([]);
  const [resp, setresponse] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const [jobLinks, setJobLinks] = useState([]);
  const [projectsAdded, setProjectsAdded] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [productLinks, setProductLinks] = useState([]);
  const [subProjectsAdded, setSubProjectsAdded] = useState([]);
  const [subProjectsLoaded, setSubProjectsLoaded] = useState(false);
  const [subProjectsLoading, setSubProjectsLoading] = useState(true);
  const [reportLinks, setReportLinks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [dashboardDataLoaded, setDashboardDataLoaded] = useState(false);
  const [totalWorklogCountInOrg, setTotalWorklogCountInOrg] = useState(0);
  const [totalWorklogCountInOrgLoading, setTotalWorklogCountInOrgLoading] = useState(false);
  const [totalWorklogCountInOrgLoaded, setTotalWorklogCountInOrgLoaded] = useState(false);
  const [dashboardLogDataForToday, setDashboardLogDataForToday] = useState({
    datasets: [],
    labels: []
  });
  const [dashboardLogDataForMonth, setDashboardLogDataForMonth] = useState({
    datasets: [],
    labels: []
  });

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (!currentUser) return

    if (!projectsLoaded) {
      getSettingUserProject()
        .then((res) => {
          setProjectsLoading(false);
          setProjectsLoaded(true);

          const projectsGotten = res.data
            ?.filter(
              (project) =>
                project?.data_type ===
                  currentUser.portfolio_info[0].data_type &&
                project?.company_id === currentUser.portfolio_info[0].org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse();

          if (projectsGotten.length < 1) return;

          setProjectsAdded(projectsGotten);
        })
        .catch((err) => {
          console.log(err);
          setProjectsLoading(false);
        });
    }

    if (!subProjectsLoaded) {
      getSettingUserSubProject()
        .then((res) => {
          setSubProjectsLoading(false);
          setSubProjectsLoaded(true);

          setSubProjectsAdded(
            res.data?.data
              ?.filter(
                (item) =>
                  item.company_id === currentUser.portfolio_info[0].org_id &&
                    item.data_type === currentUser.portfolio_info[0].data_type
              )
              .reverse()
          );
        })
        .catch((err) => {
          console.log(err);
          setSubProjectsLoading(false);
        });
    }

  }, [currentUser])

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        setlist,
        list,
        jobs2,
        setjobs2,
        searchValue,
        setsearchValue,
        resp,
        setresponse,
        jobLinks,
        setJobLinks,
        projectsAdded,
        setProjectsAdded,
        projectsLoaded,
        setProjectsLoaded,
        projectsLoading,
        setProjectsLoading,
        productLinks,
        setProductLinks,
        subProjectsAdded,
        setSubProjectsAdded,
        subProjectsLoaded,
        setSubProjectsLoaded,
        subProjectsLoading,
        setSubProjectsLoading,
        reportLinks,
        setReportLinks,
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        dashboardDataLoaded,
        setDashboardDataLoaded,
        totalWorklogCountInOrg,
        setTotalWorklogCountInOrg,
        totalWorklogCountInOrgLoading,
        setTotalWorklogCountInOrgLoading,
        totalWorklogCountInOrgLoaded,
        setTotalWorklogCountInOrgLoaded,
        dashboardLogDataForToday,
        setDashboardLogDataForToday,
        dashboardLogDataForMonth,
        setDashboardLogDataForMonth,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
