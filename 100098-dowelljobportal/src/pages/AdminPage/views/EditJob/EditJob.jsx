import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { IoIosArrowBack } from "react-icons/io";
import "./EditJob.css";
import Loading from '../../../../components/LoadingSpinner/LoadingSpinner';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { useJobContext } from '../../../../contexts/Jobs';
import { getJobs } from '../../../../services/candidateServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import LittleLoading from '../../../CandidatePage/views/ResearchAssociatePage/littleLoading';
import { updateJob } from '../../../../services/adminServices';
import { toast } from 'react-toastify';


function EditJob({subAdminView}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false)
  // console.log(updateLoading)
  const [formData, setFormData] = useState({
    job_title: '',
    skills: '',
    job_category: '',
    type_of_job: '',
    is_active: '',
    payment: '',
    description: '',
    time_interval: '',
    general_terms: [],
    technical_specification: [],
    payment_terms: [],
    workflow_terms: [],
    other_info: [],
    document_id: '',
  });
  // console.log(formData.job_category);
  // console.log(formData);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 10000)
  // }, []);


  const { currentUser } = useCurrentUserContext();
  const { jobs, setJobs } = useJobContext();
  const { id } = useParams();
  // const [newjobs, setNewjobs] = useState([]);
  const singleJob = jobs?.filter(job => job["_id"] === id)[0];
  const { payment_terms, company_id, created_by, created_on, data_type, description, document_id, eventId, general_terms, is_active, job_category, job_number, job_title, other_info, payment, qualification, skills, technical_specification, time_interval, type_of_job, workflow_terms, _id } = singleJob || {};
  const [selectedOption, setSelectedOption] = useState(job_category || "");
  const [active, setActive] = useState(is_active);
  const [typeofOption, setTypeofOption] = useState(type_of_job || "");

  console.log(general_terms);

  useEffect(() => {
    setSelectedOption(job_category);
    setActive(is_active);
    setTypeofOption(type_of_job);
  }, [job_category]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpdateLoading(true);
    // setLoading(false)
    console.log(formData);
    await updateJob(formData)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          navigate(-1);
          toast.success("Job updation successfully");
        }
      })
      .catch(error => console.log(error));

    setUpdateLoading(false);
  }

  useEffect(() => {
    if (jobs.length > 0) return setLoading(false);
    // setLoading(true);
    const datass = currentUser.portfolio_info[0].org_id;
    getJobs(datass).then(res => {
      setJobs(res.data.response.data.filter(job => job.data_type === currentUser?.portfolio_info[0]?.data_type));
      setLoading(false)
    }).catch(err => {
      console.log(err);
      setLoading(false)
    })
  }, [id])


  useEffect(() => {
    const formDataUpdates = {};
    switch (true) {
      case job_title?.length > 0:
        formDataUpdates.job_title = job_title;
        formDataUpdates.description = description;
        formDataUpdates.skills = skills;
        formDataUpdates.job_category = job_category;
        formDataUpdates.time_interval = time_interval;
        formDataUpdates.payment = payment;
        formDataUpdates.type_of_job = typeofOption;
        formDataUpdates.is_active = is_active;
        formDataUpdates.document_id = _id;
        break;
      case general_terms?.length > 0:
        formDataUpdates.general_terms = general_terms;
        break;
      case technical_specification?.length > 0:
        formDataUpdates.technical_specification = technical_specification;
        break;
      case payment_terms?.length > 0:
        formDataUpdates.payment_terms = payment_terms;
        break;
      case workflow_terms?.length > 0:
        formDataUpdates.workflow_terms = workflow_terms;
        break;
      case other_info?.length > 0:
        formDataUpdates.other_info = other_info;
        break;
      default:
        break;
    }

    setFormData(prevState => ({
      ...prevState,
      ...formDataUpdates
    }));

  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setFormData({ ...formData, job_category: selectedOption })
  };

  const handltTypeOfOption = (e) => {
    setTypeofOption(e.target.value);
    setFormData({ ...formData, type_of_job: typeofOption });
    console.log(typeofOption);
  }

  const toggleJobStatus = () => {
    setActive(!active)
    setFormData({
      ...formData,
      is_active: active,
    });
  };


  const handleRemoveGeneralTerms = (index) => {
    const newItems = [...formData.general_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, general_terms: [...filterItems] })
  }

  const handleRemoveSpecificationTerms = (index) => {
    const newItems = [...formData.technical_specification];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, technical_specification: [...filterItems] })
  }

  const handleRemovePaymentTerms = (index) => {
    const newItems = [...formData.payment_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, payment_terms: [...filterItems] })
  }

  const handleRemoveWorkflow = (index) => {
    const newItems = [...formData.workflow_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, workflow_terms: [...filterItems] })
  }

  const handleRemoveOthers = (index) => {
    const newItems = [...formData.other_info];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, other_info: [...filterItems] })
  }

  const handleChangeInTermsArray = (valueEntered, termsKey, indexPassed) => {
    setFormData((prevValue) => {
      const copyOfPrevValueObj = { ...prevValue }
      // take a copy
      const copyOfArray = copyOfPrevValueObj[termsKey].slice()
      // modification made to the copy
      copyOfArray[indexPassed] = valueEntered;

      copyOfPrevValueObj[termsKey] = copyOfArray

      return copyOfPrevValueObj
    })
  }

  const handleAddTerm = (termsKey) => {
    // console.log(termsKey);
    setFormData((prevValue) => {
      const copyOfPrevValueObj = { ...prevValue }

      // take a copy
      const copyOfArray = copyOfPrevValueObj[termsKey]?.slice()

      // making modifications to the copy
      copyOfArray?.push("")

      copyOfPrevValueObj[termsKey] = copyOfArray

      return copyOfPrevValueObj
    })
  }



  if (loading) return <LoadingSpinner />

  return (
    <>
      <StaffJobLandingLayout adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Edit  Job"}
        showAnotherBtn={true}
        btnIcon={<MdArrowBackIos size="1.5rem" />}
        handleNavIcon={() => navigate(-1)}
        subAdminView={subAdminView}
      >
        <Wrapper>
          <div className="container edit__page_Admin__T">
            <div className="job__details">
              <div className="job__detail__title">
                <h3>Job Details</h3>
              </div>

              <form>
                <div className='input__data'>
                  <label htmlFor="job_title">Name of Job</label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    // placeholder='UI Design'
                    defaultValue={job_title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="skills">Skills</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    // placeholder='Figma, XD'
                    defaultValue={skills}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="qualification">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    defaultValue={qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="job_category">Job Category</label>
                  <div className="input__data__row">
                    <div className="data">
                      <input type="radio"
                        id="freelancer"
                        name="options"
                        value="Freelancer"
                        checked={selectedOption === 'Freelancer'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="freelancer">Freelancer</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="employe"
                        name="options"
                        value="Employee"
                        checked={selectedOption == 'Employee'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="employe">Employee</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="internship"
                        name="options"
                        value="Internship"
                        checked={selectedOption === 'Internship'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="internship">Internship</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="research associate"
                        name="options"
                        value="Research Associate"
                        checked={selectedOption === 'Research Associate'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="research associate">Research Associate</label>
                    </div>
                  </div>
                </div>


                {selectedOption?.length < 1 ? (
                  <></>
                ) : selectedOption === "Freelancer" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">

                      <div className="data">
                        <input
                          type="radio"
                          id="time"
                          name="Task based"
                          value="Task based"
                          checked={typeofOption === 'Task based'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Task Based</label>
                      </div>

                      <div className="data">
                        <input
                          type="radio"
                          id="task"
                          name="Time based"
                          value="Time based"
                          checked={typeofOption === 'Time based'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Time Based</label>
                      </div>

                    </div>
                  </>
                ) : selectedOption === "Internship" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Full time"
                          value="Full time"
                          checked={typeofOption === 'Full time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="internship">Full Time</label>
                      </div>
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Part time"
                          value="Part time"
                          checked={typeofOption === 'Part time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Part Time</label>
                      </div>

                    </div>
                  </>
                ) : selectedOption === "Employee" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Full time"
                          value="Full time"
                          checked={typeofOption === 'Full time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Full Time</label>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className='input__data'>
                  <label htmlFor="skills">Time Period</label>
                  <input
                    type="text"
                    id="time_interval"
                    name="time_interval"
                    // placeholder='1 Week'
                    defaultValue={time_interval}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='input__data__row stateofjob'>
                  <label style={{ fontSize: "1rem" }}>State of Job</label>
                  <div className="data">
                    <input
                      className="active_checkbox"
                      type="checkbox"
                      name={"is_active"}
                      checked={active}
                      onChange={toggleJobStatus}
                      required
                    />
                  </div>

                </div>
                <div className='input__data'>
                  <label htmlFor="payment">Payment</label>
                  <input
                    type="text"
                    id="payment"
                    name="payment"
                    // placeholder='30$'
                    defaultValue={payment}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    // placeholder='1. Setting goals and developing plans for business and revenue growth. Researching, planning, and implementing new target market initiatives.'
                    defaultValue={description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="gernaral__term">
                  <label>General Terms</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.general_terms?.map((x, i) => {
                        return <div className="item">
                          <p> <input value={x} placeholder="genaral term" onChange={(e) => handleChangeInTermsArray(e.target.value, "general_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveGeneralTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>

                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("general_terms")} />
                    <label>Add General Terms</label>
                  </div>
                </div>


                <div className="gernaral__term">
                  <label>Technical Specifications</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.technical_specification?.map((x, i) => {
                        return <div className='item'>
                          <p> <input value={x} placeholder="specification term" onChange={(e) => handleChangeInTermsArray(e.target.value, "technical_specification", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveSpecificationTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("technical_specification")} />
                    <label>Add Specifications</label>
                  </div>
                </div>



                <div className="gernaral__term">
                  <label>Payment Term</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.payment_terms?.map((x, i) => {
                        return <div className='item'>
                          <p> <input value={x} placeholder="payment term" onChange={(e) => handleChangeInTermsArray(e.target.value, "payment_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemovePaymentTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("payment_terms")} />
                    <label>Add Payment Terms</label>
                  </div>
                </div>

                <div className="gernaral__term">
                  <label>Workflow</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.workflow_terms?.map((x, i) => {
                        return <div className='item'>
                          <p><input value={x} placeholder="workflow" onChange={(e) => handleChangeInTermsArray(e.target.value, "workflow_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveWorkflow(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("workflow_terms")} />
                    <label>Add Workflow</label>
                  </div>
                </div>

                <div className="gernaral__term">
                  <label>Others</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.other_info?.map((x, i) => {
                        return <div className='item'>
                          <p><input value={x} placeholder="others" onChange={(e) => handleChangeInTermsArray(e.target.value, "other_info", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveOthers(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("other_info")} />
                    <label>Add Others</label>
                  </div>
                </div>
                <button onClick={handleSubmit} className="save__button" disabled={updateLoading}>
                  {updateLoading ? <LittleLoading /> : `Save`}
                </button>
              </form>
            </div>
          </div>
        </Wrapper>
      </StaffJobLandingLayout>

    </>
  )
}

const Wrapper = styled.section`


.lds-ringg div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #f7fffc transparent transparent transparent;
}
  .container{
    width: 1300px;
    margin: auto;
    background: #ffff;
    padding-bottom: 10rem;
    .back__button {
      position: absolute;
      top: 20px;
      left: 50px;
      color:black;
      background-color: #f3f8f5;
      font-size: 20px;
      margin: 1rem 0 0 1rem;
      padding: 0.1rem 0.4rem;
      padding-top: 8px;
      border-radius: 0.5rem;
      border: none;
      box-shadow: inset 0px 1.7px 8px rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
   
    .type_of_job{
      padding: 0;
    }

    .type_of_job label{
      padding: 0 0.4rem;
      font-size: 0.8rem;
      font-weight: 400;
    }

    .main__titles{
        padding-top: 70px;
        padding: 70px 0px 20px 20px;
        h2{
            color: #005734;
            font-weight: 800;
            font-size: 32px;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
        }

        h3{
            font-size: 1rem;
            font-weight: 600;
            color: #7c7c7c;
        }
    }
    
    .job__details{
        background-color: #F3F8F4;
        padding: 40px 35px;
        border-radius: 10px;
        width: 85%;
        margin: auto;
        
        .job__detail__title{
            background-color:#005734;
            color: #fff;
            padding: 1.4rem 0 1.4rem 2.4rem;
            border-radius: 1rem 1rem 0 0;
            margin: 0;

            h3{
              color:#fff;
              margin-bottom: 0;
              font-size: 1.2rem;
              font-weight: 600;
            }
        }

        form{
            padding:10px 40px;
            background-color:#fff;

            .input__data {
                display:flex;
                flex-direction: column;
                padding: 10px 0;

                label{
                    padding-bottom:4px;
                    color: #005734;
                    font-weight: 600;
                    font-size: 1rem;
                    padding: 0.6rem 0;
                }

                input {
                  padding: 1.1rem 1.1rem 1.1rem 2rem;                    border-radius: 10px;
                    border: 1px solid #005734;
                }

                textarea#description {
                    height: 258px;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #005734;
                    font-family: 'poppins';
                }
            }

            .input__data__row{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                label{
                    color: #005734;
                    font-weight: 600;
                    padding: 8px 0;
                    font-size: 0.8rem;
                }

                .data{    
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    input[type="radio"] {
                        color: #005734;
                        cursor: pointer;
                    }
                      
                }

                .data label{
                    font-weight:400;
                    margin-left:10px;
                    font-size: 0.8rem;
                    color: #000;
                }
            }

            .item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:10px 0;
                position: relative;
                
                p{
                    font-weight: 300;
                    color: #7E7E7E;
                    font-size: 14px;
                    display: flex;
                    width: 90%;

                    input{
                      width: 750px;
                      border: none;
                      color: #7E7E7E;
                      font-size: 14px;
                    }
                }
                svg {
                    color: #B8B8B8;
                    position: absolute;
                    right: 0;
                }                

            }

            .gernaral__term{
                padding-bottom:4px;
                color: #005734;
                font-weight: 600;
            }


            .add__item {
                text-align: right;
                padding: 10px 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                cursor: pointer;

                label{
                    color: #000;
                }

                svg {
                    font-size: 40px;
                    margin-right:10px;
                }
            }

           .save__button{
                display: flex;
                align-items: center;
                background-color: #005734;
                border: none;
                padding: 10px 50px;
                color: #fff;
                font-size: 20px;
                border-radius: 10px;
                cursor: pointer;
                svg{
                    color: #fff;
                    margin-left: 10px;
                }
           }

           button.save__button:hover {
            box-shadow: 0 0px 26px 5px #005734;
            transition: 0.3s ease-in-out;
        }

        }
    }     
    }

    @media only screen and (max-width: 1300px){
        .container{
           width: 95%; 
        }
    }

    @media only screen and (max-width: 900px){
      main {
        padding: 0 40px;
      }
      .container{
        .job__details{
          padding: 0px 0px;
          border-radius: 10px;
          margin: auto;
          width: 95%;
        }

        .job__details form .gernaral__term {
          padding-bottom: 4px;
          color: #005734;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .add__item svg{
            width: 100%;
          }

          .add__item label{
            display: none;
          }

          .gernaral__term {
            display: flex;
          }

          .item p{
            width: 200px;
          }
      }

      }

      .staff__Jobs__Layout__Navigation__Container.admin .admin__View__Title__Container {
        justify-content: space-between;
        width: auto !important;
       }
      .item{
        p{
          input{
          }
        }
      }
    }

    @media only screen and (max-width: 510px){
        
    }

    
  `

export default EditJob;



