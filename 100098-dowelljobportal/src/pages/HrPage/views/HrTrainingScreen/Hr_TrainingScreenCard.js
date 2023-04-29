import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

function HrTrainingScreenCard({ module, handleSendClick }) {
    if(module === null) return <></>;
  return (
    <>
      <div className="training__card__body">
        <h2>{module}</h2>
        <p className="training__card__description">
          Prepare for a career in front-end Development. Receive
          professional-level training from uxliving lab
        </p>
      </div>
      <Link to={`/hr-training/${module}`} style={{color: "black"}}>
        <button className="action__btn" onClick={handleSendClick}>
          <span>Create Now</span>
          <AiOutlineArrowRight fontSize="1.4rem" />
        </button>
      </Link>
    </>
  );
}

export default HrTrainingScreenCard;
