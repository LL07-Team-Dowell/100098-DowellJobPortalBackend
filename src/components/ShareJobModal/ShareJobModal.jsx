import { AiOutlineClose, AiOutlineLink } from "react-icons/ai";
import styles from "./styles.module.css";
import { IoCopyOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import React from "react";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createNewProductLink,
  createNewReportsLink,
  generatePublicJobLink,
  getUsedQrCodes,
} from "../../services/adminServices";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useEffect } from "react";
import { useRef } from "react";
import { useJobContext } from "../../contexts/Jobs";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { formatDateForAPI } from "../../helpers/helpers";


const date = new Date();
const dateSevenDaysAgo = new Date(new Date().setDate(date.getDate() - 7));

const [
  todayDateFormattedForAPI,
  dateSevenDaysAgoFormattedForAPI,
] = [
  formatDateForAPI(date),
  formatDateForAPI(dateSevenDaysAgo),
];


const ShareJobModal = ({ linkToShareObj, handleCloseModal, isProductLink, isReportLink }) => {
  const [copyOptionActive, setCopyOptionActive] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [mouseOverShareLinkContainer, setMouseOverShareLinkContainer] =
    useState(false);
  const [linkToDisplay, setLinkToDisplay] = useState("");
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const [publicIds, setPublicIds] = useState([]);
  const [maximumNumberOfPublicIds, setMaximumNumberOfPublicIds] = useState(0);
  const [publicIdsSelected, setPublicIdsSelected] = useState([]);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const selectItemRef = useRef();
  const { 
    jobLinks, 
    setJobLinks, 
    productLinks, 
    setProductLinks, 
    reportLinks, 
    setReportLinks 
  } = useJobContext();
  const [usedIdsLoaded, setUsedIdsLoaded] = useState(false);
  const [ customLinksNumber, setCustomLinksNumber ] = useState(null);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ customLinkName, setCustomLinkName ] = useState("");
  const [ jobCategory, setJobCategory ] = useState(null);
  const [ reportsCategory, setReportsCategory ] = useState(null);
  const [ datesSelection, setDatesSelection ] = useState({
    startDate: dateSevenDaysAgoFormattedForAPI,
    endDate: todayDateFormattedForAPI,
  });
  const [ threshold, setThreshold ] = useState(30);

  useEffect(() => {
    if (!currentUser) return;

    const publicIdsToSet = currentUser?.userportfolio?.filter(
      (portfolio) => portfolio.member_type === "public"
    );

    getUsedQrCodes(currentUser.portfolio_info[0].org_id)
      .then((res) => {
        const dataGotten = res.data?.data;
        const usedQrCodes =
          typeof dataGotten === "object"
            ? Object.keys(dataGotten).map((key) => dataGotten[key])
            : [];

        const publicIdsToDisplay = publicIdsToSet.map((item) => {
          return {
            ...item,
            username: item?.username?.filter(
              (name) => !usedQrCodes.includes(name)
            ),
          };
        });

        setPublicIds(publicIdsToDisplay);
        setMaximumNumberOfPublicIds(
          Math.max(...publicIdsToDisplay.map((item) => item.username.length))
        );
        setUsedIdsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        toast.info("Used qr codes failed to load");
        setPublicIds([]);
        setMaximumNumberOfPublicIds(1);
        setUsedIdsLoaded(true);
      });
  }, []);

  const handleShareItem = async (optionPassed) => {
    // console.log(linkToShare);

    switch (optionPassed?.type) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${linkToDisplay}`,
          "_blank"
        );
        handleCloseModal();
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${linkToDisplay}`,
          "_blank"
        );
        handleCloseModal();
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?&text=${linkToDisplay}`,
          "_blank"
        );
        handleCloseModal();
        break;
      case "link":
        setActiveItemId(optionPassed._id);
        setCopyOptionActive(true);
        break;
      default:
        console.log("Invalid action passed");
        handleCloseModal();
        break;
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(decodeURIComponent(linkToDisplay));
    toast.success("Link copied to clipboard!");
    handleCloseModal();
  };

  const handleItemClick = async (item) => {
    const [currentIdsSelected, itemAlreadySelected] = [
      publicIdsSelected.slice(),
      publicIdsSelected.find((id) => id === item),
    ];

    selectItemRef.current.value = "";

    if (itemAlreadySelected) {
      setPublicIdsSelected(
        currentIdsSelected.filter((id) => id !== itemAlreadySelected)
      );
      return;
    }

    currentIdsSelected.push(item);
    setPublicIdsSelected(currentIdsSelected);
  };

  const handleGenerateLink = async () => {
    if ((isProductLink || isReportLink) && currentPage === 1) return setCurrentPage(currentPage + 1);

    const dataToPost = {
      qr_ids: publicIdsSelected,
      job_company_id: linkToShareObj?.job_company_id,
      job_id: linkToShareObj?.job_id,
      company_data_type: linkToShareObj?.company_data_type,
      job_name: linkToShareObj?.job_name,
    };

    const currentJobLinks = jobLinks.slice();
    const currentProductLinks = productLinks.slice();
    const currentReportLinks = reportLinks.slice();

    setLinkLoading(true);

    try {
      let response;
      if (isProductLink) {
        const productDataToPost = {
          "public_link_name": customLinkName,
          "product_url": linkToShareObj?.product_url,
          "qr_ids": publicIdsSelected,
          "job_company_id": linkToShareObj?.job_company_id,
          "company_data_type": linkToShareObj?.company_data_type,
        }

        if (jobCategory && jobCategory !== 'none') productDataToPost.job_category = jobCategory;

        response = (await createNewProductLink(productDataToPost)).data
      } else if (isReportLink) {
        const reportDataToPost = {
          "public_link_name": customLinkName,
          "product_url": linkToShareObj?.product_url,
          "qr_ids": publicIdsSelected,
          "job_company_id": linkToShareObj?.job_company_id,
          "company_data_type": linkToShareObj?.company_data_type,
          "report_type": reportsCategory,
        }

        if (reportsCategory === reportOptionsPermitted.organization_report || reportsCategory === reportOptionsPermitted.leaderboard_report) {
          reportDataToPost.start_date = datesSelection.startDate;
          reportDataToPost.end_date = datesSelection.endDate;
        }

        if (reportsCategory === reportOptionsPermitted.leaderboard_report) {
          reportDataToPost.threshold = threshold;
        }

        response = (await createNewReportsLink(reportDataToPost)).data
      } else {
        response = (await generatePublicJobLink(dataToPost)).data;
      }

      // console.log(response);
      setQrCodeImage(response.qr_code);
      setLinkToDisplay(response.master_link);
      setLinkGenerated(true);

      if (isProductLink) {
        currentProductLinks.unshift({
          link_name: response.link_name,
          master_link: response.master_link
        });
        setProductLinks(currentProductLinks);
        return
      }

      if (isReportLink) {
        currentReportLinks.unshift({
          link_name: response.link_name,
          master_link: response.master_link
        });
        setReportLinks(currentReportLinks);
        return
      }
      
      currentJobLinks.unshift({
        job_name: response.job_name,
        master_link: response.master_link,
        newly_created: true,
      });
      setJobLinks(currentJobLinks);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info(
        error.response
          ? error.response.status === 500
            ? 'Link creation failed'
            : error.response.data.message
          : 'Link creation failed'
      );
    }

    setLinkLoading(false);
  };

  const handleSelectCustomBtnClick = () => {
    if (!customLinksNumber) return

    const currentPublicIds = publicIds.slice();
    const publicItemsIds = currentPublicIds.map(idItem => idItem.username.map(userItem => userItem)).flat();
    if (customLinksNumber > publicItemsIds.length) return toast.info(`You cannot add ${customLinksNumber} links because you only have ${publicItemsIds.length} links.`);

    const publicIdsToSelect = publicItemsIds.slice(0, Number(customLinksNumber));

    setPublicIdsSelected(publicIdsToSelect);
  }

  const handleChange = (val) => {
    const filteredValue = val.replace(/\D/g, "");
    setThreshold(filteredValue);
}

  return (
    <>
      <div className={styles.share__Overlay}>
        <div className={styles.share__Modal}>
          <div className={styles.share__Modal__CLose__Container}>
            <AiOutlineClose
              className={styles.share__Modal__CLose__Icon}
              onClick={handleCloseModal}
            />
          </div>
          <div>
            {
              currentPage === 1 ? 
              <h2>Share {isProductLink ? 'Product' : isReportLink ? 'Report' : 'Job'}</h2> : 
              <h2 style={{ textTransform: 'capitalize' }}>
                {
                  linkGenerated ? `${customLinkName} created!` : 
                  "Add custom name"
                }
              </h2>
            }
            <p className={styles.share__Subtitle__Info}>
              {
                !linkGenerated
                ? 
                  isProductLink ?
                    currentPage === 1 ?
                      "Generate a link to this product for others to view your active jobs"
                    :
                      "One last step, add a custom name for this link"
                  :
                  isReportLink ?
                    currentPage === 1 ?
                      "Generate a report link for others to view specific insights on your organization"
                    :
                      "One last step, add a custom name for this link"
                  :
                  "Generate a link for this job to share to other platforms"
                : 
                  isProductLink ?
                  "Share this product link to other platforms"
                  :
                  isReportLink ?
                  "Share this report link to other platforms"
                  :
                "Share a link for this job to other platforms for people to apply"
              }
            </p>
          </div>
          {
            currentPage === 1 && !linkGenerated ? <div className={styles.select__Links__Num}>
              <label>
                <span>Enter number of links</span>
                <input 
                  placeholder="10"
                  value={customLinksNumber}
                  onChange={({ target }) => setCustomLinksNumber(target.value.replace(/\D/g, ""))}
                />
              </label>
              <button
                className={`${styles.copy__Link__Btn} ${styles.generate__Link__Btn}`}
                onClick={() => handleSelectCustomBtnClick()}
                disabled={linkLoading || !customLinksNumber}
              >
                Go
              </button>
            </div> : <></>
          }
          {!linkGenerated ? (
            <>
              <div className={styles.select__Items__Wrapper}>
                {
                  currentPage === 1 ? <>
                    <p className={styles.select__Items__Text}>
                      <span style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>Total available links: {maximumNumberOfPublicIds}</span>
                    </p>
                    <p className={styles.select__Items__Text}>
                      <span>Select public links</span>
                      <span className={styles.indicator}>
                        Selection Count: {publicIdsSelected.length}
                      </span>
                    </p>
                  </> : <>
                    <div className={`${styles.select__Links__Num} ${styles.last__Page}`}>
                      <label>
                        <span>Enter name for link <span className={styles.required}>*</span></span>
                        <input 
                          placeholder="custom link name"
                          value={customLinkName}
                          onChange={({ target }) => setCustomLinkName(target.value)}
                        />
                      </label>
                      <label>
                        {
                          isProductLink ? <>
                            <span>Select custom job category for link</span>
                            <select
                              defaultValue={''}
                              onChange={({ target }) => setJobCategory(target.value)}
                              className={styles.select__Category}
                            >
                              <option value={''} selected disabled>Select job category</option>
                              <option value={'none'}>All</option>
                              {
                                React.Children.toArray(validJobCategories.map(category => {
                                  return <option value={category}>{category} jobs</option>
                                }))
                              }
                            </select>
                          </> :
                          isReportLink ? <>
                            <span>Select reports category for link <span className={styles.required}>*</span></span>
                            <select
                              defaultValue={''}
                              onChange={({ target }) => setReportsCategory(target.value)}
                              className={styles.select__Category}
                            >
                              <option value={''} selected disabled>Select report category</option>
                              {
                                React.Children.toArray(validReportOptions.map(option => {
                                  return <option value={option}>{option} report</option>
                                }))
                              }
                            </select>
                          </> :
                          <>
                          </>
                        }
                      </label>
                      {
                        reportsCategory === reportOptionsPermitted.leaderboard_report ?
                          <>
                            <label>
                              <span>Select threshold <span className={styles.required}>*</span></span>
                              <input
                                type="number"
                                onChange={(e) => handleChange(e.target.value)}
                                value={threshold}
                              />
                            </label>
                          </>
                        :
                          <></>
                      }

                      {
                        reportsCategory === reportOptionsPermitted.organization_report || reportsCategory === reportOptionsPermitted.leaderboard_report ?
                          <>
                            <label>
                              <span>Select start date of report <span className={styles.required}>*</span></span>
                              <input
                                type="date"
                                onChange={({ target }) => setDatesSelection((prev) => { return {...prev, startDate: target.value}})}
                                value={datesSelection.startDate}
                              />
                            </label>

                            <label>
                              <span>Select end date of report <span className={styles.required}>*</span></span>
                              <input
                                type="date"
                                onChange={({ target }) => setDatesSelection((prev) => { return {...prev, endDate: target.value}})}
                                value={datesSelection.endDate}
                              />
                            </label>
                          </>
                        :
                        <></>
                      }
                    </div>
                  </>
                }
                {usedIdsLoaded ? 
                  currentPage === 2 ? <></> :
                  (
                  <select
                    className={styles.select__Item}
                    ref={selectItemRef}
                    size={
                      maximumNumberOfPublicIds > 8
                        ? 8
                        : maximumNumberOfPublicIds <= 1
                        ? 2
                        : maximumNumberOfPublicIds
                    }
                    style={{
                      pointerEvents: linkLoading ? "none" : "all",
                    }}
                  >
                    {React.Children.toArray(
                      publicIds.map((idItem) => {
                        return (
                          <>
                            <option value="" hidden></option>
                            {React.Children.toArray(
                              idItem.username.map((item) => {
                                return (
                                  <option
                                    onClick={() => handleItemClick(item)}
                                    className={
                                      publicIdsSelected.find(
                                        (id) => id === item
                                      )
                                        ? styles.active__Item
                                        : ""
                                    }
                                  >
                                    {item} - {idItem?.portfolio_name}
                                  </option>
                                );
                              })
                            )}
                          </>
                        );
                      })
                    )}
                  </select>
                ) : (
                  <LoadingSpinner />
                )}
              </div>
              {
                !linkGenerated && <button
                  className={`${styles.copy__Link__Btn} ${styles.generate__Link__Btn}`}
                  onClick={() => handleGenerateLink()}
                  disabled={
                    linkLoading || 
                    publicIdsSelected.length < 1 || 
                    (isProductLink && currentPage === 2 && customLinkName.length < 1) || 
                    (isReportLink && currentPage === 2 && (customLinkName.length < 1 || !reportsCategory))
                  }
                >
                  {linkLoading ? (
                    <LoadingSpinner
                      width={"1rem"}
                      height={"1rem"}
                      color={"#fff"}
                    />
                  ) : (
                    ((isProductLink || isReportLink) && currentPage === 1) ?
                      "Next"
                    :
                    "Generate link"
                  )}
                </button>
              }
            </>
          ) : (
            <>
              <div className={styles.qr__code__Item}>
                <img src={qrCodeImage} alt="job qr code" />
              </div>
              <ul className={styles.share__Items__Container}>
                {React.Children.toArray(
                  shareOptions.map((option) => {
                    return (
                      <>
                        <li
                          onClick={() => handleShareItem(option)}
                          className={`${styles.share__Item} ${
                            activeItemId === option._id ? styles.active : ""
                          }`}
                          data-tooltip-id={option._id}
                          data-tooltip-content={option.title}
                        >
                          <span>{option.icon}</span>
                        </li>
                        <Tooltip id={option._id} />
                      </>
                    );
                  })
                )}
              </ul>

              {copyOptionActive && (
                <>
                  <div
                    className={styles.link__Wrapper}
                    onMouseOver={() => setMouseOverShareLinkContainer(true)}
                    onMouseLeave={() => setMouseOverShareLinkContainer(false)}
                    onClick={() => handleCopyLink()}
                  >
                    <pre className={styles.link__Content}>
                      <span>{linkToDisplay}</span>
                    </pre>
                    {mouseOverShareLinkContainer && (
                      <div className={styles.copy__Link__Icon}>
                        <IoCopyOutline />
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.copy__Link__Btn}
                    onClick={() => handleCopyLink()}
                  >
                    Copy
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const shareOptions = [
  {
    title: "Share to Facebook",
    icon: <FaFacebook />,
    type: "facebook",
    _id: crypto.randomUUID(),
  },
  {
    title: "Share to Twitter",
    icon: <FaTwitter />,
    type: "twitter",
    _id: crypto.randomUUID(),
  },
  {
    title: "Share on WhatsApp",
    icon: <IoLogoWhatsapp />,
    type: "whatsapp",
    _id: crypto.randomUUID(),
  },
  {
    title: "Share link",
    icon: <AiOutlineLink />,
    type: "link",
    _id: crypto.randomUUID(),
  },
];

const validJobCategories = [
  'Freelancer',
  'Employee',
  'Internship',
]

const validReportOptions = [
  'organization',
  'individual',
  'work log',
  'team',
  'leaderboard',
]

export const reportOptionsPermitted = {
  'organization_report': 'organization',
  'individual_report': 'individual',
  'task_report': 'work log',
  'team_report': 'team', 
  'leaderboard_report': 'leaderboard',
}

export default ShareJobModal;
