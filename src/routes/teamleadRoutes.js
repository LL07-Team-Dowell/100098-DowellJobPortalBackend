import StaffJobLandingLayout from "../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";
import Teamlead from "../pages/TeamleadPage/Teamlead";
import TeamLeadAgendaPage from "../pages/TeamleadPage/views/Agenda/TeamLeadAgendaPage";
import Index from "../pages/TeamleadPage/views/CreateMembersTask/Index";
import CreateTeam from "../pages/TeamleadPage/views/CreateMembersTask/views/CreateTeam";
import TeamScreenMembers from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenMembers";
import TeamScreenTasks from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenTasks";
import TeamScreenInfoAdminTeamLead from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamScreenInfo";
import TeamThread from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThread";
import TeamThreadScreen from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThreadScreen";
import TeamleadLogApprovalScreen from "../pages/TeamleadPage/views/LogApprovalScreen/TeamleadLogApprovalScreen";
import LogRequestLanding from "../pages/TeamleadPage/views/WorkLogRequest/LogRequestLanding";
import LogRequest from "../pages/TeamleadPage/views/WorkLogRequest/LogRequestNav";
import WorkLogRequestTeamLead from "../pages/TeamleadPage/views/WorkLogRequest/WorklogRequestTeamLead";

export const teamleadRouteInfo = [
  {
    path: "/",
    component: Teamlead,
  },
  {
    path: "/:section",
    component: Teamlead,
  },
  {
    path: "/logs-approval-screen",
    component: TeamleadLogApprovalScreen,
  },
  {
    path: "/agenda",
    component: TeamLeadAgendaPage,
  },
  {
    path: "/request",
    component: LogRequestLanding,
  },
  {
    path: "/log-requests",
    component: LogRequest,
  },
  {
    path: "/lead-log-requests",
    component: WorkLogRequestTeamLead,
  },
  {
    path: "/create-task",
    component: Index,
  },
  {
    path: "/create-task/create-new-team/",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <CreateTeam />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-members",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamScreenMembers />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-info",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamScreenInfoAdminTeamLead />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "//team-screen-member/:id/team-tasks",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamScreenTasks />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-issues",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamThreadScreen />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/issue-inprogress",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/issue-completed",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "team-screen-member/:id/issue-resolved",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
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
