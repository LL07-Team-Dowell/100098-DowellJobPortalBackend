import React from "react";
import { Tooltip } from "react-tooltip";
import { BsFillBookmarkFill } from "react-icons/bs";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import DropdownButton from "../../../TeamleadPage/components/DropdownButton/Dropdown";

const AddJobDescription = ({
  newJob,
  handleChange,
  jobTitleRef,
  skillsRef,
  qualificationRef,
  selectedOption,
  handleOptionChange,
  secondOption,
  handleSecondOptionChange,
  thirdOption,
  handleThirdOptionChange,
  fifthOption,
  handleFifthOptionChange,
  timeIntervalRef,
  currency,
  handleCurrencyChange,
  currencyList,
  handlePaymentChange,
  paymentRef,
  fourthOption,
  handleFourthOptionChange,
  descriptionRef,
  handleTermsChange,
  handleRemoveTerms,
  handleAddTerms,
  isLoading,
  handleSubmit,
  activeLinkTab,
}) => {
  return (
    <>
      {!activeLinkTab && (
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
                ref={jobTitleRef}
              />

              <label htmlFor="skills">Skills</label>
              <input
                type={"text"}
                name={"skills"}
                value={newJob.skills}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Skills"}
                required
                ref={skillsRef}
              />
              <label htmlFor="qualification">Qualifications</label>
              <input
                type={"text"}
                name={"qualification"}
                value={newJob.qualification}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Qualifications"}
                required
                ref={qualificationRef}
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
                  {/*<div className="radio__radio"></div>
                    <p>Research Assocaiate</p>*/}
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
                ref={timeIntervalRef}
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
                className="module"
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
                  Virtual Assistant
                </option>
                <option value="Web" selected={thirdOption === "Web"}>
                  Web
                </option>
                <option value="Mobile" selected={thirdOption === "Mobile"}>
                  Mobile
                </option>
              </select>

              <div>
                <label htmlFor="payment">Payment</label>
                <div className="payment_section">
                  <DropdownButton
                    className="currency"
                    currentSelection={currency}
                    handleSelectionClick={(value) => {
                      handleCurrencyChange(value);
                    }}
                    selections={currencyList}
                    removeDropDownIcon={false}
                  />
                  <input
                    type="text"
                    className="payment_input"
                    name={"payment"}
                    value={newJob.payment}
                    onChange={(e) =>
                      handlePaymentChange(e.target.value, e.target.name)
                    }
                    placeholder={"Enter your amount"}
                    required
                    ref={paymentRef}
                  />
                </div>
              </div>

              <label htmlFor="paymentInterval">Payment Interval</label>
              <select
                className="module"
                name={"paymentInterval"}
                id="paymentInterval"
                onChange={handleFourthOptionChange}
              >
                <option value="">Select payment interval</option>
                <option value="hour" selected={fourthOption === "hour"}>
                  Per hour
                </option>
                <option value="week" selected={fourthOption === "week"}>
                  Per week
                </option>
                <option value="day" selected={fourthOption === "day"}>
                  Per day
                </option>
                <option value="month" selected={fourthOption === "month"}>
                  Per month
                </option>
                <option value="year" selected={fourthOption === "year"}>
                  Per year
                </option>
              </select>

              <label htmlFor="description">Description</label>
              <textarea
                name={"description"}
                value={newJob.description}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter your answer"}
                required
                ref={descriptionRef}
                rows={5}
              />

              <div className="terms">
                <h3>General Terms</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.general_terms.map((term, index) => {
                      return (
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("general_terms", index)
                            }
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
                        <div className="add_terms" key={index}>
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
                              handleRemoveTerms(
                                "technical_specification",
                                index
                              )
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("payment_terms", index)
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("workflow_terms", index)
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("other_info", index)
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
      )}
      {activeLinkTab === "Internal" && (
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
                ref={jobTitleRef}
              />
              <label htmlFor="skills">Skills</label>
              <input
                type={"text"}
                name={"skills"}
                value={newJob.skills}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Skills"}
                required
                ref={skillsRef}
              />
              <label htmlFor="qualification">Qualifications</label>
              <input
                type={"text"}
                name={"qualification"}
                value={newJob.qualification}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Qualifications"}
                required
                ref={qualificationRef}
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
                  {/*<div className="radio__radio"></div>
                    <p>Research Assocaiate</p>*/}
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

              <h3>Type of Opening</h3>
              <div className="job_category">
                <div style={{ display: "flex", gap: "2rem" }}>
                  <label htmlFor="Group_Lead" className="radio">
                    <input
                      className="radio_input"
                      type={"radio"}
                      id={"Group_Lead"}
                      name="options3"
                      value={"Group_Lead"}
                      checked={fifthOption === "Group_Lead"}
                      onChange={handleFifthOptionChange}
                    />
                    <div className="radio__radio"></div>
                    <p>Group Lead</p>
                  </label>
                  <label htmlFor="Team_Lead" className="radio">
                    <input
                      className="radio_input"
                      type={"radio"}
                      id={"Team_Lead"}
                      name="options3"
                      value={"Team_Lead"}
                      checked={fifthOption === "Team_Lead"}
                      onChange={handleFifthOptionChange}
                    />
                    <div className="radio__radio"></div>
                    <p>Team Lead</p>
                  </label>
                </div>
              </div>

              <label htmlFor="time_interval">Time Period</label>
              <input
                type="text"
                name={"time_interval"}
                value={newJob.time_interval}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Time Period"}
                required
                ref={timeIntervalRef}
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
                className="module"
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
                  Virtual Assistant
                </option>
                <option value="Web" selected={thirdOption === "Web"}>
                  Web
                </option>
                <option value="Mobile" selected={thirdOption === "Mobile"}>
                  Mobile
                </option>
              </select>

              <div>
                <label htmlFor="payment">Payment</label>
                <div className="payment_section">
                  <DropdownButton
                    className="currency"
                    currentSelection={currency}
                    handleSelectionClick={(value) => {
                      handleCurrencyChange(value);
                    }}
                    selections={currencyList}
                    removeDropDownIcon={false}
                  />
                  <input
                    type="text"
                    className="payment_input"
                    name={"payment"}
                    value={newJob.payment}
                    onChange={(e) =>
                      handlePaymentChange(e.target.value, e.target.name)
                    }
                    placeholder={"Enter your amount"}
                    required
                    ref={paymentRef}
                  />
                </div>
              </div>

              <label htmlFor="paymentInterval">Payment Interval</label>
              <select
                className="module"
                name={"paymentInterval"}
                id="paymentInterval"
                onChange={handleFourthOptionChange}
              >
                <option value="">Select payment interval</option>
                <option value="hour" selected={fourthOption === "hour"}>
                  Per hour
                </option>
                <option value="week" selected={fourthOption === "week"}>
                  Per week
                </option>
                <option value="day" selected={fourthOption === "day"}>
                  Per day
                </option>
                <option value="month" selected={fourthOption === "month"}>
                  Per month
                </option>
                <option value="year" selected={fourthOption === "year"}>
                  Per year
                </option>
              </select>

              <label htmlFor="description">Description</label>
              <textarea
                name={"description"}
                value={newJob.description}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter your answer"}
                required
                ref={descriptionRef}
                rows={5}
              />

              <div className="terms">
                <h3>General Terms</h3>
                <div className="terms_head">
                  {React.Children.toArray(
                    newJob.general_terms.map((term, index) => {
                      return (
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("general_terms", index)
                            }
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
                        <div className="add_terms" key={index}>
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
                              handleRemoveTerms(
                                "technical_specification",
                                index
                              )
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("payment_terms", index)
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("workflow_terms", index)
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
                        <div className="add_terms" key={index}>
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
                            onClick={() =>
                              handleRemoveTerms("other_info", index)
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
      )}
      {activeLinkTab === "Regional Associate" && (
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
                ref={jobTitleRef}
              />

              <label htmlFor="skills">Skills</label>
              <input
                type={"text"}
                name={"skills"}
                value={newJob.skills}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Skills"}
                required
                ref={skillsRef}
              />
              <label htmlFor="qualification">Qualifications</label>
              <input
                type={"text"}
                name={"qualification"}
                value={newJob.qualification}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter Qualifications"}
                required
                ref={qualificationRef}
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

              <div>
                <label htmlFor="payment">Payment</label>
                <div className="payment_section">
                  <DropdownButton
                    className="currency"
                    currentSelection={currency}
                    handleSelectionClick={(value) => {
                      handleCurrencyChange(value);
                    }}
                    selections={currencyList}
                    removeDropDownIcon={false}
                  />
                  <input
                    type="text"
                    className="payment_input"
                    name={"payment"}
                    value={newJob.payment}
                    onChange={(e) =>
                      handlePaymentChange(e.target.value, e.target.name)
                    }
                    placeholder={"Enter your amount"}
                    required
                    ref={paymentRef}
                  />
                </div>
              </div>

              <label htmlFor="paymentInterval">Payment Interval</label>
              <select
                className="module"
                name={"paymentInterval"}
                id="paymentInterval"
                onChange={handleFourthOptionChange}
              >
                <option value="">Select payment interval</option>
                <option value="hour" selected={fourthOption === "hour"}>
                  Per hour
                </option>
                <option value="week" selected={fourthOption === "week"}>
                  Per week
                </option>
                <option value="day" selected={fourthOption === "day"}>
                  Per day
                </option>
                <option value="month" selected={fourthOption === "month"}>
                  Per month
                </option>
                <option value="year" selected={fourthOption === "year"}>
                  Per year
                </option>
              </select>

              <label htmlFor="description">Description</label>
              <textarea
                name={"description"}
                value={newJob.description}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                placeholder={"Enter your answer"}
                required
                ref={descriptionRef}
                rows={5}
              />
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
      )}
    </>
  );
};

export default AddJobDescription;
