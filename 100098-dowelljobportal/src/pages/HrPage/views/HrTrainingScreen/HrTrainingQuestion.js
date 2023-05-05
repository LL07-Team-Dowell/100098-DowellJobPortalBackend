import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createQuestionForTrainingMangement } from "../../../../services/hrTrainingServices";
import "./Hr_TrainingQuestion.css";
import { toast } from "react-toastify";

function HrTrainingQuestions({ trainingCards }) {
  const { currentUser } = useCurrentUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // const { module } = useParams();

  const [questions, setQuestions] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    question_link: "",
    module: "",
    created_on: new Date(),
    created_by: currentUser.userinfo.username,
    is_active: true,
  });

  const handleOnChange = (valueEntered, inputName) => {
    setQuestions((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // console.log(questions);

    // const fields = ["question_link"];

    // if (questions.question_link === "") {
    //   toast.info("Please input question link");
    //   return;
    // } else if (fields.find((field) => questions[field] === "")) {
    //   toast.info(
    //     `Please input ${fields.find((field) => questions[field] === "")} field`
    //   );
    //   return;
    // }

    setIsLoading(true);
    try {
      const response = await createQuestionForTrainingMangement(questions);
      console.log(response.data);

      // if (response.status === 201) {
      //   setQuestions((prevValue) => [questions, ...prevValue]);
      //   toast.success("Question created successfully");
      //   navigate("/hr-training");
      // } else {
      //   toast.error("Question failed to be created");
      // }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        <div className="question__background">
          <div className="question__description">
            <div className="question__top__background"></div>
            <div className="question__body">
              <div className="head">
                <h2 className="question__title">Add Form Title</h2>
                <span></span>
              </div>
              <input
                type="text"
                name={"question_link"}
                value={questions.question_link}
                placeholder="Add Description"
                className="question__link"
                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                required
              />
              <div className="bottom">
                <button
                  className="send__btn"
                  onClick={(e) => handleOnSubmit(e)}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HrTrainingQuestions;
