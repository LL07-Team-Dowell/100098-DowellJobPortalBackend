import React, { useState } from "react";
import { IoIosBookmark } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { currentBackendAxiosInstance } from "../../../../services/axios";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import "./style.css";

const AddJob = () => {
  const [newJob, setNewJob] = useState({
    job_number: "crypto.randomUUID()",
    job_title: "",
    skills: "",
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
    company_id: 100098,
    data_type: "testing",
    created_by: "isaac",
    created_on: new Date(),
  });

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setNewJob((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["type_of_job"] = e.target.value;
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
    console.log(newJob);

    const fields = [
      "job_title",
      "skills",
      "type_of_job",
      "time_interval",
      "payment",
      "description",
    ];

    if (newJob.type_of_job === "") {
      toast.error("Please select a type of job");
      return;
    } else if (fields.some((field) => newJob[field] === "")) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await currentBackendAxiosInstance.post(
        "admin_management/create_jobs/",
        newJob
      );
      console.log(response.data);

      if (response.status === 201) {
        toast.success("Job created successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="job_container">
      <Link to="/">
        <button className="nav_button">
          <MdArrowBackIos className="back_icon" />
        </button>
      </Link>
      <div className="add_section">
        <h1>Add New Job</h1>
        <p>
          Project Management - <span>UX Living Lab</span>
        </p>
      </div>
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

            <h3>Type of Job</h3>
            <div className="type_of_job">
              <label htmlFor="freelancer" className="radio">
                <input
                  className="radio_input"
                  type={"radio"}
                  id={"freelancer"}
                  name="options"
                  value={"freelancer"}
                  checked={selectedOption === "freelancer"}
                  onChange={handleOptionChange}
                />
                <div className="radio__radio"></div>
                <p>Freelancer</p>
              </label>
              <label htmlFor="internship" className="radio">
                <input
                  className="radio_input"
                  type={"radio"}
                  id={"intership"}
                  name="options"
                  value={"intership"}
                  checked={selectedOption === "intership"}
                  onChange={handleOptionChange}
                />
                <div className="radio__radio"></div>
                <p>Intership</p>
              </label>
              <label htmlFor="employee" className="radio">
                <input
                  className="radio_input"
                  type={"radio"}
                  id={"employee"}
                  name="options"
                  value={"employee"}
                  checked={selectedOption === "employee"}
                  onChange={handleOptionChange}
                />
                <div className="radio__radio"></div>
                <p>Employee</p>
              </label>
              <label htmlFor="research associate" className="radio">
                <input
                  className="radio_input"
                  type={"radio"}
                  id={"research_associate"}
                  name="options"
                  value={"research_associate"}
                  checked={selectedOption === "research_associate"}
                  onChange={handleOptionChange}
                />
                <div className="radio__radio"></div>
                <p>Research Assocaiate</p>
              </label>
            </div>

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
              <input
                className="active_checkbox"
                type="checkbox"
                name={"is_active"}
                checked={newJob.is_active}
                onChange={(e) => handleChange(e.target.checked, e.target.name)}
                required
              />
            </div>

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
                          <MdCancel size="1rem" color="#b8b8b8" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              <button
                className="terms_button"
                onClick={() => handleAddTerms("general_terms")}
              >
                <span>
                  <MdOutlineAddCircle size="2rem" color="#005734" />
                </span>{" "}
                Add General Terms
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
              >
                <span>
                  <MdOutlineAddCircle size="2rem" color="#005734" />
                </span>{" "}
                Add Specifications
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
              >
                <span>
                  <MdOutlineAddCircle size="2rem" color="#005734" />
                </span>{" "}
                Add Payment Terms
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
              >
                <span>
                  <MdOutlineAddCircle size="2rem" color="#005734" />
                </span>{" "}
                Add Workflow
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
              >
                <span>
                  <MdOutlineAddCircle size="2rem" color="#005734" />
                </span>{" "}
                Add Others
              </button>
            </div>

            <div>
              <button className="submit" onClick={(e) => handleSubmit(e)}>
                <div className="save">
                  Save <IoIosBookmark size="0.9em" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
