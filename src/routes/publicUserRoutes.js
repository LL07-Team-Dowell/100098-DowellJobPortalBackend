import JobApplicationScreen from "../pages/CandidatePage/views/JobApplicationScreen/JobApplicationScreen";

export const publicUserRoutes = [
    {
        path: '/apply/job/:id',
        component: JobApplicationScreen
    },
    {
        path: '/apply/job/:id/:section',
        component: JobApplicationScreen,
    },
    {
        path: '*',
        component: () => {
            return <>Page Not found</>
        }
    },
]