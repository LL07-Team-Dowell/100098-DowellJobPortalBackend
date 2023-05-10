import React, { useEffect, useState } from "react";
import "./Hr_TrainingScreen.css";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getTrainingManagementQuestions } from "../../../../services/hrTrainingServices";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";

function HrTrainingScreen({ trainingCards }) {
  const { questions, setQuestions } = useHrJobScreenAllTasksContext();

  useEffect(() => {
    getTrainingManagementQuestions({
      document_id: crypto.randomUUID(),
    })
      .then((res) => {
        setQuestions(res.data);
        console.log(res.data);

        if (res.data.length === 0) {
          console.log("No data");
        } else if (res.data.length > 0) {
          console.log("Data is present");
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
