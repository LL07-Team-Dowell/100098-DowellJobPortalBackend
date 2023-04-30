import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createQuestionForTrainingMangement } from "../../../../services/hrTrainingServices";
import { NavigationContextProvider } from "../../../../contexts/NavigationContext";

function HrTrainingQuestions({ trainingCards }) {
  const { currentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { module } = useParams();

  const [questions, setQuestions] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    data_type: currentUser.portfolio_info[0].data_type,
    question_link: "",
    module: "",
    created_on: new Date(),
    created_by: currentUser.userinfo.username,
    is_active: true,
  });

  useEffect(() => {
    createQuestionForTrainingMangement(questions);
  }).then((res) => console.log(res, "res"));

  return (
    <>
      <div className="container">
        <div>
          <button onClick={() => navigate(-1)} style={{ position: "relative" }}>
            <MdArrowBackIosNew
              style={{
                color: "#005734",
                position: "absolute",
                fontSize: 25,
                top: "20%",
                left: "21%",
              }}
            />
          </button>
          {trainingCards
            .filter((card) => card.module === module)
            .map((card) => (
              <div key={card.id}>
                <h1>{card.module}</h1>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default HrTrainingQuestions;
