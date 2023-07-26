import React from 'react'
import { BsArrowRight } from 'react-icons/bs'
const ReHirePage = () => {

  return (
    <div className="job__Application__Form__Wrapper">
        <div className="required__Indicator__Item">Required</div>
        <form action="" className="job__Application__Form">
            <div className="job__Application__Items">
                <div className="form__Title__Item">
                    <h2>Payment Form</h2>
                </div>
                <p className="form__Tick__Item">
                    Tick each box to continue
                </p>
                <p className="form__Salutations__Item">
                Thank you for applying to freelancing opportunity in uxlivinglab. Read following terms and conditions and accept
                </p>
                <label  className="form__Label"></label>
                <input type="checkbox" />
                <span>Apply for this job</span>
            </div>
            <button className='apply__Btn green__Btn'>
                <span>Next</span>
                <BsArrowRight/>
            </button>
        </form>
    </div>
  )
}

export default ReHirePage