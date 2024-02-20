import styles from './style.module.css';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { useNavigate } from "react-router-dom";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";

const PaymentLandingPage = () => {
    const navigate = useNavigate();
    return (
        <StaffJobLandingLayout
            accountView={true}
            hideSearchBar={true}
        >
            <h2 className={styles.agenda__Report__Heading}>Payment Report</h2>
            <div className={`${styles.create_team_parent} ${styles.report}`} style={{ padding: '20px 20px 200px' }}>
                <div
                    className={styles.Create_Team}
                    onClick={() => navigate("/payments/payment-records")}
                >
                    <div>
                        <div>
                            <MdOutlinePayments className={styles.icon} />
                        </div>
                        <h4>Records</h4>
                        <p>
                            Get insights into scheduled payment records for efficient organization.
                        </p>
                    </div>
                </div>
                <div
                    className={styles.Create_Team}
                    onClick={() => navigate("/payments/invoice")}
                >
                    <div>
                        <div>
                            <LiaFileInvoiceDollarSolid className={styles.icon} />
                        </div>
                        <h4>Invoice</h4>
                        <p>
                            Get insights into the invoices and monthly payments in your organization.
                        </p>
                    </div>
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}

export default PaymentLandingPage;