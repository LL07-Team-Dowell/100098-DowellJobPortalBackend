import { useState, useEffect } from "react";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";
import Select from "react-select";
import {
  getLogsBetweenRange,
  getleaveDays,
  processPayment,
  workFlowdetails,
} from "../../../../services/paymentService";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { formatDateForAPI } from "../../../../helpers/helpers";
import HorizontalBarLoader from "../../../../components/HorizontalBarLoader/HorizontalBarLoader";
import { TbCopy } from "react-icons/tb";
import { PiArrowElbowRightThin } from "react-icons/pi";
import { toast } from "react-toastify";

const GenerateInvoice = ({ handleCloseModal, requiredLogCount }) => {
  const [dataProcessing, setDataProcessing] = useState(false);
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const { currentUser } = useCurrentUserContext();
  const [showMasterLink, setShowMasterLink] = useState("");
  const [showMasterCode, setShowMasterCode] = useState("");
  const [copied, setCopiedId] = useState("");

  // const [dataForProcess, setDataForProcess] = useState({
  //   payment_month: "",
  //   payment_year: "",
  // });

  const monthsWith30Days = ["April", "June", "September", "November"];
  const monthsWith28Days = ["February"];

  let endDayOfMonth = 31;

  if (monthsWith30Days.includes(selectedMonth)) endDayOfMonth = 30;
  if (monthsWith28Days.includes(selectedMonth)) endDayOfMonth = 28;

  const handleProcessInvoice = async () => {
    if (!selectedMonth) return toast.info("Select Month");

    if (!selectedYear) return toast.info("Select Year");

    setDataProcessing(true);

    Promise.all([
      getLogsBetweenRange({
        start_date: formatDateForAPI(
          `${selectedYear.value}-${selectedMonth.value}-01`
        ),
        end_date: formatDateForAPI(
          `${selectedYear.value}-${selectedMonth.value}-${endDayOfMonth}`
        ),
        user_id: currentUser.userinfo.userID,
        company_id: currentUser.portfolio_info[0].org_id,
      }),
      getleaveDays(currentUser.userinfo.userID),
    ])
      .then((res) => {
        console.log(res[1]);
        console.log(res[0]?.data);

        const taskDetails = res[0]?.data?.task_details;

        const approvedLogs = taskDetails.filter((log) => log.approved === true);

        const templateID = "64ece51ba57293efb539e5b7";

        const dataForInvoice = {
          user_id: currentUser.userinfo.userID,
          payment_month: selectedMonth.label,
          payment_year: selectedYear.label,
          number_of_leave_days: 5,
          approved_logs_count: approvedLogs.length,
          total_logs_required: requiredLogCount,
        };

        const dataForWorkflow = {
          company_id: currentUser.portfolio_info[0].org_id,
          company_name: currentUser.portfolio_info[0].org_name,
          template_id: templateID,
          created_by: currentUser.userinfo.username,
          portfolio: currentUser.portfolio_info[0].portfolio_name,
          data_type: currentUser.portfolio_info[0].data_type,
          payment_month: selectedMonth.label,
          payment_year: selectedYear.label,
          hr_username: "DummyHR",
          hr_portfolio: "DummyHR_Portfolio",
          accounts_username: "DummyAC",
          accounts_portfolio: "DummyAC_Portfolio",
        };

        Promise.all([
          processPayment(dataForInvoice),
          workFlowdetails(dataForWorkflow),
        ]).then((res) => {
          const masterQrCodeDetails = res[1]?.data?.created_process.master_code;
          const masterLinkDetails = res[1]?.data?.created_process.master_link;

          setShowMasterCode(masterQrCodeDetails);
          setShowMasterLink(masterLinkDetails);

          setDataProcessing(false);
          setShowInvoicePage(true);
        });
      })
      .catch((err) => {
        console.log(err);
        setDataProcessing(false);
      });
  };

  return (
    <>
      <Overlay>
        <div className={styles.edit_invoice}>
          <div style={{ width: "100%" }}>
            <AiOutlineClose
              onClick={handleCloseModal}
              className={styles.edit_Icon}
            />
          </div>
          <div className={styles.invoice_popup_details}>
            {showInvoicePage ? (
              <>
                <h2>Invoice Details</h2>
                <div className={styles.master_link_container}>
                  <div className={styles.master_link_img}>
                    <img src={showMasterCode} alt="master code" />
                  </div>
                </div>
                <div className={styles.master_link_container}>
                  <span>Master Link</span>
                  <div>
                    <button
                      className={styles.master_link_btn}
                      onClick={async () => {
                        await navigator.clipboard.writeText(showMasterLink);

                        setCopiedId("write-text");
                      }}
                    >
                      {copied === "write-text" ? (
                        <>
                          <PiArrowElbowRightThin /> Copied
                        </>
                      ) : (
                        <TbCopy />
                      )}
                    </button>
                    <input
                      type="text"
                      value={showMasterLink}
                      className={styles.master_link_input}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>New Invoice</h2>
                <div>
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
                        options={[
                          { label: "2024", value: "2024" },
                          { label: "2023", value: "2023" },
                        ]}
                        onChange={(selectedOption) => {
                          setSelectedYear(selectedOption);
                        }}
                        className={styles.invoice__select__year}
                        placeholder="Select year"
                      />
                    </div>
                  </label>
                </div>
                <div className={styles.process_btn}>
                  {dataProcessing ? (
                    <div className={styles.load__Wrap}>
                      <HorizontalBarLoader height={"1.3rem"} />
                    </div>
                  ) : (
                    <button
                      className={styles.generate_invoice}
                      onClick={handleProcessInvoice}
                    >
                      <span>Process</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default GenerateInvoice;
