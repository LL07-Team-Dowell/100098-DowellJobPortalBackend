import React from "react";
import logo from "../../../../assets/images/landing-logo.png";
import illus from "../../../../assets/images/web-error.jpg";
import { Link } from "react-router-dom";
import "./CandidateRenewContract.scss";
import { uxlivingLabURL } from "../../../../utils/utils";
const CandidateRenewContract = () => {
  return (
    <div className='renewcontract__wraper'>
      <img
        src={logo}
        alt='logo'
        className={"logo"}
        onClick={() => window.location.replace(uxlivingLabURL)}
      />
      <h2></h2>
      <div>
        <p>
          <b>
            Your contract has expired. Follow these steps to renew the contract:
          </b>
        </p>
        <ol>
          <li>
            Visit{" "}
            <a
              href='https://dowellresearch.com/freelancers/'
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: "#005734", display: "inline", padding: "7px" }}
            >
              https://dowellresearch.com/freelancers/
            </a>
          </li>
          <li>
            Perform the speed test using your laptop; mobile devices are not
            allowed.
          </li>
          <li>Await access approval from HR.</li>
          <li>Email your speed test results to HR.</li>
        </ol>
        <p>
          Note: you can also send mail to{" "}
          <span style={{ color: "#005734" }}>hr@dowellresearch.uk</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default CandidateRenewContract;
