import UsersLogsScreen from "../common/screens/UserLogsScreen/UserLogsScreen";
import StaffJobLandingLayout from "../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import GroupLeadTask from "../pages/GroupLeadPage/components/GroupLeadTask";
import GroupleadAgendaLanding from "../pages/GroupLeadPage/views/Agenda/AgendaLanding";
import NewGroupleadAgenda from "../pages/GroupLeadPage/views/Agenda/NewAgenda";
import GroupleadTrackAgenda from "../pages/GroupLeadPage/views/Agenda/TrackAgenda";
import GroupleadLogApprovalScreen from "../pages/GroupLeadPage/views/LogApprovalScreen/GroupleadLogApprovalScreen";
import WorkLogRequestGrouplead from "../pages/GroupLeadPage/views/WorklogRequests/WorkLogRequest";
import Teamlead from "../pages/TeamleadPage/Teamlead";
import Index from "../pages/TeamleadPage/views/CreateMembersTask/Index";
import CreateTeam from "../pages/TeamleadPage/views/CreateMembersTask/views/CreateTeam";
import TeamScreenMembers from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenMembers";
import TeamScreenTasks from "../pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenTasks";
import TeamThread from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThread";
import TeamThreadScreen from "../pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThreadScreen";

export const groupleadRouteInfo = [
  {
    path: "/",
    component: () => {
      return <Teamlead isGrouplead={true} />;
    },
  },
  {
    path: "/:section",
    component: () => {
      return <Teamlead isGrouplead={true} />;
    },
  },
  {
    path: "/logs-approval-screen",
    component: GroupleadLogApprovalScreen,
  },
  {
    path: "/grouplead-tasks",
    component: GroupLeadTask,
  },
  {
    path: "/create-task",
    component: () => {
      return <Index isGrouplead={true} />;
    },
  },
  {
    path: "/log-requests",
    component: WorkLogRequestGrouplead,
  },
  {
    path: "/agenda",
    component: GroupleadAgendaLanding,
  },
  {
    path: "/new-agenda",
    component: NewGroupleadAgenda,
  },
  {
    path: "/track-agenda",
    component: GroupleadTrackAgenda,
  },
  {
    path: "/create-task/create-new-team/",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <CreateTeam />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/team-members",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <TeamScreenMembers />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "//team-screen-member/:id/team-tasks",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
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
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <TeamThreadScreen />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/issue-inprogress",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/team-screen-member/:id/issue-completed",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "team-screen-member/:id/issue-resolved",
    component: () => {
      return (
        <StaffJobLandingLayout
          teamleadView={true}
          isGrouplead={true}
          hideSearchBar={true}
        >
          <TeamThread />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "/user-tasks",
    component: () => {
      return (
        <StaffJobLandingLayout teamleadView={true} isGrouplead={true}>
          <UsersLogsScreen
            className={"group__Lead__User__Logs"}
            isLeadUser={true}
          />
        </StaffJobLandingLayout>
      );
    },
  },
  {
    path: "*",
    component: ErrorPage,
  },
];
