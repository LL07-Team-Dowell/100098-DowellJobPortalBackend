import { useNavigate } from "react-router-dom"
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import ItemFeatureCard from "../../../../../common/components/ItemFeatureCard/ItemFeatureCard";
import { IoChevronBack } from "react-icons/io5";
import { FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import { useMediaQuery } from "@mui/material";


const AccountInvoiceLanding = () => {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    return <StaffJobLandingLayout
        accountView={true}
        hideSearchBar={true}
    >
        <div className={styles.wrapper}>
            <div className={styles.icon__Wrap}>
                <div className={styles.back_icon} onClick={() => navigate(-1)}>
                    <IoChevronBack />
                </div>
                <h3>
                    {
                        isSmallScreen ?
                            'Invoices'
                        :
                        'Invoice Management'
                    }
                </h3>
            </div>

            <div className={styles.features__Wrap}>
                <ItemFeatureCard
                    featureIcon={<FaFileInvoice />}
                    featureTitle={'Invoices'}
                    featureDescription={'View and approve invoices of users in your organization'}
                    handleFeatureCardClick={() => navigate("/payments/invoice")}
                />
                <ItemFeatureCard 
                    featureIcon={<FaFileInvoiceDollar />}
                    featureTitle={'Invoice Requests'}
                    featureDescription={'Manage invoice requests of users in your organization'}
                    handleFeatureCardClick={() => navigate("/payments/invoice-requests")}
                />
            </div>
        </div>

    </StaffJobLandingLayout>
}

export default AccountInvoiceLanding;