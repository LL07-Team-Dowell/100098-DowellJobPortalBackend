import JobLandingLayout from "../layouts/CandidateJobLandingLayout/LandingLayout"
import AfterSelectionScreen from "../pages/CandidatePage/views/AfterSelectionScreen/AfterSelectionScreen"
import CandidateTranningScreen from "../pages/CandidatePage/views/CandidateTranningScreen/CandidateTranningScreen"
import TeamScreenMembersCandidate from "../pages/CandidatePage/views/TeamScreenMember/TeamScreenMember"
import TeamScreenThreadCandidate from "../pages/CandidatePage/views/TeamScreenThread/TeamScreenThread"
import TeamScreenTasksCandidate from "../pages/CandidatePage/views/TeamsScreenTasks/TeamsScreenTasks"
import TraningProgress from "../pages/CandidatePage/views/TraningProgress.js/TraningProgress"
import WorkLogRequest from "../pages/CandidatePage/views/WorkLogRequest/WorkLogRequest"
import ErrorPage from "../pages/ErrorPage/ErrorPage"
import Logout from "../pages/LogoutPage/Logout"
import TeamInfoCandidate from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamInfoCandidate/TeamInfoCandidate"
import CandidateHomeScreen from "../pages/CandidatePage/views/CandidateHomeScreen/CandidateHomeScreen";
import JobScreen from "../pages/CandidatePage/components/Job/Job"
import ResearchAssociatePage from "../pages/CandidatePage/views/ResearchAssociatePage/ResearchAssociatePage"
import EmployeeJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/EmployeeJobLandingScreen"
import InternJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/InternJobLandingScreen"
import FreelancerJobScreen from "../pages/CandidatePage/views/JobsLandingScreens/FreelancerJobScreen"
import AlertScreen from "../pages/CandidatePage/views/AlertsScreen/AlertScreen"
import UserScreen from "../pages/CandidatePage/views/UserScreen/UserScreen"
import AppliedScreen from "../pages/CandidatePage/views/AppliedPageScreen/AppliedScreen"
import JobApplicationScreen from "../pages/CandidatePage/views/JobApplicationScreen/JobApplicationScreen"


// HIRED CANDIDATE ROUTES
export const candidateHiredRoutes = [
    {
        path: "/team-screen-member/:id/team-tasks",
        component: ({
            currentUser,
        }) => {
            return <JobLandingLayout user={currentUser} afterSelection={true}>
                <TeamScreenTasksCandidate />
            </JobLandingLayout>
        },
        hasProps: true,
    },
    {
        path: "/work-log-request",
        component: WorkLogRequest,
    },
    {
        path: "/team-screen-member/:id/team-members",
        component: ({
            currentUser,
        }) => {
            return <JobLandingLayout user={currentUser} afterSelection={true}>
                <TeamScreenMembersCandidate />
            </JobLandingLayout>
        },
        hasProps: true,
    },
    {
        path: "/team-screen-member/:id/team-info",
        component: ({
            currentUser,
        }) => {
            return <JobLandingLayout user={currentUser} afterSelection={true}>
                <TeamInfoCandidate />
            </JobLandingLayout>
        },
        hasProps: true,
    },
    {
        path: "/team-screen-member/:id/team-issues",
        component: ({
            currentUser,
        }) => {
            return <JobLandingLayout user={currentUser} afterSelection={true}>
                <TeamScreenThreadCandidate />
            </JobLandingLayout>
        },
        hasProps: true,
    },
    {
        path: "/",
        component: ({
            assignedProjects,
        }) => {
            return <AfterSelectionScreen assignedProjects={assignedProjects} />
        },
        hasProps: true,
    },
    {
        path: "/:section",
        component: ({
            assignedProjects,
        }) => {
            return <AfterSelectionScreen assignedProjects={assignedProjects} />
        },
        hasProps: true,
    },
    {
        path: "/logout",
        component: Logout,
    },
    {
        path: "*",
        component: ErrorPage,
    },
]


// SHORTLISTED CANDIDATE ROUTES
export const candidateShortlistedRoutes = [
    {
        path: "/",
        component: ({
            shorlistedJob,
        }) => {
            return <CandidateTranningScreen shorlistedJob={shorlistedJob} />
        },
        hasProps: true,
    },
    {
        path: "/traning",
        component: ({
            shorlistedJob,
        }) => {
            return <TraningProgress shorlistedJob={shorlistedJob} />
        },
        hasProps: true,
    },
    {
        path: "/logout",
        component: Logout,
    },
    {
        path: "*",
        component: ErrorPage, 
    },
]


// DEFAULT CANDIATE ROUTES
export const defaultCandidateRoutes = [
    {
        path: "/",
        component: ({
            setHired,
            setAssignedProjects,
            setCandidateShortListed,
            setshorlistedJob,
            setRemoved,
            setRenewContract,
        }) => {
            return <CandidateHomeScreen
                setHired={setHired}
                setAssignedProjects={setAssignedProjects}
                setCandidateShortListed={setCandidateShortListed}
                setshorlistedJob={setshorlistedJob}
                setRemoved={setRemoved}
                setRenewContract={setRenewContract}
            />
        },
        hasProps: true,
    },
    {
        path: "/:section",
        component: ({
            setHired,
            setAssignedProjects,
            setCandidateShortListed,
            setshorlistedJob,
            setRemoved,
            setRenewContract,
        }) => {
            return <CandidateHomeScreen
                setHired={setHired}
                setAssignedProjects={setAssignedProjects}
                setCandidateShortListed={setCandidateShortListed}
                setshorlistedJob={setshorlistedJob}
                setRemoved={setRemoved}
                setRenewContract={setRenewContract}
            />
        },
        hasProps: true,
    },
    {
        path: "/jobs",
        component: JobScreen,
    },
    {
        path: "/jobs/:jobTitle",
        component: JobScreen,
    },
    {
        path: "/jobs/c/research-associate",
        component: ResearchAssociatePage,
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
        path: "/logout",
        component: Logout,
    },
    {
        path: "/alerts",
        component: AlertScreen,
    },
    {
        path: "/user",
        component: () => {
            return <UserScreen candidateSelected={false} />
        },
    },
    {
        path: "/applied",
        component: AppliedScreen,
    },
    {
        path: "/applied/:section",
        component: AppliedScreen,
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
        component: ErrorPage,
    },
]