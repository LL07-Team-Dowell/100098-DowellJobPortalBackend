import React, { useState } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { addNewJob } from "../../../../services/adminServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";

import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import "./style.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";

const AddJob = ({ subAdminView }) => {
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const { setJobs } = useJobContext();

  const [newJob, setNewJob] = useState({
    job_number: crypto.randomUUID(),
    job_title: "",
    skills: "",
    qualification: "",
    job_category: "",
    type_of_job: "",
    time_interval: "",
    is_active: true,
    payment: "",
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
    created_on: new Date(), 
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [secondOption, setSecondOption] = useState("");
  const [thirdOption, setThirdOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["job_category"] = e.target.value;
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

  const handleChange = (valueEntered, inputName) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleAddTerms = (termsKey) => {
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      const copyOfArray = copyOfPrevValue[termsKey].slice();
      copyOfArray.push("");
      copyOfPrevValue[termsKey] = copyOfArray;
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
      "description",
      "job_category",
      "module",
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

    setIsLoading(true);
    try {
      const response = await addNewJob(newJob);
      console.log(response.data);

      if (response.status === 201) {
        setJobs((prevValue) => [newJob, ...prevValue]);
        toast.success("Job created successfully");
        navigate("/");
      } else {
        toast.info("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      // hideTitleBar={true}
      pageTitle={"Add New Job"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size="1.5rem" />}
      handleNavIcon={() => navigate(-1)}
      subAdminView={subAdminView}
    >
      <div className="job_container">
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
        <div className="job_details_bg">
          <div>
            <h3 className="title">Job Details</h3>
            <div className="job_details">
              <label htmlFor="job_title">Name of Job</label>
              <input
                type={"text"}
                name={"job_title"}
                value={newJob.job_title}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Name of Job"}
                required
              />

              <label htmlFor="skills">Skills</label>
              <input
                type={"text"}
                name={"skills"}
                value={newJob.skills}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Skills"}
                required
              />
              <label htmlFor="qualification">Qualifications</label>
              <input
                type={"text"}
                name={"qualification"}
                value={newJob.qualification}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Qualifications"}
                required
              />
              <h3>Job Category</h3>
              <div className="job_category">
                <label htmlFor="freelancer" className="radio">
                  <input
                    className="radio_input"
                    type={"radio"}
                    id={"freelancer"}
                    name="options"
                    value={"Freelancer"}
                    checked={selectedOption === "Freelancer"}
                    onChange={handleOptionChange}
                  />
                  <div className="radio__radio"></div>
                  <p>Freelancer</p>
                </label>
                <label htmlFor="internship" className="radio">
                  <input
                    className="radio_input"
                    type={"radio"}
                    id={"internship"}
                    name="options"
                    value={"Internship"}
                    checked={selectedOption === "Internship"}
                    onChange={handleOptionChange}
                  />
                  <div className="radio__radio"></div>
                  <p>Internship</p>
                </label>
                <label htmlFor="employee" className="radio">
                  <input
                    className="radio_input"
                    type={"radio"}
                    id={"employee"}
                    name="options"
                    value={"Employee"}
                    checked={selectedOption === "Employee"}
                    onChange={handleOptionChange}
                  />
                  <div className="radio__radio"></div>
                  <p>Employee</p>
                </label>
                <label htmlFor="research_associate" className="radio">
                  <input
                    className="radio_input"
                    type={"radio"}
                    id={"research_associate"}
                    name="options"
                    value={"Research_associate"}
                    checked={selectedOption === "Research_associate"}
                    onChange={handleOptionChange}
                  />
                  <div className="radio__radio"></div>
                  <p>Research Assocaiate</p>
                </label>
              </div>

              {newJob.job_category.length < 1 ? (
                <></>
              ) : newJob.job_category === "Freelancer" ? (
                <>
                  <h3>Type of Job</h3>
                  <div className="type_of_job">
                    <div>
                      <label htmlFor="taskbased" className="radio">
                        <input
                          className="radio_input"
                          type={"radio"}
                          id={"taskbased"}
                          name="options2"
                          value={"Task based"}
                          checked={secondOption === "Task based"}
                          onChange={handleSecondOptionChange}
                        />
                        <div className="radio__radio"></div>
                        <p>Task Based</p>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="timebased" className="radio">
                        <input
                          className="radio_input"
                          type={"radio"}
                          id={"timebased"}
                          name="options2"
                          value={"Time based"}
                          checked={secondOption === "Time based"}
                          onChange={handleSecondOptionChange}
                        />
                        <div className="radio__radio"></div>
                        <p>Time Based</p>
                      </label>
                    </div>
                  </div>
                </>
              ) : newJob.job_category === "Internship" ? (
                <>
                  <h3>Type of Job</h3>
                  <div className="type_of_job">
                    <div>
                      <label htmlFor="fulltime" className="radio">
                        <input
                          className="radio_input"
                          type={"radio"}
                          id={"fulltime"}
                          name="options2"
                          value={"Full time"}
                          checked={secondOption === "Full time"}
                          onChange={handleSecondOptionChange}
                        />
                        <div className="radio__radio"></div>
                        <p>Full Time</p>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="parttime" className="radio">
                        <input
                          className="radio_input"
                          type={"radio"}
                          id={"parttime"}
                          name="options2"
                          value={"Part time"}
                          checked={secondOption === "Part time"}
                          onChange={handleSecondOptionChange}
                        />
                        <div className="radio__radio"></div>
                        <p>Part Time</p>
                      </label>
                    </div>
                  </div>
                </>
              ) : newJob.job_category === "Employee" ? (
                <>
                  <h3>Type of Job</h3>
                  <div className="type_of_job">
                    <div>
                      <label htmlFor="fulltime" className="radio">
                        <input
                          className="radio_input"
                          type={"radio"}
                          id={"fulltime"}
                          name="options2"
                          value={"Full time"}
                          checked={secondOption === "Full time"}
                          onChange={handleSecondOptionChange}
                        />
                        <div className="radio__radio"></div>
                        <p>Full Time</p>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              <label htmlFor="time_interval">Time Period</label>
              <input
                type="text"
                name={"time_interval"}
                value={newJob.time_interval}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Time Period"}
                required
              />

              <div className="state_of_job">
                <label htmlFor="is_active">State of Job</label>
                <div className="is_active">
                  <input
                    className="active_checkbox"
                    type="checkbox"
                    name={"is_active"}
                    checked={newJob.is_active}
                    onChange={(e) =>
                      handleChange(e.target.checked, e.target.name)
                    }
                    required
                  />
                </div>
              </div>

              <label htmlFor="module">Module</label>
              <select
                className="select"
                name={"module"}
                id="module"
                onChange={handleThirdOptionChange}
              >
                <option value="">Select Module</option>
                <option value="Frontend" selected={thirdOption === "Frontend"}>
                  Frontend
                </option>
                <option value="Backend" selected={thirdOption === "Backend"}>
                  Backend
                </option>
                <option value="UI/UX" selected={thirdOption === "UI/UX"}>
                  UI/UX
                </option>
                <option
                  value="Virtual Assistant"
                  selected={thirdOption === "Virtual Assistant"}
                >
                  Virtual Assitant
                </option>
                <option value="Web" selected={thirdOption === "Web"}>
                  Web
                </option>
                <option value="Mobile" selected={thirdOption === "Mobile"}>
                  Mobile
                </option>
              </select>

              <label htmlFor="payment">Payment</label>
              <input
                type="text"
                name={"payment"}
                value={newJob.payment}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter your amount"}
                required
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name={"description"}
                value={newJob.description}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter your answer"}
                required
              />

              <div className="terms">
                <h3>General Terms</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.general_terms.map((term, index) => {
                      return (
                        <div className="add_terms">
                          <input
                            className="terms_input"
                            placeholder="Enter terms"
                            type="text"
                            value={term}
                            onChange={(e) =>
                              handleTermsChange(
                                e.target.value,
                                "general_terms",
                                index
                              )
                            }
                          />
                          <button
                            className="terms_remove"
                            onClick={() => handleRemoveTerms("general_terms")}
                          >
                            <MdCancel size="1.2rem" color="#b8b8b8" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  className="terms_button"
                  onClick={() => handleAddTerms("general_terms")}
                  id="addTermsBtn"
                >
                  <span>
                    <MdOutlineAddCircle size="2.6rem" color="#005734" />
                    <Tooltip
                      anchorId="addTermsBtn"
                      place="top"
                      content="Add General Terms"
                      className="tooltip"
                    />
                  </span>
                  <span className="terms_text">Add General Terms</span>
                </button>

                <h3>Technical Specifications</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.technical_specification.map((term, index) => {
                      return (
                        <div className="add_terms">
                          <input
                            className="terms_input"
                            placeholder="Enter terms"
                            type="text"
                            value={term}
                            onChange={(e) =>
                              handleTermsChange(
                                e.target.value,
                                "technical_specification",
                                index
                              )
                            }
                          />
                          <button
                            className="terms_remove"
                            onClick={() =>
                              handleRemoveTerms("technical_specification")
                            }
                          >
                            <MdCancel size="1rem" color="#b8b8b8" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  className="terms_button"
                  onClick={() => handleAddTerms("technical_specification")}
                  id="addSpecBtn"
                >
                  <span>
                    <MdOutlineAddCircle size="2.6rem" color="#005734" />
                    <Tooltip
                      anchorId="addSpecBtn"
                      place="top"
                      content="Add Specifications"
                      className="tooltip"
                    />
                  </span>
                  <span className="terms_text">Add Specifications</span>
                </button>

                <h3>Payment Terms</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.payment_terms.map((term, index) => {
                      return (
                        <div className="add_terms">
                          <input
                            className="terms_input"
                            placeholder="Enter terms"
                            type="text"
                            value={term}
                            onChange={(e) =>
                              handleTermsChange(
                                e.target.value,
                                "payment_terms",
                                index
                              )
                            }
                          />
                          <button
                            className="terms_remove"
                            onClick={() => handleRemoveTerms("payment_terms")}
                          >
                            <MdCancel size="1rem" color="#b8b8b8" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  className="terms_button"
                  onClick={() => handleAddTerms("payment_terms")}
                  id="addPayBtn"
                >
                  <span>
                    <MdOutlineAddCircle size="2.6rem" color="#005734" />
                    <Tooltip
                      anchorId="addPayBtn"
                      place="top"
                      content="Add Payment Terms"
                      className="tooltip"
                    />
                  </span>
                  <span className="terms_text">Add Payment Terms</span>
                </button>

                <h3>Workflow</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.workflow_terms.map((term, index) => {
                      return (
                        <div className="add_terms">
                          <input
                            className="terms_input"
                            placeholder="Enter terms"
                            type="text"
                            value={term}
                            onChange={(e) =>
                              handleTermsChange(
                                e.target.value,
                                "workflow_terms",
                                index
                              )
                            }
                          />
                          <button
                            className="terms_remove"
                            onClick={() => handleRemoveTerms("workflow_terms")}
                          >
                            <MdCancel size="1rem" color="#b8b8b8" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  className="terms_button"
                  onClick={() => handleAddTerms("workflow_terms")}
                  id="addWorkBtn"
                >
                  <span>
                    <MdOutlineAddCircle size="2.6rem" color="#005734" />
                    <Tooltip
                      anchorId="addWorkBtn"
                      place="top"
                      content="Add Workflow"
                      className="tooltip"
                    />
                  </span>
                  <span className="terms_text">Add Workflow</span>
                </button>

                <h3>Others</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.other_info.map((term, index) => {
                      return (
                        <div className="add_terms">
                          <input
                            className="terms_input"
                            placeholder="Enter terms"
                            type="text"
                            value={term}
                            onChange={(e) =>
                              handleTermsChange(
                                e.target.value,
                                "other_info",
                                index
                              )
                            }
                          />
                          <button
                            className="terms_remove"
                            onClick={() => handleRemoveTerms("other_info")}
                          >
                            <MdCancel size="1rem" color="#b8b8b8" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  className="terms_button"
                  onClick={() => handleAddTerms("other_info")}
                  id="addOthersBtn"
                >
                  <span>
                    <MdOutlineAddCircle size="2.6rem" color="#005734" />
                    <Tooltip
                      anchorId="addOthersBtn"
                      place="top"
                      content="Add Others"
                      className="tooltip"
                    />
                  </span>
                  <span className="terms_text">Add Others</span>
                </button>
              </div>

              <div>
                <button
                  className="submit"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isLoading}
                >
                  <div className="save">
                    {isLoading ? (
                      <LoadingSpinner width={25} height={25} color="#fff" />
                    ) : (
                      <div>
                        Save <BsFillBookmarkFill size="1.2rem" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default AddJob;
