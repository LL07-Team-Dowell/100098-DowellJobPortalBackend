import AccountPage from "../pages/AccountPage/AccountPage";
import Payment from "../pages/AccountPage/views/Payments/Payment";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Logout from "../pages/LogoutPage/Logout";
import PaymentLandingPage from "../pages/AccountPage/views/PaymentLandingPage/PaymentLandingPage";
import AccountsInvoicePage from "../pages/AccountPage/views/Payments/AccountsInvoicePage";
import AccountInvoiceLanding from "../pages/AccountPage/views/Payments/InvoiceLanding/InvoiceLanding";
import AccountsInvoiceRequests from "../pages/AccountPage/views/Payments/InvoiceRequests/InvoiceRequests";

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
        path: "/payments/invoice-landing",
        component: AccountInvoiceLanding,
    },
    {
        path: "/payments/invoice",
        component: AccountsInvoicePage,
    },
    {
        path: "/payments/invoice-requests",
        component: AccountsInvoiceRequests,
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