import { useState, useEffect } from "react";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";
import {
  getInvoiceRequest,
  getLogsBetweenRange,
  getleaveDays,
  processPayment,
  workFlowdetails,
} from "../../../../services/paymentService";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import {
  calculateHoursOfLogs,
  extractMonthandYear,
  formatDateForAPI,
  getDaysDifferenceBetweenDates,
  getMondayAndFridayOfWeek,
  getWeekdaysBetweenDates,
} from "../../../../helpers/helpers";
import HorizontalBarLoader from "../../../../components/HorizontalBarLoader/HorizontalBarLoader";
import { TbCopy } from "react-icons/tb";
import { PiArrowElbowRightThin } from "react-icons/pi";
import { toast } from "react-toastify";
import { getInternetSpeedTest } from "../../../../services/speedTestServices";
import { getUserWiseAttendance } from "../../../../services/hrServices";

const GenerateInvoice = ({
  handleCloseModal,
  requiredLogCount,
  isGrouplead,
  isTeamlead,
  options,
}) => {
  const [dataProcessing, setDataProcessing] = useState(false);
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const [paymentFrom, setPaymentFrom] = useState("");
  const [paymentTo, setPaymentTo] = useState("");
  const { currentUser, currentUserHiredApplications } = useCurrentUserContext();
  const [showMasterLink, setShowMasterLink] = useState("");
  const [showMasterCode, setShowMasterCode] = useState("");
  const [copied, setCopiedId] = useState("");

  const handleFromDateChange = (e) => {
    const fromDate = e.target.value;
    setPaymentFrom(fromDate);

    //Calsulate the "Payment To" date 6 days ahead
    const toDate = new Date(
      new Date(fromDate).setDate(new Date(fromDate).getDate() + 6)
    );
    setPaymentTo(formatDateForAPI(toDate));
  };

  const handleToDateChange = (e) => {
    setPaymentTo(e.target.value);
  };

  const handleProcessInvoice = async () => {
    if (!paymentFrom || !paymentTo)
      return toast.info("Select a both start and end dates");

    if (getDaysDifferenceBetweenDates(paymentFrom, paymentTo) !== 6) {
      return toast.info(
        "Difference between start and end date should be equal to 6 days!"
      );
    }

    const { monday, friday } = getMondayAndFridayOfWeek(paymentFrom);
    console.log(monday, friday);

    const attendanceProjects = currentUserHiredApplications
      .map((item) => {
        return item.project;
      })
      .flat();

    const { month, year } = extractMonthandYear(paymentFrom);
    console.log(month, year);

    setDataProcessing(true);

    // CHECK IF A VALID INVOICE REQUEST EXISTS FOR USER
    try {
      const invoiceResponse = (await getInvoiceRequest(currentUser.portfolio_info[0].org_id)).data;
      const invoiceRequest = invoiceResponse?.response;
      
      const foundRequest = invoiceRequest.find(
        (request) =>
          request?.username === currentUser.userinfo.username &&
          request?.portfolio_name ===
            currentUser?.portfolio_info[0]?.portfolio_name &&
          request?.user_id === currentUser.userinfo.userID &&
          request?.company_id === currentUser?.portfolio_info[0]?.org_id &&
          request?.payment_month === month &&
          request?.payment_year === year &&
          request?.payment_from === paymentFrom &&
          request?.payment_to === paymentTo
      );

      console.log(foundRequest);

      if (!foundRequest) {
        setDataProcessing(false);
        toast.info(
          "Please contact HR to create an invoice request for you or reach out to the team for assistance"
        );
        return;
      }

    } catch (error) {
      console.log(error?.response ? error?.response?.data : error?.message);
      setDataProcessing(false);
      toast.info(
        "Please contact HR to create an invoice request for you or reach out to the team for assistance"
      );  

      return;
    }

    // REQUESTS TO CHECK APPROVED LOGS AND ATTENDANCE
    const requestsToMake = [
      getLogsBetweenRange({
        start_date: paymentFrom,
        end_date: paymentTo,
        user_id: currentUser.userinfo.userID,
        company_id: currentUser.portfolio_info[0].org_id,
      }),
      ...attendanceProjects.map((project) => {
        return getUserWiseAttendance({
          usernames: [currentUser.userinfo.username],
          start_date: formatDateForAPI(monday),
          end_date: formatDateForAPI(friday),
          company_id: currentUser.portfolio_info[0].org_id,
          limit: "0",
          offset: "0",
          project: project,
        });
      }),
    ];

    Promise.all(requestsToMake)
      .then((res) => {
        console.log(res[0]?.data);
        // console.log(res[2]);
        console.log(res[1]?.data);

        const taskDetails = res[0]?.data?.task_details;

        const approvedLogs = taskDetails.filter((log) => log?.approved || log?.aprroval === true);
        const hours = calculateHoursOfLogs(approvedLogs);

        if ((isGrouplead || isTeamlead) && hours < 40) {
          setDataProcessing(false);
          return toast.info("Invoice creation failed: Total approved log hours is less than 40 hours");
        }

        if ((!isGrouplead || !isTeamlead) && hours < 20) {
          setDataProcessing(false);
          return toast.info("Invoice creation failed: Total approved log hours is less than 20 hours");
        }

        let allAttendanceData = [];

        for (let i = 1; i <= 1 + (attendanceProjects.length - 1); i++) {
          allAttendanceData.push(
            res[i]?.data?.data[`${currentUser.userinfo.username}`]
          );
        }

        console.log(allAttendanceData);

        if (
          !allAttendanceData
            .flat()
            .find((item) => item.dates_present.length > 0)
        ) {
          setDataProcessing(false);
          return toast.info("Invoice creation failed: No attendance data found for specified period");
        }

        const templateID = "64ece51ba57293efb539e5b7";

        const dataForInvoice = {
          user_id: currentUser.userinfo.userID,
          company_id: currentUser.portfolio_info[0].org_id,
          company_name: currentUser.portfolio_info[0].org_name,
          created_by: currentUser.userinfo.username,
          portfolio: currentUser.portfolio_info[0].portfolio_name,
          data_type: currentUser.portfolio_info[0].data_type,
          payment_month: month,
          payment_year: year,
          payment_from: paymentFrom,
          payment_to: paymentTo,
          approved_logs_count: approvedLogs.length,
          total_logs_required: requiredLogCount,
          user_was_on_leave: false,
        };

        const dataForWorkflow = {
          company_id: currentUser.portfolio_info[0].org_id,
          company_name: currentUser.portfolio_info[0].org_name,
          template_id: templateID,
          created_by: currentUser.userinfo.username,
          portfolio: currentUser.portfolio_info[0].portfolio_name,
          data_type: currentUser.portfolio_info[0].data_type,
          payment_month: month,
          payment_year: year,
          hr_username: "DummyHR",
          hr_portfolio: "DummyHR_Portfolio",
          accounts_username: "DummyAC",
          accounts_portfolio: "DummyAC_Portfolio",
        };

        Promise.all([
          processPayment(dataForInvoice),
          workFlowdetails(dataForWorkflow),
        ])
          .then((res) => {
            const masterQrCodeDetails =
              res[1]?.data?.created_process.master_code;
            const masterLinkDetails = res[1]?.data?.created_process.master_link;

            setShowMasterCode(masterQrCodeDetails);
            setShowMasterLink(masterLinkDetails);

            setDataProcessing(false);
            setShowInvoicePage(true);
          })
          .catch((err) => {
            console.log(err?.response ? err?.response?.data : err?.message);
            setDataProcessing(false);
            toast.error(
              "Invoice creation not successful. Please try again or contact the team for assistance"
            );
          });
      })
      .catch((err) => {
        console.log(err?.response ? err?.response?.data : err?.message);
        setDataProcessing(false);
        toast.error("Invoice creation failed. Please try again");
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
                  <span>Select Dates</span>
                  <div className={styles.invoice_date_select}>
                    <label htmlFor="payment_from">
                      <span>Payment from</span>
                      <input
                        type="date"
                        value={formatDateForAPI(paymentFrom)}
                        onChange={handleFromDateChange}
                        id="payment_from"
                        className={styles.invoice_months}
                      />
                    </label>
                    <label htmlFor="payment_to">
                      <span>Payment to</span>
                      <input
                        type="date"
                        value={formatDateForAPI(paymentTo)}
                        onChange={handleToDateChange}
                        id="payment_to"
                        min={formatDateForAPI(paymentFrom)}
                        className={styles.invoice_months}
                      />
                    </label>
                  </div>
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
