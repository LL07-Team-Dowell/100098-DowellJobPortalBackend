import { useState, useEffect } from "react";
import JobLandingLayout from "../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useCurrentUserContext } from "../../../contexts/CurrentUserContext";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./styles.module.css";
import GenerateInvoice from "./components/GenerateInvoice";

const InvoicePayment = ({ isGroupLead }) => {
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const {
    currentUser,
    currentUserHiredApplications,
    currentUserHiredApplicationsLoaded,
  } = useCurrentUserContext();

  useEffect(() => {
    const attendance = currentUserHiredApplications
      .map((item) => {
        return item.project;
      })
      .flat();

    console.log(attendance);
  }, [currentUserHiredApplicationsLoaded]);

  const requiredLogCount = isGroupLead ? 160 : 80;

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
            currentUserHiredApplications={currentUserHiredApplications}
            currentUserHiredApplicationsLoaded={
              currentUserHiredApplicationsLoaded
            }
          />
        )}
      </div>
    </JobLandingLayout>
  );
};

export default InvoicePayment;
