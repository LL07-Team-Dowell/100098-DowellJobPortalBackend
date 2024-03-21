import ErrorPage from "../pages/ErrorPage/ErrorPage";
import HrAgendaReport from "../pages/HrPage/views/Agenda/HrAgendaReport/HrAgendaReport";
import HrAgendaPage from "../pages/HrPage/views/Agenda/HrTrackAgenda";
import AgendaLandingPage from "../pages/HrPage/views/AgendaLandingPage/AgendaLandingPage";
import HrAllApplicationsScreen from "../pages/HrPage/views/AllApplicationsScreen/AllApplicationsScreen";
import AttendanceLandingPage from "../pages/HrPage/views/AttendancePages/AttendanceLandingPage";
import AttendanceReport from "../pages/HrPage/views/AttendanceReport/AttendanceReport";
import AttendanceUpdatePage from "../pages/HrPage/views/AttendanceReport/UpdateAttendance/UpdateAttendance";
import HRCompanyStructure from "../pages/HrPage/views/CompanyStructure/HrCompanyStructure";
import HrJobScreen from "../pages/HrPage/views/JobScreen/HrJobScreen";
import Logout from "../pages/LogoutPage/Logout";

export const hrRoutesInfo = [
    {
        path: "/logout",
        component: Logout,
    },
    {
        path: "/attendance-",
        component: AttendanceLandingPage,
    },
    {
        path: "/attendance-/attendance-report",
        component: AttendanceReport,
    },
    {
        path: "/attendance-/attendance-update",
        component: AttendanceUpdatePage,
    },
    {
        path: "/agenda",
        component: AgendaLandingPage,
    },
    {
        path: "/agenda/track-agenda",
        component: HrAgendaPage,
    },
    {
        path: "/agenda/agenda-report",
        component: HrAgendaReport,
    },
    {
        path: "/all-users",
        component: HrAllApplicationsScreen,
    },
    {
        path: "/company-structure",
        component: HRCompanyStructure,
    },
    {
        path: "/",
        component: HrJobScreen,
    },
    {
        path: "/:section",
        component: HrJobScreen,
    },
    {
        path: "/:section/:sub_section",
        component: HrJobScreen,
    },
    {
        path: "/:section/:sub_section/:path",
        component: HrJobScreen,
    },
    {
        path: "*",
        component: ErrorPage,
    },
]