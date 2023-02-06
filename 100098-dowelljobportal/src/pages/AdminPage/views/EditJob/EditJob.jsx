import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai'; 
import { AiFillPlusCircle } from 'react-icons/ai'; 
import { BsFillBookmarkFill } from 'react-icons/bs'; 
import {IoIosArrowBack} from "react-icons/io";

import "./style.css";


function EditJob() {
  const [formData, setFormData] = useState({
    job_title: 'testing job',
    skills: 'testing skills',
    jobType: 'employe',
    jobStatus: 'Inactive',
    payment: '30usd per week',
    jobDescription: 'testing job description',
    timeperiod:'3 months',
    genaral_terms:['genTerm1','genTerm2','genTerm3'],
    payment_terms:['paymentTerm1','paymentTerm2','paymentTerm3'],
    workflow:['workflow1','workflow2','workflow3'],
    others:['others'],
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

  const handleRemoveGeneralTerms=(index)=>{
    const newItems = [...formData.genaral_terms];
    const filterItems = newItems.filter((currElm, ind)=>ind !== index)
    setFormData({...formData, genaral_terms:[...filterItems]})
    // console.log(filterItems);
  }

  const handleRemovePaymentTerms =(index)=>{
    const newItems = [...formData.payment_terms];
    const filterItems = newItems.filter((currElm, ind)=>ind !== index)
    setFormData({...formData, payment_terms:[...filterItems]})
  }

  const handleRemoveWorkflow =(index)=>{
    const newItems = [...formData.workflow];
    const filterItems = newItems.filter((currElm, ind)=>ind !== index)
    setFormData({...formData, workflow:[...filterItems]})
  }

  const handleRemoveOthers=(index)=>{
    const newItems = [...formData.others];
    const filterItems = newItems.filter((currElm, ind)=>ind !== index)
    setFormData({...formData, others:[...filterItems]})
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
  setFormData((prevValue) => {
      const copyOfPrevValueObj = { ...prevValue }   
      
      // take a copy
      const copyOfArray = copyOfPrevValueObj[termsKey].slice()     
      
      // making modifications to the copy
      copyOfArray.push("")
      
      copyOfPrevValueObj[termsKey] = copyOfArray   
      
      return copyOfPrevValueObj
  })
}

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("edit job: ", formData)
  };

  return (
    <Wrapper>
        <div className="container">
        <div className="back__button">
          <a href="./admin#/admin">
          <IoIosArrowBack/>
          </a>
        </div>

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
          <label htmlFor="job_title">Name of Job</label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            // placeholder='UI Design'
            value={formData.job_title}
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
            // placeholder='1 Week'
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
            // placeholder='30$'
            value={formData.payment}
            onChange={handleInputChange}
          />
        </div>
        <div className='input__data'>
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            // placeholder='1. Setting goals and developing plans for business and revenue growth. Researching, planning, and implementing new target market initiatives.'
            value={formData.jobDescription}
            onChange={handleInputChange}
          />
        </div>

        <div className="gernaral__term">
            <label>General Terms</label>
            <div className="general__items">
          {
            React.Children.toArray(formData.genaral_terms?.map((x, i)=>{
              return <div className="item">
              <p> <input value={x} placeholder="genaral term" onChange={(e) => handleChangeInTermsArray(e.target.value, "genaral_terms", i)} /> </p>
              <AiFillCloseCircle onClick={()=>{handleRemoveGeneralTerms(i)}}/>
          </div>
            }))
          }
            </div>
            
            <div className="add__item">
                <AiFillPlusCircle onClick={() => handleAddTerm("genaral_terms")}/>
                <label>Add General Terms</label>
            </div>
            </div>


        <div className="gernaral__term">
            <label>Payment Terms</label>
            <div className="general__items">
               {
                  React.Children.toArray(formData.payment_terms?.map((x,i)=>{
                  return <div className='item'>
                   <p> <input value={x} placeholder="payment term" onChange={(e) => handleChangeInTermsArray(e.target.value, "payment_terms", i)} /> </p>
                    <AiFillCloseCircle onClick={()=>{handleRemovePaymentTerms(i)}}/>
                  </div>
                   }))
                }
            </div>
            <div className="add__item">
                <AiFillPlusCircle onClick={() => handleAddTerm("payment_terms")}/>
                <label>Add Payement Terms</label>
            </div>
        </div>

        <div className="gernaral__term">
            <label>Workflow</label>
            <div className="general__items">
            {
                  React.Children.toArray(formData.workflow?.map((x,i)=>{
                  return <div className='item'>
                   <p><input value={x} placeholder="workflow" onChange={(e) => handleChangeInTermsArray(e.target.value, "workflow", i)} /> </p>
                    <AiFillCloseCircle onClick={()=>{handleRemoveWorkflow(i)}}/>
                  </div>
                   }))
                }
            </div>
            <div className="add__item">
                <AiFillPlusCircle onClick={() => handleAddTerm("workflow")}/>
                <label>Add Workflow</label>
            </div>
        </div>

        <div className="gernaral__term">
            <label>Others</label>
            <div className="general__items">
            {
                  React.Children.toArray(formData.others?.map((x,i)=>{
                  return <div className='item'>
                   <p><input value={x} placeholder="others" onChange={(e) => handleChangeInTermsArray(e.target.value, "others", i)} /> </p>
                    <AiFillCloseCircle onClick={()=>{handleRemoveOthers(i)}}/>
                  </div>
                   }))
                }
            </div>
            <div className="add__item">
            <AiFillPlusCircle onClick={() => handleAddTerm("others")}/>
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

    .back__button {
      position: absolute;
      top: 20px;
      left: 50px;
      color:black;
      background-color: #f3f8f5;
      padding: 3px 15px;
      padding-top: 10px;
      font-size: 20px;
      cursor: pointer;
    }

    .main__titles{
        padding-top: 70px;
        padding: 70px 0px 20px 20px;
        h2{
            color: #005734;
            font-weight: 700;
            font-size: 32px;
        }

        h3{
            font-size: 13px;
            font-weight: 600;
        }
    }
    
    .job__details{
        background-color: #F3F8F4;
        padding: 40px 35px;
        border-radius: 10px;
        .job__detail__title{
            color:#fff;
            padding:20px 20px;
            background-color:#005734;
            border-radius: 10px 10px 0px 0px;

            h3{
              font-size: 30px;
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
                }

                input {
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #005734;
                }

                textarea#jobDescription {
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
      .item{
        p{
          input{
          }
        }
      }
    }
  `

  export default EditJob;



