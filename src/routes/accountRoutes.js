import AccountPage from "../pages/AccountPage/AccountPage";
import Payment from "../pages/AccountPage/views/Payments/Payment";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";
import PaymentLandingPage from "../pages/AccountPage/views/PaymentLandingPage/PaymentLandingPage";
import AccountsInvoicePage from "../pages/AccountPage/views/Payments/AccountsInvoicePage";

export const accountRoutesInfo = [
    {
        path: "/logout",
        component: Logout,
    },
    {
        path: "/payments",
        component: PaymentLandingPage,
    },
    {
        path: "/payments/payment-records",
        component: Payment,
    },
    {
        path: "/payments/invoice",
        component: AccountsInvoicePage,
    },
    {
        path: "/",
        component: AccountPage,
    },
    {
        path: "/:section",
        component: AccountPage,
    },
    {
        path: "*",
        component: ErrorPage,
    },
]