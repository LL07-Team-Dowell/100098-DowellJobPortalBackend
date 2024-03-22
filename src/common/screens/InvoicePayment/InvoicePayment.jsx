import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../contexts/CurrentUserContext";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./styles.module.css";
import GenerateInvoice from "./components/GenerateInvoice";
import { getInvoice } from "../../../services/paymentService";
import Select from "react-select";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { formatDate } from "../../../helpers/helpers";

const InvoicePayment = ({ isGrouplead, isTeamlead, header }) => {
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [invoiceResults, setInvoiceResults] = useState(false);

  const requiredLogCount = isGrouplead ? 160 : 80;

  const getInvoiceDetails = async () => {
    if (!selectedMonth) return toast.info("Select Month");

    if (!selectedYear) return toast.info("Select Year");

    setInvoiceResults(false);
    setDataLoading(true);

    getInvoice(
      currentUser.userinfo.userID,
      selectedYear.label,
      selectedMonth.label
    )
      .then((res) => {
        console.log(res);
        setInvoiceDetails(res.data.response);
        setInvoiceResults(true);
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(
          err?.response ? err?.response?.data?.message : err?.message
        );
        toast.error(
          err?.response ? err?.response?.data?.message : err?.message
        );
        setDataLoading(false);
      });
  };

  const handleInvoicePopup = () => {
    setShowInvoicePopup(true);
  };

  const handleCloseModal = () => {
    setShowInvoicePopup(false);
  };

  const generateOption = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push({
        label: currentYear - i,
        value: (currentYear - i).toString(),
      });
    }
    return years;
  };

  const options = generateOption();

  return (
    <div className={styles.wrapper_invoice}>
      <section className={styles.nav_content}>
        <h2>{header ? "" : "Invoice"}</h2>
        <button onClick={() => handleInvoicePopup()}>
          <AiOutlinePlus />
          <span>New</span>
        </button>
      </section>
      <section className={styles.get_invoice_section}>
        <label htmlFor="new_event">
          <span>Select Date</span>
          <div className={styles.invoice_details_select}>
            <Select
              options={[
                { label: "January", value: "01" },
                { label: "February", value: "02" },
                { label: "March", value: "03" },
                { label: "April", value: "04" },
                { label: "May", value: "05" },
                { label: "June", value: "06" },
                { label: "July", value: "07" },
                { label: "August", value: "08" },
                { label: "September", value: "09" },
                { label: "October", value: "10" },
                { label: "November", value: "11" },
                { label: "December", value: "12" },
              ]}
              onChange={(selectedOption) => {
                setSelectedMonth(selectedOption);
              }}
              className={styles.invoice__select__date}
              placeholder="Select month"
            />
            <Select
              options={options}
              onChange={(selectedOption) => {
                setSelectedYear(selectedOption);
              }}
              className={styles.invoice__select__year}
              placeholder="Select year"
            />

            <div className={styles.process_btn}>
              <button
                className={styles.generate_invoice}
                onClick={getInvoiceDetails}
              >
                <span>
                  {dataLoading ? (
                    <LoadingSpinner
                      width={"1.1rem"}
                      height={"1.1rem"}
                      color={"white"}
                    />
                  ) : (
                    "Get"
                  )}
                </span>
              </button>
            </div>
          </div>
        </label>
      </section>
      {invoiceResults && (
        <>
          <h3 className={styles.swipe_text}>
            Swipe horizontally to see more details
          </h3>
          <section className={styles.get_invoice_section}>
            <div className={styles.progress_main_div}>
              <div className={styles.agenda_report_wrap}>
                <div className={styles.report_agenda_list}>
                  <h3>Payment Details</h3>
                  <div className={styles.weekly_agenda_list_table_div}>
                    <table className={styles.weekly_agenda_list_table}>
                      <thead>
                        <tr>
                          <th>Payment from</th>
                          <th>Payment to</th>
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Approved logs</th>
                          <th>Required log count</th>
                          <th>Leave days</th>
                          <th>Payment approved</th>
                          <th>Payment approved date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{formatDate(item.payment_from)}</td>
                            <td>{formatDate(item.payment_to)}</td>
                            <td style={{ color: "#005734" }}>
                              {item.amount_paid}
                            </td>
                            <td>{item.currency_paid}</td>
                            <td>{item.approved_logs_count}</td>
                            <td>{item.requried_logs_count}</td>
                            <td style={{ color: "red" }}>-</td>
                            <td style={{ color: item.payment_approved ? "#005734" : "red" }}>{item.payment_approved ? "Yes" : "No"}</td>
                            <td>{formatDate(item.payment_approved_on)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      {showInvoicePopup && (
        <GenerateInvoice
          handleCloseModal={handleCloseModal}
          requiredLogCount={requiredLogCount}
          isGrouplead={isGrouplead}
          isTeamlead={isTeamlead}
          options={options}
        />
      )}
    </div>
  );
};

export default InvoicePayment;
