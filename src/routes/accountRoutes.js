import AccountPage from "../pages/AccountPage/AccountPage";
import Payment from "../pages/AccountPage/Payment";
import AccountsOnboardingPage from "../pages/AccountPage/views/OnboardingPage/OnboardingPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";

export const accountRoutesInfo = [
    // {
    //     path: "/",
    //     component: AccountPage,
    // },
    {
        path: "/?tab=onboarding",
        component: AccountsOnboardingPage,
    },
    {
        path: "/payments",
        component: Payment,
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