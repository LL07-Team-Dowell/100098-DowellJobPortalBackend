import JobScreen from "../pages/CandidatePage/components/Job/Job";
import JobApplicationScreen from "../pages/CandidatePage/views/JobApplicationScreen/JobApplicationScreen";
import CandidateHomeScreen from "../pages/CandidatePage/views/CandidateHomeScreen/CandidateHomeScreen";
import SingleJobScreen from "../pages/CandidatePage/views/JobApplicationScreen/SingleJobScreen";
import ResearchAssociatePage from "../pages/CandidatePage/views/ResearchAssociatePage/ResearchAssociatePage";
import EmployeeJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/EmployeeJobLandingScreen";
import InternJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/InternJobLandingScreen";
import FreelancerJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/FreelancerJobScreen";

//Highier order component for CandidateHomeScreen to pass props
const CandidateHomeScreenWithProps = ({
  setHired,
  setAssignedProjects,
  setCandidateShortListed,
  setshorlistedJob,
  setRemoved,
}) => {
  return (
    <CandidateHomeScreen
      setHired={setHired}
      setAssignedProjects={setAssignedProjects}
      setCandidateShortListed={setCandidateShortListed}
      setshorlistedJob={setshorlistedJob}
      setRemoved={setRemoved}
    />
  );
};

export const productUserRouteReject = [
  {
    path: "/",
    component: CandidateHomeScreenWithProps,
  },
  {
    path: "/:section",
    component: CandidateHomeScreen,
  },
  {
    path: "/jobs",
    component: JobScreen,
  },
  {
    path: "/jobs/:jobTitle",
    component: SingleJobScreen,
  },
  {
    path: "/jobs/c/research-associate",
    component: () => {
      return <ResearchAssociatePage />;
    },
  },
  {
    path: "/jobs/c/employee",
    component: EmployeeJobScreen,
  },
  {
    path: "/jobs/c/intern",
    component: InternJobScreen,
  },
  {
    path: "/jobs/c/freelancer",
    component: FreelancerJobScreen,
  },
  {
    path: "/apply/job/:id",
    component: JobApplicationScreen,
  },
  {
    path: "/apply/job/:id/:section",
    component: JobApplicationScreen,
  },
  {
    path: "*",
    component: () => {
      return <>Page Not found</>;
    },
  },
];

export const productUserRoutes = [
  {
    path: "/jobs",
    component: JobScreen,
  },
  {
    path: "/apply/job/:id",
    component: JobApplicationScreen,
  },
  {
    path: "/apply/job/:id/:section",
    component: JobApplicationScreen,
  },
  {
    path: "*",
    component: () => {
      return <>Page Not found</>;
    },
  },
];
