import { useState, Fragment } from "react";
import Terms from "./Terms";
import { IoIosBookmark } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";

import { Link } from "react-router-dom";

import "./style.css";

const defaultFormField = {
  jobName: "",
  skill: "",
  duration: "",
  payment: "",
  jobDescription: "",
};

const AddJob = () => {
  const [formField, setFormField] = useState(defaultFormField);
  const { jobName, skill, duration, payment, jobDescription } = formField;
  const [isActive, setIsActive] = useState(true);
  const [change, setChange] = useState(" ");

  const toggleOptionButton = (e) => {
    setChange(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField({ ...formField, [name]: value });
  };

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div className="addNewJob-container">
        <Link to="/admin">
          <button className="nav-link">
            <MdArrowBackIos size="2.2em" color="#a3a1a1" />
          </button>
        </Link>
        <h1 className="add-new-job">Add New Job</h1>
        <span className="project-management">
          Project Management - <span>UX Living Lab</span>
        </span>
        <div className="job-details-bg">
          <div className="job-info">
            <div className="job-details">
              <h2>Job Details</h2>
            </div>
            <div className="form-details">
              <form>
                <label>Name of Job</label>
                <input
                  className="form-input"
                  placeholder="Enter name of job"
                  type="text"
                  required
                  onChange={handleChange}
                  name="jobName"
                  value={jobName}
                />
                <label>Skills</label>
                <input
                  className="form-input"
                  placeholder="Enter skills"
                  type="text"
                  required
                  onChange={handleChange}
                  name="skill"
                  value={skill}
                />
                <div>
                  <label>Type of Job</label>
                  <div className="job-type">
                    <label htmlFor="freelancer" className="radio">
                      <input
                        className="radio-input"
                        type="radio"
                        id="freelancer"
                        name="job-type"
                        value="freelancer"
                        checked={change === "freelancer"}
                        onChange={toggleOptionButton}
                      />
                      <div className="radio-radio"></div>
                      Freelancer
                    </label>
                    <label htmlFor="employee" className="employee">
                      <input
                        className="radio-input"
                        type="radio"
                        id="employee"
                        name="job-type"
                        value="employee"
                        checked={change === "employee"}
                        onChange={toggleOptionButton}
                      />
                      <div className="radio-radio"></div>
                      Employee
                    </label>
                    <label htmlFor="internship" className="internship">
                      <input
                        className="radio-input"
                        type="radio"
                        id="internship"
                        name="job-type"
                        value="internship"
                        checked={change === "internship"}
                        onChange={toggleOptionButton}
                      />
                      <div className="radio-radio"></div>
                      Intership
                    </label>
                    <label
                      htmlFor="research associate"
                      className="research-associate"
                    >
                      <input
                        className="radio-input"
                        type="radio"
                        id="research associate"
                        name="job-type"
                        value="research associate"
                        checked={change === "research associate"}
                        onChange={toggleOptionButton}
                      />
                      <div className="radio-radio"></div>
                      Research Associate
                    </label>
                  </div>
                </div>
                <label>Time Period</label>
                <input
                  className="form-input"
                  placeholder="Enter time period"
                  type="text"
                  required
                  onChange={handleChange}
                  name="duration"
                  value={duration}
                />
                <div className="job-state">
                  <label>State of Job</label>
                  <div className="state">
                    {isActive ? <span>Inactive</span> : <span>Active</span>}
                    <span onClick={handleClick} className="toggle">
                      {isActive ? (
                        <span className="toggle-active"></span>
                      ) : (
                        <span className="toggle-inactive"></span>
                      )}
                    </span>
                  </div>
                </div>
                <label>Payment</label>
                <input
                  className="form-input"
                  placeholder="Enter your amount"
                  type="text"
                  required
                  onChange={handleChange}
                  name="payment"
                  value={payment}
                />
                <label>Job Description</label>
                <input
                  className="form-input"
                  placeholder="Enter your answer"
                  type="text"
                  required
                  onChange={handleChange}
                  name="jobDescription"
                  value={jobDescription}
                />
              </form>
              <Terms />
              <div>
                <button className="submit">
                  <div className="save">
                    Save <IoIosBookmark size="0.9em" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJob;
