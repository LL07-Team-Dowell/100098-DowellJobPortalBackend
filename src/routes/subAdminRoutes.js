import AddJob from "../pages/AdminPage/views/AddJob/AddJob";
import AdminDashboard from "../pages/AdminPage/views/AdminDashboard/AdminDashboard";
import AdminUserScreen from "../pages/AdminPage/views/AdminUserScreen/AdminUserScreen";
import EditJob from "../pages/AdminPage/views/EditJob/EditJob";
import LandingPage from "../pages/AdminPage/views/Landingpage/LandingPage";
import LeaderboardReport from "../pages/AdminPage/views/Reports/LeaderboardReport/LeaderboardReport";
import AdminReports from "../pages/AdminPage/views/Reports/Reports";
import TaskReports from "../pages/AdminPage/views/Reports/TaskReports";
import TeamReport from "../pages/AdminPage/views/Reports/TeamReoprt/TeamReport";
import DetailedIndividual from "../pages/AdminPage/views/Reports/detailedIndividual/DetailedIndividual";
import ReportPages from "../pages/AdminPage/views/Reports/reportspages/ReportPages";
import ViewJob from "../pages/AdminPage/views/ViewJob/ViewJob";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";

export const subAdminRoutesInfo = [
  {
    path: "/",
    component: () => {
      return <AdminDashboard subAdminView={true} />;
    },
  },
  {
    path: "/jobs",
    component: () => {
      return <LandingPage subAdminView={true} />;
    },
  },
  {
    path: "/logout",
    component: () => {
      return <Logout />;
    },
  },
  {
    path: "/edit-job/:id",
    component: () => {
      return <EditJob subAdminView={true} />;
    },
  },
  {
    path: "/view-job/:id",
    component: ViewJob,
  },
  {
    path: "/add-job",
    component: () => {
      return <AddJob subAdminView={true} />;
    },
  },
  {
    path: "/user",
    component: () => {
      return <AdminUserScreen subAdminView={true} />;
    },
  },
  {
    path: "/report",
    component: () => {
      return <ReportPages subAdminView={true} />;
    },
  },
  {
    path: "/report/organization-report",
    component: () => {
      return <AdminReports subAdminView={true} />;
    },
  },
  {
    path: "/report/team-report",
    component: () => {
      return <TeamReport subAdminView={true} />;
    },
  },
  {
    path: "/report/detailed-individual-report",
    component: () => {
      return <DetailedIndividual subAdminView={true} />;
    },
  },
  {
    path: "/report/task-report",
    component: () => {
      return <TaskReports subAdminView={true} />;
    },
  },
  {
    path: "/report/leaderboard-report",
    component: () => {
      return <LeaderboardReport subAdminView={true} />;
    },
  },
  {
    path: "*",
    component: ErrorPage,
  },
];
