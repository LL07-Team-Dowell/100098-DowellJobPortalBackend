import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Footer from "../../components/Footer/Footer";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { AiOutlineDown } from "react-icons/ai";
import { validateEmail, validateUrl } from "../../../../helpers/helpers";
import {
  countriesData,
  dowellInfo,
  dowellLinks,
  freelancingPlatforms,
  qualificationsData,
} from "../../utils/jobFormApplicationData";
import {
  mutableNewApplicationStateNames,
  useNewApplicationContext,
} from "../../../../contexts/NewApplicationContext";
import {
  newJobApplicationDataReducer,
  newJobApplicationDataReducerActions,
} from "../../../../reducers/NewJobApplicationDataReducer";
import "./style.css";
import { handleShareBtnClick } from "../../utils/helperFunctions";
import { BsCashStack } from "react-icons/bs";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
// import { candidateStatuses } from "../../utils/candidateStatuses";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import { IoBookmarkSharp } from "react-icons/io5";
import { RiShareBoxFill } from "react-icons/ri";
import { IoMdShare, IoIosArrowRoundForward } from "react-icons/io";
import { VscCalendar } from "react-icons/vsc";
import { BsClock } from "react-icons/bs";
import { useMediaQuery } from "@mui/material";
import {
  getJobs,
  submitPublicApplication,
} from "../../../../services/candidateServices";
import { dowellLoginUrl } from "../../../../services/axios";
import { submitNewApplication } from "../../../../services/candidateServices";
import { toast } from "react-toastify";
import { jobKeys } from "../../../AdminPage/utils/jobKeys";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import ReactDOMServer from "react-dom/server";
import ApplicationSubmissionContent from "../../../../templates/applicationSubmition";
import { sendMailUsingDowell } from "../../../../services/mailServices";
import SuccessPublicSubmissionModal from "../../components/SuccessPublicSubmissionModal/SuccessPublicSubmissionModal";
import { uxlivingLabURL, speedTestURL } from "../../../../utils/utils";
import userNotFoundImage from "../../../../assets/images/user-not-found.jpg";
import { Translate } from "@mui/icons-material";
import { getInternetSpeedTest } from "../../../../services/speedTestServices";

const JobApplicationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentJob, setCurrentJob] = useState({});
  const { newApplicationData, dispatchToNewApplicationData } =
    useNewApplicationContext();
  const [disableApplyBtn, setDisableApplyBtn] = useState(false);
  const { section, id } = useParams();
  const selectCountryOptionRef = useRef(null);
  const qualificationSelectionRef = useRef(null);
  const freelancePlatformRef = useRef(null);
  const [disableNextBtn, setDisableNextBtn] = useState(false);
  const generalTermsSelectionsRef = useRef([]);
  const [labelClicked, setLabelClicked] = useState(false);
  const [showQualificationInput, setShowQualificationInput] = useState(false);
  const technicalTermsSelectionsRef = useRef([]);
  const paymentTermsSelectionsRef = useRef([]);
  const workflowTermsSelectionsRef = useRef([]);
  const [removeFreelanceOptions, setRemoveFreelanceOptions] = useState(false);
  const { jobs, setJobs } = useJobContext();
  const [jobsLoading, setJobsLoading] = useState(true);
  const {
    currentUser,
    isPublicUser,
    publicUserDetails,
    userDetailsNotFound,
    setPublicUserDetails,
    isProductUser,
    productUserDetails,
    setProductUserDetails,
  } = useCurrentUserContext();
  const [jobSaved, setJobSaved] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const [formPage, setFormPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  const addToRefsArray = (elem, arrayToAddTo) => {
    if (elem && !arrayToAddTo.current.includes(elem))
      arrayToAddTo.current.push(elem);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  };

  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPublicSuccessModal, setShowPublicSuccessModal] = useState(false);
  const [showInternetSpeedTestModal, setShowInternetSpeedTestModal] =
    useState(false);
  const [publicSuccessModalBtnDisabled, setPublicSuccessModalBtnDisabled] =
    useState(false);

  console.log(testResult);
  console.log(error);
  console.log({ currentJob });
  const netSpeed = (e) => {
    e.preventDefault();
    const email = newApplicationData?.applicant_email;

    if (!isEmailValid) return;

    getInternetSpeedTest(email)
      .then((res) => {
        const speedResultss = res.data.response.filter(
          (item) =>
            new Date(item.DATETIME).toDateString() === new Date().toDateString()
        );
        if (speedResultss.length < 1) {
          setShowInternetSpeedTestModal(true);
        } else {
          toast.success("Speed test upload successful");
          dispatchToNewApplicationData({
            type: newJobApplicationDataReducerActions.UPDATE_INTERNET_SPEED,
            payload: {
              stateToChange: mutableNewApplicationStateNames.internet_speed,
              value: res.data.response[0].DOWNLOAD,
            },
          });
        }
        console.log(res.data.response[0].DOWNLOAD);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (jobs.length > 0) return setJobsLoading(false);

    setJobsLoading(true);

    if (!currentUser) {
      if (userDetailsNotFound) return navigate("/");
      if (!isPublicUser && !isProductUser) return setJobsLoading(false);

      const [companyIdToUse, dataTypeToUse] = [
        isPublicUser
          ? publicUserDetails?.company_id
          : productUserDetails?.company_id,
        isPublicUser
          ? publicUserDetails?.data_type
          : productUserDetails?.data_type,
      ];

      getJobs(companyIdToUse)
        .then((res) => {
          const filterJob = res.data.response.data
            .filter((job) => job.data_type === dataTypeToUse)
            .filter((job) => !job.is_internal);
          setJobs(
            filterJob.sort(
              (a, b) => new Date(b.created_on) - new Date(a.created_on)
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });

      setJobsLoading(false);

      return;
    }

    const datass = currentUser?.portfolio_info[0]?.org_id;
    getJobs(datass)
      .then((res) => {
        const userAppliedJobs = res.data.response.data
          .filter(
            (job) => job.data_type === currentUser?.portfolio_info[0].data_type
          )
          .filter((job) => !job.is_internal);
        // setjobs(res.data);
        setJobs(userAppliedJobs);
        setJobsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setJobsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!id) return navigate("/home");
    if (jobsLoading || jobs.length < 1) return;

    // if (typeof (Number(id)) !== "number") return navigate("/home");
    const foundJob = jobs.find((job) => job._id === id);
    if (!foundJob) return navigate("/home");

    setCurrentJob(foundJob);
  }, [id, jobsLoading, jobs]);

  useEffect(() => {
    if (
      location.pathname.includes("form") ||
      location.pathname.split("/").includes("form")
    )
      return setDisableNextBtn(true);

    setDisableApplyBtn(false);
  }, [location]);

  useEffect(() => {
    if (jobsLoading) return;
    if (!currentUser && !isPublicUser && !isProductUser) return;

    setDisableApplyBtn(false);
    setDisableNextBtn(true);

    generalTermsSelectionsRef.current.splice(
      0,
      generalTermsSelectionsRef.current.length
    );
    technicalTermsSelectionsRef.current.splice(
      0,
      technicalTermsSelectionsRef.current.length
    );
    paymentTermsSelectionsRef.current.splice(
      0,
      paymentTermsSelectionsRef.current.length
    );
    workflowTermsSelectionsRef.current.splice(
      0,
      workflowTermsSelectionsRef.current.length
    );

    const currentState = { ...newApplicationData };

    if (
      currentJob.typeof === "Employee" ||
      currentJob.typeof === "Internship"
    ) {
      delete currentState[mutableNewApplicationStateNames.freelancePlatform];
      delete currentState[mutableNewApplicationStateNames.freelancePlatformUrl];

      // if (currentUser.role !== process.env.REACT_APP_GUEST_ROLE) {
      //     delete currentState.others[mutableNewApplicationStateNames.others_applicant_first_name];
      //     delete currentState.others[mutableNewApplicationStateNames.others_applicant_email];
      // }

      dispatchToNewApplicationData({
        type: newJobApplicationDataReducerActions.REWRITE_EXISTING_STATE,
        payload: { newState: currentState },
      });
    }

    if (
      (currentJob.job_category !== "Employee" ||
        currentJob.job_category !== "Internship") &&
      !isPublicUser &&
      !isProductUser
    ) {
      //delete currentState.others[mutableNewApplicationStateNames.others_applicant_first_name];
      //delete currentState.others[mutableNewApplicationStateNames.others_applicant_email];
      //dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.REWRITE_EXISTING_STATE, payload: { newState: currentState } });

      delete currentState.applicant;
      delete currentState.applicant_email;
      dispatchToNewApplicationData({
        type: newJobApplicationDataReducerActions.REWRITE_EXISTING_STATE,
        payload: { newState: currentState },
      });
      //  console.log(currentState);
    }

    // if (currentUser.role === process.env.REACT_APP_GUEST_ROLE) {
    //     dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_APPLICANT_FIRST_NAME, payload: { stateToChange: mutableNewApplicationStateNames.others_applicant_first_name, value: currentUser.username.split("_")[1] } });
    //     dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_APPLICATION_STATUS, payload: { stateToChange: mutableNewApplicationStateNames.status, value: candidateStatuses.GUEST_PENDING_SELECTION } });
    // }

    Object.keys(currentJob.other_info || {}).forEach((item) => {
      dispatchToNewApplicationData({
        type: newJobApplicationDataReducerActions.UPDATE_OTHERS,
        payload: { stateToChange: item, value: "" },
      });
    });

    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_JOB,
      payload: {
        stateToChange: mutableNewApplicationStateNames._id,
        value: currentJob._id,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_JOB_TITLE,
      payload: {
        stateToChange: mutableNewApplicationStateNames.job_title,
        value: currentJob.job_title,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_JOB_NUMBER,
      payload: {
        stateToChange: mutableNewApplicationStateNames.job_number,
        value: currentJob.job_number,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_PAYMENT,
      payload: {
        stateToChange: mutableNewApplicationStateNames.payment,
        value: currentJob.payment,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_MODULE,
      payload: {
        stateToChange: mutableNewApplicationStateNames.module,
        value: currentJob.module,
      },
    });

    // console.log(currentJob);
    // dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_TIME_INTERVAL, payload: { stateToChange: mutableNewApplicationStateNames.time_interval, value: currentJob.time_interval } });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_USERNAME,
      payload: {
        stateToChange: mutableNewApplicationStateNames.username,
        value: isPublicUser
          ? publicUserDetails?.qr_id
          : isProductUser
          ? productUserDetails?.qr_id
          : currentUser.userinfo.username,
      },
    });
    !isPublicUser &&
      !isProductUser &&
      dispatchToNewApplicationData({
        type: newJobApplicationDataReducerActions.UPDATE_APPLICANT_EMAIL,
        payload: {
          stateToChange: mutableNewApplicationStateNames.others_applicant_email,
          value: currentUser.userinfo.email,
        },
      });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_COMPANY_ID,
      payload: {
        stateToChange: mutableNewApplicationStateNames.company_id,
        value: isPublicUser
          ? publicUserDetails?.company_id
          : isProductUser
          ? productUserDetails?.company_id
          : currentUser.portfolio_info[0].org_id,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_DATA_TYPE,
      payload: {
        stateToChange: mutableNewApplicationStateNames.data_type,
        value: isPublicUser
          ? publicUserDetails?.data_type
          : isProductUser
          ? productUserDetails?.data_type
          : currentUser.portfolio_info[0].data_type,
      },
    });
    // console.log(currentUser);
    // dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_APPLICANT, payload: { stateToChange: mutableNewApplicationStateNames.applicant, value: currentUser.username } })
    // dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_JOB_TITLE, payload: { stateToChange: mutableNewApplicationStateNames.title, value: currentJob.title } })
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_DATE_APPLIED,
      payload: {
        stateToChange: mutableNewApplicationStateNames.application_submitted_on,
        value: new Date(),
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_JOB_DESCRIPTION,
      payload: {
        stateToChange: mutableNewApplicationStateNames.jobDescription,
        value: currentJob.description,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_JOB_CATEGORY,
      payload: {
        stateToChange: mutableNewApplicationStateNames.job_category,
        value: currentJob.job_category,
      },
    });
    dispatchToNewApplicationData({
      type: newJobApplicationDataReducerActions.UPDATE_PORTFOLIO_NAME,
      payload: {
        stateToChange: mutableNewApplicationStateNames.portfolio_name,
        value:
          isPublicUser || isProductUser
            ? ""
            : currentUser.portfolio_info[0].portfolio_name,
      },
    });

    if (currentJob.typeof === "Employee" || currentJob.typeof === "Internship")
      return setRemoveFreelanceOptions(true);

    setRemoveFreelanceOptions(false);
  }, [currentJob]);

  console.log(newApplicationData?.freelancePlatformUrl);

  const [seleteCategoryOption, setSelectCategoryOption] = useState("");
  const handleOptionChange = (e) => {
    setSelectCategoryOption(e.target.value);
  };
  const isUrlValid = validateUrl(newApplicationData?.freelancePlatformUrl);

  useEffect(() => {
    if (!currentUser && !isPublicUser && !isProductUser) return;

    if (formPage === 1) {
      if (generalTermsSelectionsRef.current.length === 0)
        return setDisableNextBtn(false);

      if (
        generalTermsSelectionsRef.current.every(
          (selection) => selection.checked === true
        )
      )
        return setDisableNextBtn(false);

      return setDisableNextBtn(true);
    }

    if (formPage === 2) {
      if (technicalTermsSelectionsRef.current.length === 0)
        return setFormPage(formPage + 1);

      if (
        technicalTermsSelectionsRef.current.every(
          (selection) => selection.checked === true
        )
      )
        return setDisableNextBtn(false);

      return setDisableNextBtn(true);
    }
    if (formPage === 3) {
      if (paymentTermsSelectionsRef.current.length === 0)
        return setFormPage(formPage + 1);

      if (
        paymentTermsSelectionsRef.current.every(
          (selection) => selection.checked === true
        )
      )
        return setDisableNextBtn(false);

      return setDisableNextBtn(true);
    }
    if (formPage === 4) {
      if (workflowTermsSelectionsRef.current.length === 0)
        return setFormPage(formPage + 1);

      if (
        workflowTermsSelectionsRef.current.every(
          (selection) => selection.checked === true
        )
      )
        return setDisableNextBtn(false);

      return setDisableNextBtn(true);
    }
    if (formPage === 5) {
      if (!qualificationSelectionRef.current) return;

      if (qualificationSelectionRef.current.value !== "default_") {
        dispatchToNewApplicationData({
          type: newJobApplicationDataReducerActions.UPDATE_QUALIFICATIONS,
          payload: {
            stateToChange:
              mutableNewApplicationStateNames.academic_qualification_type,
            value: qualificationSelectionRef.current.value,
          },
        });
        setShowQualificationInput(true);
      }

      dispatchToNewApplicationData({
        type: newJobApplicationDataReducerActions.UPDATE_COUNTRY,
        payload: {
          stateToChange: mutableNewApplicationStateNames.country,
          value: selectCountryOptionRef.current.value,
        },
      });
      // dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_FEEDBACK, payload: { stateToChange: mutableNewApplicationStateNames.feedBack, value: feedBack.current.value } })

      if (
        selectCountryOptionRef.current.value === "default_" ||
        newApplicationData.country.length < 1
      )
        return setDisableNextBtn(true);

      !removeFreelanceOptions &&
        dispatchToNewApplicationData({
          type: newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM,
          payload: {
            stateToChange: mutableNewApplicationStateNames.freelancePlatform,
            value: freelancePlatformRef.current.value,
          },
        });

      if (!removeFreelanceOptions) {
        if (
          freelancePlatformRef.current.value === "default_" ||
          newApplicationData.freelancePlatformUrl.length < 1
        )
          return setDisableNextBtn(true);

        if (!validateUrl(newApplicationData.freelancePlatformUrl, true))
          return setDisableNextBtn(true);
      }

      if (qualificationSelectionRef.current.value === "default_")
        return setDisableNextBtn(true);

      if (newApplicationData.academic_qualification_type.length < 1)
        return setDisableNextBtn(true);
      if (!newApplicationData.agree_to_all_terms) {
        return setDisableNextBtn(true);
      }

      return setDisableNextBtn(false);
    }

    return setDisableNextBtn(true);
  }, [
    formPage,
    labelClicked,
    newApplicationData?.country,
    newApplicationData?.freelancePlatformUrl,
    newApplicationData?.feedBack,
    newApplicationData?.applicant,
    newApplicationData?.other_info,
    section,
    removeFreelanceOptions,
    currentUser,
    isPublicUser,
    isProductUser,
  ]);

  useEffect(() => {
    if (newApplicationData?.applicant_email?.length < 1)
      return setIsEmailValid(true);

    if (!validateEmail(newApplicationData?.applicant_email))
      return setIsEmailValid(false);

    setIsEmailValid(true);
  }, [newApplicationData?.applicant_email]);

  const handleSubmitApplicationBtnClick = () => {
    if (!currentUser && !isPublicUser && !isProductUser)
      return (window.location.href = dowellLoginUrl + `/apply/job/${id}/`);
    // console.log(currentUser);
    setDisableApplyBtn(true);
    setDisableNextBtn(true);

    navigate(`/apply/job/${id}/form/`);
  };

  const handleSubmitNewApplication = async (e) => {
    e.preventDefault();
    if (
      newApplicationData.other_info &&
      typeof newApplicationData.other_info === "object"
    ) {
      const copyOfNewApplicationDataOtherInfo = {
        ...newApplicationData.other_info,
      };
      newApplicationData.other_info = Object.keys(
        copyOfNewApplicationDataOtherInfo
      ).map((key) => {
        return copyOfNewApplicationDataOtherInfo[key];
      });
    }
    console.log(newApplicationData);
    // return

    if (isPublicUser || isProductUser) {
      if (newApplicationData.applicant_email.length < 1)
        return toast.info("Please enter your email");
      if (!isEmailValid) return toast.info("Please enter a valid email");
      if (publicUserDetails.linkUsed)
        if (productUserDetails?.jobsAppliedFor?.includes(currentJob._id))
          return toast.info(
            "You have already submitted an application for this job"
          );
    }

    setDisableNextBtn(true);

    // PUBLIC USER APPLICATION SUBMISSION
    if (isPublicUser || isProductUser) {
      const copyOfNewApplicationData = structuredClone(newApplicationData);
      delete copyOfNewApplicationData.portfolio_name;

      let formData = new FormData();

      const htmlToSend = ReactDOMServer.renderToString(
        <ApplicationSubmissionContent
          name={newApplicationData.applicant}
          job={newApplicationData.job_title}
        />
      );
      const htmlFileBlob = new Blob([htmlToSend], { type: "text/html" });
      const htmlFile = new File([htmlFileBlob], "data.html", {
        type: htmlFileBlob.type,
      });

      formData.append("file", htmlFile);
      formData.append("toemail", newApplicationData.applicant_email);
      formData.append("toname", newApplicationData.applicant);
      formData.append("subject", "New Job Application Submission");

      submitPublicApplication(
        copyOfNewApplicationData,
        isPublicUser
          ? publicUserDetails?.masterLinkId
          : productUserDetails?.masterLinkId
      )
        .then(async (res) => {
          // console.log(res.data);
          let mailError = false;
          try {
            const mailResponse = (await sendMailUsingDowell(formData)).data;
            // console.log(mailResponse);
          } catch (error) {
            console.log(error);
            mailError = true;
          }

          toast.success(
            mailError
              ? "Your application was received but there was an issue trying to send a confirmation mail."
              : "Successfully submitted job application! Please check your email for a confirmation."
          );
          // setDisableNextBtn(false);
          isPublicUser && setShowPublicSuccessModal(true);

          if (isProductUser) {
            const updatedProductUser = { ...productUserDetails };

            if (updatedProductUser.jobsAppliedFor) {
              updatedProductUser.jobsAppliedFor.push(currentJob?._id);
            } else {
              updatedProductUser.jobsAppliedFor = [currentJob?._id];
            }

            setProductUserDetails(updatedProductUser);
            sessionStorage.setItem(
              "product_user",
              JSON.stringify(updatedProductUser)
            );

            navigate(`/jobs?jobCategory=${currentJob?.job_category}`);
            return;
          }

          const updatedPublicUser = { ...publicUserDetails };
          updatedPublicUser.linkUsed = true;

          setPublicUserDetails(updatedPublicUser);
          sessionStorage.setItem(
            "public_user",
            JSON.stringify(updatedPublicUser)
          );
        })
        .catch((err) => {
          console.log(err);
          toast.info("Application submission failed. Please try again");
          setDisableNextBtn(false);
        });

      return;
    }

    let formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    let imageUrl = "";
    if (selectedFile) {
      const response = await fetch(
        "https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-hr-image/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        imageUrl = data.file_url;
      } else {
        toast.error("Error uploading image");
      }
    }

    try {
      await submitNewApplication({
        ...newApplicationData,
        candidate_certificate: imageUrl,
      });
      toast.success("Successfully submitted job application!");
      navigate("/applied");
    } catch (error) {
      console.log(error);
      toast.info("Application submission failed. Please try again");
      setDisableNextBtn(false);
    }

    console.log(newApplicationData);
  };

  const createCheckBoxData = (data, arrayRef) => {
    return (
      <label
        className="form__Label"
        onClick={() => setLabelClicked(!labelClicked)}
      >
        <input
          type={"checkbox"}
          ref={(elem) => addToRefsArray(elem, arrayRef)}
        />
        <span>{data}</span>
      </label>
    );
  };

  const createInputData = (key, data) => {
    if (
      key === jobKeys.paymentForJob ||
      key === jobKeys.othersFreelancerJobType ||
      key === jobKeys.othersInternJobType ||
      key === jobKeys.othersResearchAssociateJobType
    )
      return <></>;

    return (
      <>
        <div className="job__Application__Item">
          <h2>
            {data}
            <span className="required-indicator">*</span>
          </h2>
          <label className="text__Container">
            <input
              type={"text"}
              placeholder={data}
              value={
                newApplicationData.other_info[key]
                  ? newApplicationData.other_info[key]
                  : ""
              }
              onChange={(e) =>
                dispatchToNewApplicationData({
                  type: newJobApplicationDataReducerActions.UPDATE_OTHERS,
                  payload: { stateToChange: key, value: e.target.value },
                })
              }
            />
          </label>
        </div>
      </>
    );
  };

  if (jobsLoading || !currentJob) return <LoadingSpinner />;
  if (currentJob?.is_active === false) return <CurrentJobNotFound />;

  return (
    <>
      <div className="candidate__Job__Application__Container">
        <TitleNavigationBar
          hideBackBtn={isPublicUser && section !== "form"}
          handleBackBtnClick={() => navigate(-1)}
        />
        {section === "form" ? (
          <>
            <div className="job__Title__Container">
              <div className="job__Title__Items">
                <h1 className="job__Title">
                  <b>Job Application Form for {currentJob.job_title}</b>
                </h1>
                <p>Dowell Ux living lab</p>
              </div>
              <div className="job__Share__Items">
                <button
                  className={`save__Btn grey__Btn ${jobSaved ? "active" : ""}`}
                  onClick={() => setJobSaved(!jobSaved)}
                >
                  {isLargeScreen && <span>{jobSaved ? "Saved" : "Save"}</span>}
                  <IoBookmarkSharp className="save__Icon" />
                </button>
                {/* <button
                  className="share__Btn grey__Btn"
                  onClick={() =>
                    handleShareBtnClick(
                      currentJob.title,
                      `Apply for ${currentJob.title} on Dowell!`,
                      window.location
                    )
                  }
                >
                  {isLargeScreen && <span>Share</span>}
                  <IoMdShare />
                </button> */}
              </div>
            </div>

            <div className="job__Application__Form__Wrapper">
              <p className="required__Indicator__Item">*Required</p>
              <form
                className="job__Application__Form"
                onSubmit={handleSubmitNewApplication}
              >
                {formPage === 1 && (
                  <>
                    <div className="job__Application__Items">
                      <div className="form__Title__Item">
                        <h2>
                          <b>General Terms and Conditions</b>
                        </h2>
                      </div>
                      <p className="form__Tick__Item">
                        Tick each box to continue
                      </p>
                      <p className="form__Salutations__Item">
                        Thank you for applying to freelancing opportunity in
                        uxlivinglab. Read following terms and conditions and
                        accept
                      </p>
                      {React.Children.toArray(
                        Object.keys(currentJob.general_terms || {}).map((key) =>
                          createCheckBoxData(
                            currentJob.general_terms[key],
                            generalTermsSelectionsRef
                          )
                        )
                      )}
                    </div>
                  </>
                )}

                {formPage === 2 && (
                  <>
                    <div className="job__Application__Items">
                      <div className="form__Title__Item">
                        <h2>
                          <b>Technical Specifications</b>
                        </h2>
                      </div>
                      <p className="form__Tick__Item">
                        Tick each box to approve
                      </p>
                      <p className="form__Salutations__Item">
                        Thank you for accepting terms and conditions. Read
                        following technical specifications and accept
                      </p>
                      {React.Children.toArray(
                        Object.keys(
                          currentJob.technical_specification || {}
                        ).map((key) =>
                          createCheckBoxData(
                            currentJob.technical_specification[key],
                            technicalTermsSelectionsRef
                          )
                        )
                      )}
                    </div>
                  </>
                )}

                {formPage === 3 && (
                  <>
                    <div className="job__Application__Items">
                      <div className="form__Title__Item">
                        <h2>
                          <b>Payment Terms</b>
                        </h2>
                      </div>
                      <p className="form__Tick__Item">
                        Tick each box to continue
                      </p>
                      <p className="form__Salutations__Item">
                        Thank you for accepting technical specifications. Read
                        following payment terms and accept
                      </p>
                      {React.Children.toArray(
                        Object.keys(currentJob.payment_terms || {}).map((key) =>
                          createCheckBoxData(
                            currentJob.payment_terms[key],
                            paymentTermsSelectionsRef
                          )
                        )
                      )}
                    </div>
                  </>
                )}

                {formPage === 4 && (
                  <>
                    <div className="job__Application__Items">
                      <div className="form__Title__Item">
                        <h2>
                          <b>Workflow Terms</b>
                        </h2>
                      </div>
                      <p className="form__Tick__Item">
                        Tick each box to continue
                      </p>
                      <p className="form__Salutations__Item">
                        Thank you for accepting payment terms. Read following
                        work flow to proceed
                      </p>
                      {React.Children.toArray(
                        Object.keys(currentJob.workflow_terms || {}).map(
                          (key) =>
                            createCheckBoxData(
                              currentJob.workflow_terms[key],
                              workflowTermsSelectionsRef
                            )
                        )
                      )}
                    </div>
                  </>
                )}

                {formPage === 5 && (
                  <>
                    <div className="form__Title__Item">
                      <h2>
                        <b>Basic Information</b>
                      </h2>
                    </div>

                    <div className="job__Application__Item">
                      <h2>
                        Enter Your Name
                        <span className="required-indicator">*</span>
                      </h2>
                      <label className="input__Text__Container">
                        <input
                          aria-label="link to profile on freelance platform"
                          type={"text"}
                          placeholder={"Enter Your Name"}
                          value={newApplicationData.applicant}
                          onChange={(e) =>
                            dispatchToNewApplicationData({
                              type: newJobApplicationDataReducerActions.UPDATE_APPLICANT,
                              payload: {
                                stateToChange:
                                  mutableNewApplicationStateNames.applicant,
                                value: e.target.value,
                              },
                            })
                          }
                        />
                      </label>
                    </div>

                    {(isPublicUser || isProductUser) && (
                      <div className="job__Application__Item">
                        <h2>
                          Enter Your Email
                          <span className="required-indicator">*</span>
                        </h2>
                        <label className="input__Text__Container">
                          <input
                            aria-label="your email"
                            type={"text"}
                            placeholder={"Enter Your Email"}
                            value={newApplicationData.applicant_email}
                            onChange={(e) =>
                              dispatchToNewApplicationData({
                                type: newJobApplicationDataReducerActions.UPDATE_APPLICANT_EMAIL,
                                payload: {
                                  stateToChange:
                                    mutableNewApplicationStateNames.applicant_email,
                                  value: e.target.value,
                                },
                              })
                            }
                          />
                        </label>

                        {!isEmailValid && (isPublicUser || isProductUser) && (
                          <p style={{ color: "red" }}>
                            Please enter a valid email
                          </p>
                        )}
                      </div>
                    )}

                    <div className="job__Application__Item">
                      <h2>
                        Enter Your Internet Speed
                        <span className="required-indicator">*</span>
                      </h2>
                      <label className="input__Text__Container speed__button">
                        <input
                          aria-label="Internet speed Test"
                          type={"text"}
                          placeholder={"Internet speed Test"}
                          value={newApplicationData.internet_speed}
                          readOnly
                        />
                        <button
                          onClick={(e) => netSpeed(e)}
                          style={{
                            padding: "0.3rem",
                            borderRadius: "0.3rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          Check
                        </button>
                      </label>
                    </div>
                    {showInternetSpeedTestModal && (
                      <SuccessPublicSubmissionModal
                        title={"Oops! No result found"}
                        body={
                          "You have not done your internet speed test yet. Please visit our site to take it now by clicking the button below"
                        }
                        submissionModalIcon={false}
                        handleBtnClick={() => {
                          setPublicSuccessModalBtnDisabled(true);
                          window.location.replace(speedTestURL);
                        }}
                        btnDisabled={publicSuccessModalBtnDisabled}
                      />
                    )}

                    <div className="job__Application__Item">
                      <h2>
                        Select Country
                        <span className="required-indicator">*</span>
                      </h2>
                      <div
                        className="select__Dropdown__Container"
                        onClick={() => setLabelClicked(!labelClicked)}
                      >
                        <select
                          name="country"
                          ref={selectCountryOptionRef}
                          defaultValue={"default_"}
                        >
                          <option value={"default_"} disabled>
                            Select Option
                          </option>
                          {React.Children.toArray(
                            countriesData.map((country) => {
                              return (
                                <option value={country.toLocaleLowerCase()}>
                                  {country}
                                </option>
                              );
                            })
                          )}
                        </select>
                        <AiOutlineDown
                          className="dropdown__Icon"
                          onClick={() => {
                            if (!selectCountryOptionRef.current) return;
                            selectCountryOptionRef.current.click();
                          }}
                        />
                      </div>
                    </div>

                    {removeFreelanceOptions ? (
                      <></>
                    ) : (
                      <>
                        <div className="job__Application__Item">
                          <h2>
                            Freelancing Profile
                            <span className="required-indicator">*</span>
                          </h2>
                          <div
                            className="select__Dropdown__Container"
                            onClick={() => setLabelClicked(!labelClicked)}
                          >
                            <select
                              name="freelancePlaform"
                              ref={freelancePlatformRef}
                              defaultValue={"default_"}
                            >
                              <option value={"default_"} disabled>
                                Select Option
                              </option>
                              {React.Children.toArray(
                                freelancingPlatforms.map((platform) => {
                                  return (
                                    <option
                                      value={platform.toLocaleLowerCase()}
                                    >
                                      {platform}
                                    </option>
                                  );
                                })
                              )}
                            </select>
                            <AiOutlineDown className="dropdown__Icon" />
                          </div>
                        </div>

                        <div className="job__Application__Item">
                          <h2>
                            Link to profile on freelancing platform
                            <span className="required-indicator">*</span>
                          </h2>
                          <label className="input__Text__Container">
                            <input
                              aria-label="link to profile on freelance platform"
                              type={"text"}
                              placeholder={"Link to profile on platform"}
                              value={newApplicationData.freelancePlatformUrl}
                              onChange={(e) =>
                                dispatchToNewApplicationData({
                                  type: newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM_URL,
                                  payload: {
                                    stateToChange:
                                      mutableNewApplicationStateNames.freelancePlatformUrl,
                                    value: e.target.value,
                                  },
                                })
                              }
                            />
                          </label>

                          {newApplicationData.freelancePlatformUrl && (
                            <p style={{ color: isUrlValid ? "black" : "red" }}>
                              {isUrlValid ? "" : "Use valid URL"}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div className="job__Application__Item">
                      <h2>Add Certification if any</h2>
                      <label className="input__Text__Container">
                        <input
                          aria-label="Add Certification"
                          type={"file"}
                          placeholder={"Add Certification"}
                          onChange={handleFileChange}
                        />
                        {selectedFile && (
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Uploaded Preview"
                            style={{ display: "block" }}
                          />
                        )}
                      </label>
                    </div>

                    <div className="job__Application__Item">
                      <h2>
                        Academic Qualifications
                        <span className="required-indicator">*</span>
                      </h2>
                      <div
                        className="select__Dropdown__Container"
                        onClick={() => setLabelClicked(!labelClicked)}
                      >
                        <select
                          name="qualifications"
                          ref={qualificationSelectionRef}
                          defaultValue={"default_"}
                        >
                          <option value={"default_"} disabled>
                            Select Option
                          </option>
                          {React.Children.toArray(
                            qualificationsData.map((qualification) => {
                              return (
                                <option
                                  value={qualification.toLocaleLowerCase()}
                                  onClick={() => setLabelClicked(!labelClicked)}
                                >
                                  {qualification}
                                </option>
                              );
                            })
                          )}
                        </select>
                        <AiOutlineDown className="dropdown__Icon" />
                      </div>
                    </div>

                    {showQualificationInput && (
                      <div className="job__Application__Item">
                        <h2 className="qualification__Title__Text">
                          Qualification
                          <span className="required-indicator">*</span>
                        </h2>
                        <label className="input__Text__Container">
                          <input
                            aria-label="your academic qualification"
                            type={"text"}
                            placeholder={"Academic Qualification"}
                            value={newApplicationData.academic_qualification}
                            onChange={(e) =>
                              dispatchToNewApplicationData({
                                type: newJobApplicationDataReducerActions.UPDATE_ACADEMIC_QUALIFICATION,
                                payload: {
                                  stateToChange:
                                    mutableNewApplicationStateNames.academic_qualification,
                                  value: e.target.value,
                                },
                              })
                            }
                          />
                        </label>
                      </div>
                    )}

                    <div className="job__Application__Item">
                      <h2>
                        Comments/Feedback
                        <span className="required-indicator">*</span>
                      </h2>
                      <label className="input__Text__Container">
                        <input
                          aria-label="feedback"
                          type={"text"}
                          placeholder={"Write Your Feedback"}
                          value={newApplicationData.feedBack}
                          onChange={(e) =>
                            dispatchToNewApplicationData({
                              type: newJobApplicationDataReducerActions.UPDATE_FEEDBACK,
                              payload: {
                                stateToChange:
                                  mutableNewApplicationStateNames.feedBack,
                                value: e.target.value,
                              },
                            })
                          }
                        />
                      </label>
                    </div>
                    {/* <div className="job__Application__Item comments">
                                        <label className="input__Text__Container">
                                            <h2>Comments/Feedback<span className="required-indicator">*</span></h2>
                                        </label>
                                    </div> */}

                    {currentJob.other_info &&
                      Array.isArray(currentJob.other_info) &&
                      currentJob.other_info.length > 0 &&
                      React.Children.toArray(
                        Object.keys(currentJob.other_info || {}).map((key) =>
                          createInputData(key, currentJob.other_info[key])
                        )
                      )}

                    <label
                      className="form__Label__Accept__All"
                      onClick={() => setLabelClicked(!labelClicked)}
                    >
                      <input
                        type={"checkbox"}
                        onChange={(e) =>
                          dispatchToNewApplicationData({
                            type: newJobApplicationDataReducerActions.UPDATE_AGREE_TO_ALL,
                            payload: {
                              stateToChange:
                                mutableNewApplicationStateNames.agree_to_all_terms,
                              value: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Agree/Disagree to all terms</span>
                    </label>

                    {/* <div className="job__Application__Item">
                                        <h2>Enter Your Discord ID<span className="required-indicator">*</span></h2>
                                        <label className="input__Text__Container">
                                            <input aria-label="link to profile on freelance platform" type={'text'} placeholder={'Enter Your Name'} value={newApplicationData.freelancePlatformUrl} onChange={(e) => dispatchToNewApplicationData({ type: newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM_URL, payload: { stateToChange: mutableNewApplicationStateNames.freelancePlatformUrl, value: e.target.value } })} />
                                        </label>
                                    </div> */}
                  </>
                )}

                {formPage !== 5 && (
                  <>
                    <button
                      className="apply__Btn green__Btn"
                      type="button"
                      onClick={() => {
                        setFormPage(formPage + 1);
                      }}
                      disabled={disableNextBtn}
                    >
                      <span>Next</span>
                      <IoIosArrowRoundForward />
                    </button>
                  </>
                )}

                {formPage === 5 && (
                  <>
                    <button
                      className="apply__Btn green__Btn"
                      type="submit"
                      onClick={handleSubmitNewApplication}
                      disabled={disableNextBtn}
                    >
                      <span>Submit</span>
                      <IoIosArrowRoundForward />
                    </button>
                  </>
                )}
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="job__Title__Container">
              <div className="job__Title__Items">
                <h1 className="job__Title">
                  <b>{currentJob.job_title}</b>
                </h1>
                <p>Dowell Ux living lab</p>
              </div>
              <div className="job__Share__Items">
                <button
                  className={`save__Btn grey__Btn ${jobSaved ? "active" : ""}`}
                  onClick={() => setJobSaved(!jobSaved)}
                >
                  {isLargeScreen && <span>{jobSaved ? "Saved" : "Save"}</span>}
                  <IoBookmarkSharp className="save__Icon" />
                </button>
                {/* <button
                  className="share__Btn grey__Btn"
                  onClick={() =>
                    handleShareBtnClick(
                      currentJob.title,
                      `Apply for ${currentJob.title} on Dowell!`,
                      window.location
                    )
                  }
                >
                  {isLargeScreen && <span>Share</span>}
                  <IoMdShare />
                </button> */}
              </div>
            </div>
            <div className="job__Info__Container">
              <div className="job__Skills__Info">
                <span className="job__Skill__Wrapper">
                  <VscCalendar className="info__Icon" />
                  <span>
                    Start Date:&nbsp;
                    <span className="highlight__Job__Info">Immediately</span>
                  </span>
                </span>
                {
                  <span className="job__Skill__Wrapper">
                    <BusinessCenterIcon className="info__Icon" />
                    <span>
                      Job Type:&nbsp;
                      <span className="highlight__Job__Info">
                        {currentJob.type_of_job}
                      </span>
                    </span>
                  </span>
                }
                {/* {
                                    currentJob.others && currentJob.others[jobKeys.othersResearchAssociateJobType] &&
                                    <span className="job__Skill__Wrapper">
                                        <BusinessCenterIcon className="info__Icon" />
                                        <span>Job Type:&nbsp;<span className="highlight__Job__Info">{currentJob.others[jobKeys.othersResearchAssociateJobType]}</span></span>
                                    </span>
                                } */}
                {/* {
                                    currentJob.others && currentJob.others[jobKeys.othersFreelancerJobType] &&
                                    <span className="job__Skill__Wrapper">
                                        <BusinessCenterIcon className="info__Icon" />
                                        <span>Job Type:&nbsp;<span className="highlight__Job__Info">{currentJob.others[jobKeys.othersFreelancerJobType]}</span></span>
                                    </span>
                                } */}
                {/* {
                                    currentJob.typeof === "Employee" &&
                                    <span className="job__Skill__Wrapper">
                                        <BusinessCenterIcon className="info__Icon" />
                                        <span>Job Type:&nbsp;<span className="highlight__Job__Info">Full time</span></span>
                                    </span>
                                } */}
                <span className="job__Skill__Wrapper">
                  <BsClock className="info__Icon" />
                  <span>
                    Duration:&nbsp;
                    <span className="highlight__Job__Info">
                      {currentJob.time_interval}
                    </span>
                  </span>
                </span>
                {
                  <span className="job__Skill__Wrapper">
                    <BsCashStack className="info__Icon" />
                    <span>
                      Payment:&nbsp;
                      <span className="highlight__Job__Info">
                        {currentJob.payment}
                        {currentJob.paymentInterval
                          ? `/ ${currentJob.paymentInterval}`
                          : ""}
                      </span>
                    </span>
                  </span>
                }
              </div>
              {isLargeScreen && (
                <div className="job__Quick__Apply__Container">
                  {isProductUser ? (
                    <button
                      className="apply__Btn green__Btn"
                      onClick={handleSubmitApplicationBtnClick}
                      disabled={productUserDetails?.jobsAppliedFor?.includes(
                        currentJob._id
                      )}
                    >
                      <span>
                        {productUserDetails?.jobsAppliedFor?.includes(
                          currentJob._id
                        )
                          ? "Applied"
                          : "Apply"}
                      </span>
                      <RiShareBoxFill />
                    </button>
                  ) : (
                    <button
                      className="apply__Btn green__Btn"
                      onClick={handleSubmitApplicationBtnClick}
                      disabled={disableApplyBtn}
                    >
                      <span>Apply</span>
                      <RiShareBoxFill />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="job__About__Info">
              <p className="job__About__Title paragraph__Title__Item">
                Description:{" "}
              </p>
              <span>{currentJob.description}</span>
            </div>

            <div className="job__Skills__Info">
              <p className="paragraph__Title__Item">Skills:</p>
              <span>{currentJob.skills}</span>
            </div>

            <div className="apply_Btn_Container">
              {isProductUser ? (
                <button
                  className="apply__Btn green__Btn"
                  onClick={handleSubmitApplicationBtnClick}
                  disabled={productUserDetails?.jobsAppliedFor?.includes(
                    currentJob._id
                  )}
                >
                  <span>
                    {productUserDetails?.jobsAppliedFor?.includes(
                      currentJob._id
                    )
                      ? "Applied"
                      : "Apply for Job"}
                  </span>
                  <RiShareBoxFill />
                </button>
              ) : (
                <button
                  className="apply__Btn green__Btn"
                  onClick={handleSubmitApplicationBtnClick}
                  disabled={disableApplyBtn}
                >
                  <span>Apply for Job</span>
                  <RiShareBoxFill />
                </button>
              )}
              <button
                className={`save__Btn grey__Btn ${jobSaved ? "active" : ""}`}
                onClick={() => setJobSaved(!jobSaved)}
              >
                <span>{jobSaved ? "Saved" : "Save"}</span>
                <IoBookmarkSharp />
              </button>
            </div>
          </>
        )}
      </div>
      {section !== "form" ? (
        <div className="bottom__About__Dowell__Container">
          <div className="intro__Container">
            <div className="img__Container">
              <img
                src={process.env.PUBLIC_URL + "/logos/logo-1.png"}
                alt="dowell logo"
                loading="lazy"
              />
            </div>
            <div className="info__Container">
              <h2 className="about__Dowell__Title">
                <b>About D'Well Research</b>
              </h2>
              <p className="about__Dowell">{dowellInfo}</p>
            </div>
          </div>

          <div className="social__Icons__Container">
            {React.Children.toArray(
              dowellLinks.map((dowellLink) => {
                return (
                  <a
                    aria-label={dowellLink.title}
                    href={dowellLink.link}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="social__Icon__Item"
                  >
                    {dowellLink.icon}
                  </a>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {
        // newApplicationData.others[mutableNewApplicationStateNames.applicant] && newApplicationData.others[mutableNewApplicationStateNames.applicant] !== "" && <Footer currentCategory={currentJob.typeof} />
      }
      {showPublicSuccessModal && (
        <SuccessPublicSubmissionModal
          title={"Thank you for applying!"}
          body={
            "You can visit our website to learn more about our organization"
          }
          submissionModalIcon={true}
          handleBtnClick={() => {
            setPublicSuccessModalBtnDisabled(true);
            window.location.replace(uxlivingLabURL);
          }}
          btnDisabled={publicSuccessModalBtnDisabled}
        />
      )}
    </>
  );
};

export default JobApplicationScreen;

const CurrentJobNotFound = () => {
  return (
    <div
      className="current_job_not_found_container"
      style={{ position: "absolute", top: "50%", left: "50%" }}
    >
      <img
        className="current_job_not_found_container_image"
        src={userNotFoundImage}
        alt="image"
        style={{ width: 600 }}
      />
      <p className="current_job_not_found_container_paragraph">
        This job listing is no longer available
      </p>
    </div>
  );
};
