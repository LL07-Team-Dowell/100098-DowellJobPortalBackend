import React, { useEffect, useState } from "react";
import "./Hr_TrainingScreen.css";
import { ReactComponent as Frontend } from "./assets/system3.svg";
import { ReactComponent as Ux } from "./assets/ux-design-1.svg";
import { ReactComponent as Backend } from "./assets/database-1.svg";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

function HrTrainingScreen({ trainingCards }) {
  return (
    <div className="training__wrapper">
      <div className="training__header">
        <h1>Create Training Programs</h1>
      </div>
      <div className="training__container">
        {trainingCards.map((card) => (
          <div className="training__cards" key={card.id}>
            <div className="svg_component">{card.svg}</div>
            <div className="training__card__body">
              <h2>{card.module}</h2>
              <p className="training__card__description">{card.description}</p>
            </div>
            <Link to={`/hr-training/${card.module}`} style={{ color: "black" }}>
              <button className="action__btn">
                <span>Create Now</span>
                <AiOutlineArrowRight fontSize="1.4rem" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HrTrainingScreen;
