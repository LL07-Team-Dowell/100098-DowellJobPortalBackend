import { useState, Fragment } from "react";
import Terms from "./Terms";
import { CgRadioCheck } from "react-icons/cg";
import { CgRadioChecked } from "react-icons/cg";
import { BsSave2Fill } from "react-icons/bs";
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

const terms = [
  {
    id: 1,
    name: "General Terms",
    add: "Add General Terms",
  },
  {
    id: 2,
    name: "Technical specifications",
    add: "Add Specifications",
  },
  {
    id: 3,
    name: "Payment Terms",
    add: "Add Payment Terms",
  },
  {
    id: 4,
    name: "Workflow",
    add: "Add Workflow",
  },
  {
    id: 5,
    name: "Others",
    add: "Add Others",
  },
];

const AddJob = () => {
  const [formField, setFormField] = useState(defaultFormField);
  const { jobName, skill, duration, payment, jobDescription } = formField;
  const [isActive, setIsActive] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [click, setClick] = useState(false);
  const [des, setDes] = useState([]);

  const toggleOptionButton = () => {
    setClick(!click);
  };

  //add description
  const addDescription = () => {
    if (newDescription) {
      let num = des.length + 1;
      let newTerm = { id: num, title: newDescription, status: false };
      setDes([...des, newTerm]);
      setNewDescription(" ");
    }
  };

  //delete description
  const deleteDescription = (id) => {
    let newDescription = des.filter((item) => item.id !== id);
    setDes(newDescription);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField({ ...formField, [name]: value });
  };

  const handleClick = () => {
    setIsActive(!isActive);
    console.log(isActive, "value");
  };

  return (
    <>
      <div className="addNewJob-container">
        <Link to="/admin" className="nav-link">
          <button>
            <MdArrowBackIos size="1.5em" />
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
                  label="Enter name of job"
                  type="text"
                  required
                  onChange={handleChange}
                  name="jobName"
                  value={jobName}
                />
                <label>Skills</label>
                <input
                  label="Enter skills"
                  type="text"
                  required
                  onChange={handleChange}
                  name="skill"
                  value={skill}
                />
                <div>
                  <label>Type of Job</label>
                  <div className="job-type">
                    <div onClick={toggleOptionButton}>
                      {click ? (
                        <CgRadioChecked color="#1f1f1f" size="1.5em" />
                      ) : (
                        <CgRadioCheck size="1.5em" />
                      )}{" "}
                      <span>Freelancer</span>
                    </div>
                    <div onClick={toggleOptionButton}>
                      {click ? (
                        <CgRadioChecked color="#1f1f1f" size="1.5em" />
                      ) : (
                        <CgRadioCheck size="1.5em" />
                      )}{" "}
                      <span>Employee</span>
                    </div>
                    <div onClick={toggleOptionButton}>
                      {click ? (
                        <CgRadioChecked color="#1f1f1f" size="1.5em" />
                      ) : (
                        <CgRadioCheck size="1.5em" />
                      )}{" "}
                      <span>Internship</span>
                    </div>
                    <div onClick={toggleOptionButton}>
                      {click ? (
                        <CgRadioChecked color="#1f1f1f" size="1.5em" />
                      ) : (
                        <CgRadioCheck size="1.5em" />
                      )}{" "}
                      <span>Reasearch Associate</span>
                    </div>
                  </div>
                </div>
                <label>Time Period</label>
                <input
                  label="Enter time period"
                  type="text"
                  required
                  onChange={handleChange}
                  name="duration"
                  value={duration}
                />
                <div className="job-state">
                  <label>State of Job</label>
                  <div className="state">
                    Active{" "}
                    <div>
                      <span onClick={handleClick} className="toggle">
                        {isActive ? (
                          <span className="toggle-active"></span>
                        ) : (
                          <span className="toggle-inactive"></span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <label>Payment</label>
                <input
                  label="Enter your amount"
                  type="text"
                  required
                  onChange={handleChange}
                  name="payment"
                  value={payment}
                />
                <label>Job Description</label>
                <input
                  label="Enter your answer"
                  type="text"
                  required
                  onChange={handleChange}
                  name="jobDescription"
                  value={jobDescription}
                />
              </form>
              <Terms
                terms={terms}
                des={des}
                addDescription={addDescription}
                deleteDescription={deleteDescription}
                newDescription={newDescription}
                setNewDescription={setNewDescription}
              />
              <div>
                <button className="submit">
                  <div className="save">
                    Save <BsSave2Fill size="0.7em" />
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
