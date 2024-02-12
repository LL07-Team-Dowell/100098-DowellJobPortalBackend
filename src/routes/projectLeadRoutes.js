import StaffJobLandingLayout from "../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import LeaderboardReport from "../pages/AdminPage/views/Reports/LeaderboardReport/LeaderboardReport";
import TaskReports from "../pages/AdminPage/views/Reports/TaskReports";
import TeamReport from "../pages/AdminPage/views/Reports/TeamReoprt/TeamReport";
import DetailedIndividual from "../pages/AdminPage/views/Reports/detailedIndividual/DetailedIndividual";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ProjectLeadAgendaPage from "../pages/ProjectLeadPage/views/Agenda/ProjectLeadAgendaPage";
import ProjectLeadHomePage from "../pages/ProjectLeadPage/views/HomePage/HomePage";
import ProjectLogRequest from "../pages/ProjectLeadPage/views/LogRequests/ProjectLogRequest";
import ProjectLeadLogsPage from "../pages/ProjectLeadPage/views/LogsViewPage/ProjectLeadLogsPage";
import ProjectLeadReportsLandingPage from "../pages/ProjectLeadPage/views/ReportsPage/ReportsLandingPage";
import ProjectLeadTeams from "../pages/ProjectLeadPage/views/TeamsPage/TeamsLandingPage";
import ProjectLeadUserScreen from "../pages/ProjectLeadPage/views/UserScreen/UserScreen";
import CreateTeam from "../pages/TeamleadPage/views/CreateMembersTask/views/CreateTeam";
import TeamScreenMembers from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenMembers";
import TeamScreenTasks from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenTasks";
import TeamThread from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThread";

export const projectLeadRoutesInfo = [
  {
    path: "/",
    component: ProjectLeadHomePage,
  },
  {
    path: "/log-requests",
    component: ProjectLogRequest,
  },
  {
    path: "/agenda",
    component: ProjectLeadAgendaPage,
  },
  {
    path: "/logs-approval-screen",
    component: ProjectLeadLogsPage,
  },
  {
    path: "/report",
    component: ProjectLeadReportsLandingPage,
  },
  {
    path: "/report/team-report",
    component: () => {
      return <TeamReport isProjectLead={true} />;
    },
  },
  {
    path: "/report/detailed-individual-report",
    component: () => {
      return <DetailedIndividual isProjectLead={true} />;
    },
  },
  {
    path: "/report/task-report",
    component: () => {
      return <TaskReports isProjectLead={true} />;
    },
  },
  {
    path: "/report/leaderboard-report",
    component: () => {
      return <LeaderboardReport isProjectLead={true} />;
    },
  },
  {
    path: "/teams",
    component: ProjectLeadTeams,
  },
  {
    path: "/teams/create-new-team/",
    component: () => {
      return (
        <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
          <CreateTeam />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-members",
    component: () => {
      return (
        <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
          <TeamScreenMembers />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-tasks",
    component: () => {
      return (
        <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
          <TeamScreenTasks />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-issues",
    component: () => {
      return (
        <StaffJobLandingLayout projectLeadView={true} hideSearchBar={true}>
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/user",
    component: ProjectLeadUserScreen,
  },
  {
    path: "*",
    component: ErrorPage,
  },
];
