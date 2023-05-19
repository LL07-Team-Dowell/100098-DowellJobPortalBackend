import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createQuestionForTrainingMangement, editTrainingManagementQuestion } from "../../../../services/hrTrainingServices";
import "./Hr_TrainingQuestion.css";
import { toast } from "react-toastify";
import DropdownButton from "../../../TeamleadPage/components/DropdownButton/Dropdown";
import { ReactComponent as Add } from "./assets/addbtn.svg";
import { ReactComponent as Delete } from "./assets/deletebtn.svg";
import { validateUrl } from "../../../../helpers/helpers";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";

function HrTrainingQuestions() {
  const { currentUser } = useCurrentUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Link");
  const [selectOption, setSelectOption] = useState([
    "Link",
    // "Text",
    // "Image",
    // "Video",
  ]);
  const [ existingQuestion, setExistingQuestion ] = useState(false);
  const [ params, setParams ] = useSearchParams();
  const { sub_section } = useParams();
  const { questions, setQuestions } = useHrJobScreenAllTasksContext();
  
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    question_link: "",
    module: sub_section,
    created_by: currentUser.userinfo.username,
    is_active: true,
  });

  const handleOnChange = (valueEntered, inputName) => {
    setQuestion((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(question);

    const fields = ["question_link"];

    if (question.question_link === "") {
      toast.info("Please input question link");
      return;
    } else if (fields.find((field) => question[field] === "")) {
      toast.info(
        `Please input ${fields.find((field) => question[field] === "")} field`
      );
      return;
    }

    if (!validateUrl(question.question_link)) {
      toast.error("Invalid question link");
      return;
    }

    setIsLoading(true);
    
    if (existingQuestion) {
      const updateQuestionData = {
        "document_id": params.get('questionId'),
        "is_active": true,
        "question_link": question.question_link
      }

      try {
        const res = await editTrainingManagementQuestion(updateQuestionData);
        
        const currentQuestions = questions.slice();
        const currentQuestionIndex = questions.findIndex(question => question._id === updateQuestionData.document_id);
        
        if (currentQuestionIndex !== -1) {
          currentQuestions[currentQuestionIndex].question_link = updateQuestionData.question_link;
          setQuestions(currentQuestions)
        }

        toast.success("Question updated successfully");
        navigate("/hr-training");

      } catch (error) {
        toast.error("Question failed to be created");
      }

      setIsLoading(false);
      return
    }

    try {
      const newQuestion = {
        ...question,
        created_on: new Date(),
      };
      const response = await createQuestionForTrainingMangement(newQuestion);
      console.log(response.data);

      if (response.status === 201) {
        setQuestions((prevValue) => [
          { ...newQuestion, newly_created: true },
          ...prevValue,
        ]);
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
    const questionId = params.get('questionId');
    if (!questionId) return setExistingQuestion(false);

    const foundQuestion = questions.find(question => question._id === questionId);
    if (!foundQuestion) return setExistingQuestion(false);

    setExistingQuestion(true);
    setQuestion((prevValue) => { return {...prevValue, question_link: foundQuestion?.question_link } });
  }, [params])

  // useEffect(() => {
  //   if (selectOption.length < 1) return;
  //   if (selectedOption !== "") return;
  //   setSelectOption(selectOption[0]);
  // }, [selectOption]);

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
                    value={question.question_link}
                    placeholder="Add a Question"
                    className="question__link"
                    onChange={(e) =>
                      handleOnChange(e.target.value, e.target.name)
                    }
                    required
                  />
                  <DropdownButton
                    className="questions"
                    currentSelection={selectedOption}
                    handleSelectionClick={(value) => {
                      setSelectedOption(value);
                    }}
                    selections={selectOption}
                    removeDropDownIcon={false}
                  />
                </div>
                <div className="bottom">
                  <button
                    className="send__btn"
                    onClick={(e) => handleOnSubmit(e)}
                    disabled={isLoading}
                  >
                    <div className="save">
                      {isLoading ? (
                        <LoadingSpinner width={25} height={25} color="#fff" />
                      ) : (
                        <div>{existingQuestion ? "Update" : "Send"}</div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/*<div className="question__action__btn">
              <Add />
              <Delete />
                      </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}

export default HrTrainingQuestions;
