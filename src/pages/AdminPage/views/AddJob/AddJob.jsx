import React, { useRef, useState } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { addInternalJob, addNewJob } from "../../../../services/adminServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import "./style.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import DropdownButton from "../../../TeamleadPage/components/DropdownButton/Dropdown";
import { useEffect } from "react";
import AddJobDescription from "./AddDescription";

const AddJob = ({ subAdminView }) => {
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const { setJobs } = useJobContext();
  const [params, setParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    setCurrentTab(params.get("tab"));
  }, [params]);

  const [newJob, setNewJob] = useState({
    job_number: crypto.randomUUID(),
    job_title: "",
    skills: "",
    qualification: "",
    job_category: "",
    type_of_job: "",
    type_of_opening: "",
    time_interval: "",
    is_active: true,
    payment: "",
    paymentInterval: "",
    description: "",
    general_terms: [],
    technical_specification: [],
    payment_terms: [],
    workflow_terms: [],
    other_info: [],
    company_id: currentUser.portfolio_info[0].org_id,
    module: "",
    data_type: currentUser.portfolio_info[0].data_type,
    created_by: currentUser.userinfo.username,
    // applicant: currentUser.userinfo.username,
    // user_type: currentUser.userinfo.User_type,
    // company_name: currentUser.portfolio_info[0].org_name,
    created_on: new Date(),
    rejected_on: new Date(),
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [secondOption, setSecondOption] = useState("");
  const [thirdOption, setThirdOption] = useState("");
  const [fourthOption, setFourthOption] = useState("");
  const [fifthOption, setFifthOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState("Select Currency");
  const [isValidCurrency, setIsValidCurrency] = useState(false);
  const currencyList = ["USD", "NGN", "GBP", "INR"];
  const [activeLinkTab, setActiveLinkTab] = useState("Public");

  const jobTitleRef = useRef(null);
  const skillsRef = useRef(null);
  const qualificationRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const paymentRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setIsValidCurrency(value !== "Select Currency");
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["job_category"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleFifthOptionChange = (e) => {
    setFifthOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["type_of_opening"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleSecondOptionChange = (e) => {
    setSecondOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["type_of_job"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleThirdOptionChange = (e) => {
    setThirdOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["module"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleFourthOptionChange = (e) => {
    setFourthOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["paymentInterval"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleChange = (valueEntered, inputName) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handlePaymentChange = (valueEntered, inputName) => {
    const filteredValue = valueEntered.replace(/\D/g, "");
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = filteredValue;
      return copyOfPrevValue;
    });
  };

  const handleAddTerms = (termsKey) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[termsKey].push("");
      return copyOfPrevValue;
    });
  };

  const handleRemoveTerms = (termsKey, index) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      const copyOfArray = copyOfPrevValue[termsKey].slice();
      copyOfArray.splice(index, 1);
      copyOfPrevValue[termsKey] = copyOfArray;
      return copyOfPrevValue;
    });
  };

  const handleTermsChange = (valueEntered, termsKey, index) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      const copyOfArray = copyOfPrevValue[termsKey].slice();
      copyOfArray[index] = valueEntered;
      copyOfPrevValue[termsKey] = copyOfArray;
      return copyOfPrevValue;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(newJob);

    const fields = [
      "job_title",
      "skills",
      "type_of_job",
      "time_interval",
      "payment",
      "paymentInterval",
      "description",
      "job_category",
      "type_of_opening",
      "module",
      "qualification",
      "general_terms",
      "technical_specification",
      "payment_terms",
      "workflow_terms",
      "other_info",
    ];

    if (newJob.job_category === "research_associate") {
      return toast.info("Still under development");
    }
    if (newJob.job_category === "") {
      toast.info("Please select a category type");
      return;
    } else if (fields.find((field) => newJob[field] === "")) {
      toast.info(
        `Please select ${fields.find((field) => newJob[field] === "")} field`
      );
      return;
    }
    if (newJob.type_of_opening === "") {
      toast.info("Please select type of opening");
      return;
    } else if (fields.find((field) => newJob[field] === "")) {
      toast.info(
        `Please select ${fields.find((field) => newJob[field] === "")} field`
      );
      return;
    }
    if (newJob.type_of_job === "") {
      toast.info("Please select type of job");
      return;
    } else if (fields.find((field) => newJob[field] === "")) {
      toast.info(
        `Please select ${fields.find((field) => newJob[field] === "")} field`
      );
      return;
    }
    if (newJob.module === "") {
      toast.info("Please select Module");
      return;
    } else if (fields.find((field) => newJob[field] === "")) {
      toast.info(
        `Please select ${fields.find((field) => newJob[field] === "")} field`
      );
      return;
    }

    if (newJob.paymentInterval === "") {
      toast.info("Please select payment interval");
      return;
    } else if (fields.find((field) => newJob[field] === "")) {
      toast.info(
        `Please select ${fields.find((field) => newJob[field] === "")} field`
      );
      return;
    }

    if (newJob.job_title === "") {
      toast.info("Please input job title");
      jobTitleRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (newJob.skills === "") {
      toast.info("Please input skills");
      skillsRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (newJob.time_interval === "") {
      toast.info("Please input time interval");
      timeIntervalRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (newJob.payment === "") {
      toast.info("Please input payment");
      paymentRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!isValidCurrency) {
      toast.info("Please select a currency");
      return;
    }

    if (newJob.description === "") {
      toast.info("Please input description");
      descriptionRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (newJob.qualification === "") {
      toast.info("Please input qualification");
      qualificationRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const isEveryGeneralTermFilled = newJob.general_terms.every(
      (term) => term.length > 0
    );
    if (!isEveryGeneralTermFilled)
      return toast.info("No general term can be left empty");

    const isEveryTechnicalTermFilled = newJob.technical_specification.every(
      (term) => term.length > 0
    );
    if (!isEveryTechnicalTermFilled)
      return toast.info("No technical term can be left empty");

    const isEveryPaymentTermFilled = newJob.payment_terms.every(
      (term) => term.length > 0
    );
    if (!isEveryPaymentTermFilled)
      return toast.info("No payment term can be left empty");

    const isEveryWorkflowTermFilled = newJob.workflow_terms.every(
      (term) => term.length > 0
    );
    if (!isEveryWorkflowTermFilled)
      return toast.info("No workflow term can be left empty");

    const isEveryOtherInfoTermFilled = newJob.other_info.every(
      (term) => term.length > 0
    );
    if (!isEveryOtherInfoTermFilled)
      return toast.info("No other info term can be left empty");

    setIsLoading(true);
    if (!currentTab) {
      try {
        const response = await addNewJob({
          ...newJob,
          payment: `${newJob.payment} ${currency}`,
        });
        console.log(response.data);

        if (response.status === 201) {
          setJobs((prevValue) => [
            { ...newJob, newly_created: true },
            ...prevValue,
          ]);
          toast.success("Job created successfully");
          navigate("/");
        } else {
          toast.info("Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
      return;
    }

    if (currentTab === "Internal") {
      try {
        const response = await addInternalJob({
          ...newJob,
          payment: `${newJob.payment} ${currency}`,
        });
        console.log(response.data);

        if (response.status === 201) {
          setJobs((prevValue) => [
            { ...newJob, newly_created: true, is_internal: true },
            ...prevValue,
          ]);
          toast.success("Job created successfully");
          navigate("/");
        } else {
          toast.info("Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
      return;
    }

    setIsLoading(false);
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Add New Job"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size="1.5rem" />}
      handleNavIcon={() => navigate(-1)}
      subAdminView={subAdminView}
    >
      <div className="job_container">
        {/* <h1>{currentTab}</h1> */}
        {/*<Link to="/" className="navLink">
          <button className="nav_button">
            <MdArrowBackIos size="1.5rem" className="back_icon" />
        </button>
        </Link>
        <div className="add_section">
          <h1>Add New Job</h1>
          <p>
            Project Management - <span>UX Living Lab</span>
          </p>
        </div>*/}
        <div className="landing-page">
          <div className="landing_Nav_Wrapper">
            <div className={`landing_Nav_Item ${!currentTab ? "active" : ""}`}>
              <Link to={"/add-job"}>Public</Link>
              <span></span>
            </div>
            <div
              className={`landing_Nav_Item ${
                currentTab === "Internal" ? "active" : ""
              }`}
            >
              <Link to={"/add-job?tab=Internal"}>Internal</Link>
              <span></span>
            </div>
            <div
              className={`landing_Nav_Item ${
                currentTab === "Regional Associate" ? "active" : ""
              }`}
            >
              <Link to={"/add-job?tab=Regional Associate"}>
                Regional Associate
              </Link>
              <span></span>
            </div>
          </div>
        </div>
        <AddJobDescription
          activeLinkTab={currentTab}
          newJob={newJob}
          jobTitleRef={jobTitleRef}
          skillsRef={skillsRef}
          qualificationRef={qualificationRef}
          selectedOption={selectedOption}
          handleChange={handleChange}
          handleOptionChange={handleOptionChange}
          secondOption={secondOption}
          handleSecondOptionChange={handleSecondOptionChange}
          thirdOption={thirdOption}
          handleThirdOptionChange={handleThirdOptionChange}
          fifthOption={fifthOption}
          handleFifthOptionChange={handleFifthOptionChange}
          timeIntervalRef={timeIntervalRef}
          currency={currency}
          handleCurrencyChange={handleCurrencyChange}
          currencyList={currencyList}
          handlePaymentChange={handlePaymentChange}
          paymentRef={paymentRef}
          fourthOption={fourthOption}
          handleFourthOptionChange={handleFourthOptionChange}
          descriptionRef={descriptionRef}
          handleTermsChange={handleTermsChange}
          handleRemoveTerms={handleRemoveTerms}
          handleAddTerms={handleAddTerms}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </StaffJobLandingLayout>
  );
};

export default AddJob;
