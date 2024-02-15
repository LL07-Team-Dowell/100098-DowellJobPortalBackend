import { useState, useEffect } from "react";
import JobLandingLayout from "../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useCurrentUserContext } from "../../../contexts/CurrentUserContext";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./styles.module.css";
import GenerateInvoice from "./components/GenerateInvoice";

const InvoicePayment = ({ isGroupLead }) => {
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const { currentUser } = useCurrentUserContext();

  const requiredLogCount = isGroupLead ? 640 : 320;

  const handleInvoicePopup = () => {
    setShowInvoicePopup(true);
  };

  const handleCloseModal = () => {
    setShowInvoicePopup(false);
  };

  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
      <div className={styles.wrapper_invoice}>
        <section className={styles.nav_content}>
          <h2>Invoice</h2>
          <button onClick={() => handleInvoicePopup()}>
            <AiOutlinePlus />
            <span>New</span>
          </button>
        </section>
        <section>This is the invoice landing page</section>
        {showInvoicePopup && (
          <GenerateInvoice
            handleCloseModal={handleCloseModal}
            requiredLogCount={requiredLogCount}
          />
        )}
      </div>
    </JobLandingLayout>
  );
};

export default InvoicePayment;
