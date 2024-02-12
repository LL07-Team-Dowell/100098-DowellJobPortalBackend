import StaffJobLandingLayout from "../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import Add from "../pages/AdminPage/views/Add/Add";
import AddJob from "../pages/AdminPage/views/AddJob/AddJob";
import AdminDashboard from "../pages/AdminPage/views/AdminDashboard/AdminDashboard";
import AllApplicationsScreen from "../pages/AdminPage/views/AdminDashboard/views/AllApplicationsScreen/AllApplicationsScreen";
import AdminUserScreen from "../pages/AdminPage/views/AdminUserScreen/AdminUserScreen";
import AdminAgendaPage from "../pages/AdminPage/views/Agenda/AdminAgendaPage";
import AgendaReport from "../pages/AdminPage/views/Agenda/AgendaReportPage/AgendaReport";
import CompanyStructurePage from "../pages/AdminPage/views/CompanyStructure/CompanyStructure";
import EditJob from "../pages/AdminPage/views/EditJob/EditJob";
import LandingPage from "../pages/AdminPage/views/Landingpage/LandingPage";
import AdminLogsHomePage from "../pages/AdminPage/views/LogsHomePage/LogsHomePage";
import Project from "../pages/AdminPage/views/Project/Project";
import LeaderboardReport from "../pages/AdminPage/views/Reports/LeaderboardReport/LeaderboardReport";
import AdminReports from "../pages/AdminPage/views/Reports/Reports";
import TaskReports from "../pages/AdminPage/views/Reports/TaskReports";
import TeamReport from "../pages/AdminPage/views/Reports/TeamReoprt/TeamReport";
import DetailedIndividual from "../pages/AdminPage/views/Reports/detailedIndividual/DetailedIndividual";
import IndividualTaskReports from "../pages/AdminPage/views/Reports/individualTaskReport/individualTaskReport";
import ReportPages from "../pages/AdminPage/views/Reports/reportspages/ReportPages";
import AdminSettings from "../pages/AdminPage/views/Settings/AdminSettings";
import AdminTeam from "../pages/AdminPage/views/Teams/AdminTeam";
import ViewJob from "../pages/AdminPage/views/ViewJob/ViewJob";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";
import CreateTeam from "../pages/TeamleadPage/views/CreateMembersTask/views/CreateTeam";
import TeamScreenMembers from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenMembers";
import TeamScreenTasks from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenTasks";
import TeamScreenInfoAdminTeamLead from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamScreenInfo";
import TeamThread from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThread";
import CreateTaskScreen from "../pages/TeamleadPage/views/CreateTaskScreen/CreateTaskScreen";
import EventScreen from "../pages/AdminPage/views/Event/EventScreen";
import ProjectEdit from "../pages/AdminPage/views/Project/ProjectEdit";
import AdminLogsApprovalPage from "../pages/AdminPage/views/LogsApprovalPage/AdminLogsApprovalPage";

export const mainAdminRoutesInfo = [
  {
    path: "/",
    component: AdminDashboard,
  },
  {
    path: "/jobs",
    component: LandingPage,
  },
  {
    path: "/add",
    component: Add,
  },
  {
    path: "/projects",
    component: Project,
  },
  {
    path: "/projects/edit-project-time",
    component: ProjectEdit,
  },
  {
    path: "/add-job",
    component: AddJob,
  },
  {
    path: "/edit-job/:id",
    component: EditJob,
  },
  {
    path: "/view-job/:id",
    component: ViewJob,
  },
  {
    path: "/user",
    component: AdminUserScreen,
  },
  {
    path: "/report",
    component: ReportPages,
  },
  {
    path: "/agenda",
    component: AdminAgendaPage,
  },
  {
    path: "/report/organization-report",
    component: AdminReports,
  },
  {
    path: "/report/agenda-report",
    component: AgendaReport,
  },
  {
    path: "/report/team-report",
    component: TeamReport,
  },
  {
    path: "/report/detailed-individual-report",
    component: DetailedIndividual,
  },
  {
    path: "/report/task-report",
    component: TaskReports,
  },
  {
    path: "/report/individual-task-report",
    component: IndividualTaskReports,
  },
  {
    path: "/report/leaderboard-report",
    component: LeaderboardReport,
  },
  {
    path: "/teams",
    component: AdminTeam,
  },
  {
    path: "/teams/create-new-team/",
    component: () => {
      return (
        <StaffJobLandingLayout
          adminView={true}
          pageTitle={"New Team"}
          adminAlternativePageActive={true}
          hideSearchBar={true}
          newSidebarDesign={true}
        >
          <CreateTeam isAdmin={true} />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-members",
    component: () => {
      return (
        <StaffJobLandingLayout
          adminView={true}
          hideSearchBar={true}
          adminAlternativePageActive={true}
          pageTitle={"Teams"}
          newSidebarDesign={true}
        >
          <TeamScreenMembers />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-info",
    component: () => {
      return (
        <StaffJobLandingLayout
          adminView={true}
          hideSearchBar={true}
          adminAlternativePageActive={true}
          pageTitle={"Teams"}
          newSidebarDesign={true}
        >
          <TeamScreenInfoAdminTeamLead />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-tasks",
    component: () => {
      return (
        <StaffJobLandingLayout
          adminView={true}
          hideSearchBar={true}
          adminAlternativePageActive={true}
          pageTitle={"Teams"}
          newSidebarDesign={true}
        >
          <TeamScreenTasks />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-issues",
    component: () => {
      return (
        <StaffJobLandingLayout
          adminView={true}
          hideSearchBar={true}
          adminAlternativePageActive={true}
          pageTitle={"Teams"}
          newSidebarDesign={true}
        >
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/settings",
    component: AdminSettings,
  },
  {
    path: "logs",
    component: AdminLogsHomePage,
  },
  {
    path: "/logs-approval-screen",
    component: AdminLogsApprovalPage,
  },
  {
    path: "/all-applications",
    component: AllApplicationsScreen,
  },
  {
    path: "/company-structure",
    component: CompanyStructurePage,
  },
  {
    path: "/event",
    component: EventScreen,
  },
  {
    path: "/logout",
    component: Logout,
  },
  {
    path: "*",
    component: ErrorPage,
  },
];
