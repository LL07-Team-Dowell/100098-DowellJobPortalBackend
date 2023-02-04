import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai'; 
import { AiFillPlusCircle } from 'react-icons/ai'; 
import { BsFillBookmarkFill } from 'react-icons/bs'; 
import "./style.css"


function EditJob() {
  const [formData, setFormData] = useState({
    jobName: '',
    skills: '',
    jobType: 'freelancer',
    jobStatus: 'Inactive',
    payment: '',
    jobDescription: '',
    timeperiod:''
  });

  const [selectedOption, setSelectedOption] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const toggleJobStatus = () => {
    setFormData({
      ...formData,
      jobStatus: formData.jobStatus === 'Active' ? 'Inactive' : 'Active',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <Wrapper>
        <div className="container">
        <div className="main__titles">
         <h2>Edit Job</h2>
         <h3>Project Management <span style={{"fontWeight":"400"}}>- UX Living Lab</span> </h3>
        </div>


     <div className="job__details">
        <div className="job__detail__title">
            <h3>Job Details</h3>
        </div>

      <form onSubmit={handleSubmit}>
        <div className='input__data'>
          <label htmlFor="jobName">Name of Job</label>
          <input
            type="text"
            id="jobName"
            name="jobName"
            placeholder='UI Design'
            value={formData.jobName}
            onChange={handleInputChange}
          />
        </div>
        <div className='input__data'>
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            placeholder='Figma, XD'
            value={formData.skills}
            onChange={handleInputChange}
          />
        </div>
        <div className='input__data'>


          {/* 
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleInputChange}
          >
            <option value="freelancer">Freelancer</option>
            <option value="employe">Employe</option>
            <option value="internship">Internship</option>
            <option value="research associate">Research Associate</option>
          </select> */}


    <label htmlFor="jobType">Type of Job</label>

<div className="input__data__row">
<div className="data">
        <input type="radio"
            id="freelancer"
            name="options"
            value="freelancer"
            checked={selectedOption === 'freelancer'}
            onChange={handleOptionChange}
            />
        <label htmlFor="freelancer">Freelancer</label>
      </div>
      
      <div className="data">
        <input
            type="radio"
            id="employe"
            name="options"
            value="employe"
            checked={selectedOption === 'employe'}
            onChange={handleOptionChange}
        />
        <label htmlFor="employe">Employe</label>
      </div>

       <div className="data">
            <input
                    type="radio"
                    id="internship"
                    name="options"
                    value="internship"
                    checked={selectedOption === 'internship'}
                    onChange={handleOptionChange}
                />
                <label htmlFor="internship">Internship</label>
       </div>

       <div className="data">
        <input
                type="radio"
                id="research associate"
                name="options"
                value="research associate"
                checked={selectedOption === 'research associate'}
                onChange={handleOptionChange}
            />
            <label htmlFor="research associate">Research Associate</label>
       </div>  
     </div>
         

    </div>
        <div className='input__data'>
          <label htmlFor="skills">Time Period</label>
          <input
            type="text"
            id="timeperiod"
            name="timeperiod"
            placeholder='1 Week'
            value={formData.timeperiod}
            onChange={handleInputChange}
          />
        </div>
        <div className='input__data__row'>
          <label>Status of Job</label>
          <div className="data">
          <label htmlFor="jobStatus">{formData.jobStatus}</label>
          {/* <button type="button" onClick={toggleJobStatus}>
            Toggle
          </button> */}

        <input type="checkbox" id="check1" className="toggle" onClick={toggleJobStatus}/>
        <label htmlFor="check1"></label>

          </div>
         
        </div>
        <div className='input__data'>
          <label htmlFor="payment">Payment</label>
          <input
            type="text"
            id="payment"
            name="payment"
            placeholder='30$'
            value={formData.payment}
            onChange={handleInputChange}
          />
        </div>
        <div className='input__data'>
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            placeholder='1. Setting goals and developing plans for business and revenue growth. Researching, planning, and implementing new target market initiatives.'
            value={formData.jobDescription}
            onChange={handleInputChange}
          />
        </div>

        <div className="gernaral__term">
            <label>General Terms</label>
            <div className="general__items">
                <div className="item">
                    <p>1. You should have google account. We will invite you to our google drive then you have to work as a team.</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>2. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>3. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
            </div>
            <div className="add__item">
                <AiFillPlusCircle/>
                <label>Add General Terms</label>
            </div>
        </div>


        <div className="gernaral__term">
            <label>Payment Terms</label>
            <div className="general__items">
                <div className="item">
                    <p>1. You should have google account. We will invite you to our google drive then you have to work as a team.</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>2. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>3. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
            </div>
            <div className="add__item">
                <AiFillPlusCircle/>
                <label>Add Payement Terms</label>
            </div>
        </div>

        <div className="gernaral__term">
            <label>Workflow</label>
            <div className="general__items">
                <div className="item">
                    <p>1. You should have google account. We will invite you to our google drive then you have to work as a team.</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>2. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
                <div className="item">
                    <p>3. You should have google account. We will invite you to our google drive then you have to work as a team .</p>
                    <AiFillCloseCircle/>
                </div>
            </div>
            <div className="add__item">
                <AiFillPlusCircle/>
                <label>Add Workflow</label>
            </div>
        </div>

        <div className="gernaral__term">
            <label>Others</label>
            <div className="general__items">
                <div className="item">
                    <p>1. Your Discord ID</p>
                    <AiFillCloseCircle/>
                </div>
            </div>
            <div className="add__item">
                <AiFillPlusCircle/>
                <label>Add Others</label>
            </div>
        </div>

        <button type="submit" className='save__button'>Save <BsFillBookmarkFill/></button>
      </form>
      </div>
      </div>
    </Wrapper>
  );
  }

  const Wrapper = styled.section`
.container{
    width: 1300px;
    margin: auto;
    background: #ffff;

    .main__titles{
        padding-top: 70px;
        padding: 70px 0px 20px 20px;
        h2{
            color: #005734;
            font-weight: 600;
            font-size: 20px;
        }

        h3{
            font-size: 10px;
            font-weight: 600;
        }
    }
    
    .job__details{
        background-color: #F3F8F4;
        padding: 20px 15px;

        .job__detail__title{
            color:#fff;
            padding:10px 20px;
            background-color:#005734;
            border-radius: 10px 10px 0px 0px;
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
                }

                input {
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #005734
                    ;
                }

                textarea#jobDescription {
                    height: 258px;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #005734
                }
            }

            .input__data__row{
                display: flex;
                justify-content: space-between;

                label{
                    color: #005734;
                    font-weight: 600;
                    padding: 8px 0;
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
                    margin-left:20px;
                    font-size: 13px;
                    color: #000;
                }
            }

            .item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:10px 0;
                p{
                    font-weight: 300;
                    color: #7E7E7E;
                    font-size: 14px;
                }
                svg {
                    color: #B8B8B8;
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
                padding: 15px 50px;
                color: #fff;
                font-size: 20px;
                border-radius: 10px;
                cursor: pointer;
                svg{
                    color: #fff;
                    margin-left: 10px;
                }
           }

        }
    }     
    }

    @media only screen and (max-width: 1300px){
        .container{
           width: 95%; 
        }
    }
  `

  export default EditJob;



