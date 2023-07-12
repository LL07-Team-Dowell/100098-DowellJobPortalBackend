import React, { useEffect, useState } from "react";
import "./Hr_TrainingScreen.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getTrainingManagementQuestions } from "../../../../services/hrTrainingServices";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { IoMdRefresh } from "react-icons/io";

function HrTrainingScreen({ trainingCards, setShowOverlay, setQuestions, handleRefreshForTrainingManagemnt }) {
  const { questions } = useHrJobScreenAllTasksContext();
  // console.log(questions);

  const { navigate } = useNavigate();

  const { currentUser } = useCurrentUserContext();

  const fetchCreatedQuestions = async (e, module) => {
    e.preventDefault();

    setShowOverlay(true);

    try {
      const response = await getTrainingManagementQuestions(
        currentUser.portfolio_info[0].org_id
      );
      console.log(response.data);

      const dataGottenFromQuestions = response.data.response.data
        .reverse()
        .filter(
          (question) =>
            question.data_type === currentUser.portfolio_info[0].data_type
        );

      setQuestions(dataGottenFromQuestions);

      const questionToEdit = dataGottenFromQuestions.find(
        (question) => question.module === module
      );

      if (!questionToEdit) return;

      navigate(`/hr-training/${questionToEdit.module}?questionId=${questionToEdit._id}`);
    } catch (error) {
      console.log(error);
    }

    setShowOverlay(false);
  };

  const handleClick = (e, link) => {
    e.preventDefault();
    window.open(link, "_blank");
  };

  return (
    <div className="training__wrapper">
      <button
        className="refresh-container"
        onClick={handleRefreshForTrainingManagemnt}
      >
        <div className="refresh-btn">
          <IoMdRefresh />
          <p>Refresh</p>
        </div>
      </button>
      <div className="training__header">
        <h1>Create Training Programs</h1>
      </div>
      <div className="training__container">
        {trainingCards.map((card) => (
          <div className="training__cards" key={card.id}>
            <div className="svg_component">{card.svg}</div>
            {questions.find((question) => question.module === card.module)
              ?.question_link ? (
              <div className="edit">
                <Link
                  to={`/hr-training/${encodeURIComponent(
                    card.module
                  )}?questionId=${
                    questions.find(
                      (question) => question.module === card.module
                    )?._id
                  }`}
                  className="edit__btn"
                  onClick={
                    questions.find(
                      (question) => question.module === card.module
                    )?.newly_created
                      ? (e) => fetchCreatedQuestions(e, card.module)
                      : () =>
                          navigate(
                            `/hr-training/${encodeURIComponent(
                              questions.find(
                                (question) => question.module === card.module
                              )?.module
                            )}?questionId=${
                              questions.find(
                                (question) => question.module === card.module
                              )?._id
                            }`
                          )
                  }
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
                to={`/hr-training/${encodeURIComponent(card.module)}`}
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
