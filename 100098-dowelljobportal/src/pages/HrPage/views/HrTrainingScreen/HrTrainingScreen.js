import React, { useEffect, useState } from "react";
import "./Hr_TrainingScreen.css";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getTrainingManagementQuestions } from "../../../../services/hrTrainingServices";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";

function HrTrainingScreen({ trainingCards, setShowOverlay }) {
  const { questions, setQuestions } = useHrJobScreenAllTasksContext();

  const { currentUser } = useCurrentUserContext();

  const fetchCreatedQuestions = async (e) => {
    e.preventDefault();

    setShowOverlay(true);

    try {
      const response = await getTrainingManagementQuestions({
        company_id: currentUser.portfolio_info[0].org_id,
      });

      const ListOfQuestions = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (e, link) => {
    e.preventDefault();
    window.open(link, "_blank");
  };

  return (
    <div className="training__wrapper">
      <div className="training__header">
        <h1>Create Training Programs</h1>
      </div>
      <div className="training__container">
        {trainingCards.map((card) => (
          <div className="training__cards" key={card.id}>
            <div className="svg_component">{card.svg}</div>
            {questions.find((question) => question.module === card.module)
              ?.newly_created ? (
              <div className="edit">
                <Link
                  to={`/hr-training/${card.module}`}
                  className="edit__btn"
                  onClick={fetchCreatedQuestions}
                >
                  {card.action}
                </Link>
              </div>
            ) : (
              <></>
            )}
            <div className="training__card__body">
              <h2>{card.module}</h2>
              <p className="training__card__description">{card.description}</p>
            </div>
            {questions.find((question) => question.module === card.module) ? (
              <Link
                to={`/hr-training/#`}
                style={{ color: "black" }}
                onClick={(e) =>
                  handleClick(
                    e,
                    questions.find(
                      (question) => question.module === card.module
                    ).question_link
                  )
                }
              >
                <button className="action__btn">
                  <span>View Now</span>
                  <AiOutlineArrowRight fontSize="1.4rem" />
                </button>
              </Link>
            ) : (
              <Link
                to={`/hr-training/${card.module}`}
                style={{ color: "black" }}
              >
                <button className="action__btn">
                  <span>Create Now</span>
                  <AiOutlineArrowRight fontSize="1.4rem" />
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HrTrainingScreen;
