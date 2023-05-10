import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createQuestionForTrainingMangement } from "../../../../services/hrTrainingServices";
import "./Hr_TrainingQuestion.css";
import { toast } from "react-toastify";
import DropdownButton from "../../../TeamleadPage/components/DropdownButton/Dropdown";
import { ReactComponent as Add } from "./assets/addbtn.svg";
import { ReactComponent as Delete } from "./assets/deletebtn.svg";
import { validateUrl } from "../../../../helpers/helpers";

function HrTrainingQuestions({ trainingCards }) {
  const { currentUser } = useCurrentUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectOption, setSelectOption] = useState([
    "Link",
    "Test",
    "Image",
    "Video",
  ]);
  const [selectedOption, setSelectedOption] = useState("");

  const { sub_section } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    question_link: "",
    module: sub_section,
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
    console.log(questions);

    const fields = ["question_link"];

    if (questions.question_link === "") {
      toast.info("Please input question link");
      return;
    } else if (fields.find((field) => questions[field] === "")) {
      toast.info(
        `Please input ${fields.find((field) => questions[field] === "")} field`
      );
      return;
    }

    if (!validateUrl(questions.question_link)) {
      toast.error("Invalid question link");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createQuestionForTrainingMangement({
        ...questions,
        created_on: new Date(),
      });
      console.log(response.data);

      if (response.status === 201) {
        setQuestions((prevValue) => {
          const copyOfPrevValue = { ...prevValue };
          copyOfPrevValue.question_link = "";
          return copyOfPrevValue;
        });
        toast.success("Question created successfully");
        navigate("/hr-training");
      } else {
        toast.error("Question failed to be created");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (selectOption.length < 1) return;
    if (selectedOption !== "") return;
    setSelectedOption(selectOption[0]);
  }, [selectOption]);


  return (
    <>
      <div className="container">
        <div className="question__background">
          <div className="content__container">
            <div className="question__description">
              <div className="question__body">
                <div className="head">
                  <h2 className="question__title">Add Question Link</h2>
                  <span></span>
                </div>
                <div className="question__selection">
                  <input
                    type="text"
                    name={"question_link"}
                    value={questions.question_link}
                    placeholder="Add a Question"
                    className="question__link"
                    onChange={(e) =>
                      handleOnChange(e.target.value, e.target.name)
                    }
                    required
                  />
                  <DropdownButton
                    currentSelection={
                      // selectOption.length > 0 ? selectOption[0] : ""
                      selectOption[0] ? selectOption[0] : ""
                    }
                    className="questions"
                    handleSelectionClick={(selection) =>
                      setSelectedOption(selection)
                    }
                    selection={selectOption}
                  />
                </div>
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
            <div className="question__action__btn">
              <Add />
              <Delete />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HrTrainingQuestions;
