import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

function HrTrainingScreenCard({ title, _id }) {
  return (
    <>
      <div className="training__card__body">
        <h2>{title}</h2>
        <p className="training__card__description">
          Prepare for a career in front-end Development. Receive
          professional-level training from uxliving lab
        </p>
      </div>
      <Link to={`/hr-training/${_id}`} style={{color: "black"}}>
        <div className="action__btn">
          <span>Create Now</span>
          <AiOutlineArrowRight fontSize="1.4rem" />
        </div>
      </Link>
    </>
  );
}

export default HrTrainingScreenCard;
