import React from "react";
import "./WorkLogRequestTeamLead.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useGetAllUpdateTask } from "../../../CandidatePage/views/WorkLogRequest/hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Buttons from "../../../CandidatePage/views/WorkLogRequest/component/Buttons";
import { useState } from "react";
import Card from "../../../CandidatePage/views/WorkLogRequest/component/Card";
import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";

const WorkLogRequestTeamLead = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, loading, error } = useGetAllUpdateTask(currentUser);
  const [cardData, setCardData] = useState("pending-approved");
  const changeCardsStats = (cardData) => {
    setCardData(cardData);
  };
  const navigate = useNavigate();

  const handleUpdateTaskForDay = (detail) => {
    navigate("/", { state: { log_request_date: detail?.update_task_date } });
  };

  if (error) return <h1>{error}</h1>;
  return (
    <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
      <div className="work__log__request">
        <Buttons changeCardsStats={changeCardsStats} />
        {!loading ? (
          <div className="cards">
            {cardData === "pending-approved"
              ? data
                  ?.filter(
                    (element) =>
                      element.approved === false &&
                      element.request_denied === false
                  )
                  .map((element, index) => (
                    <Card
                      key={`pending__approved__card${index}`}
                      {...element}
                    />
                  ))
              : cardData === "approved"
              ? data
                  ?.filter(
                    (element) =>
                      element.approved === true &&
                      element.request_denied === false
                  )
                  .map((element, index) => (
                    <Card
                      key={`approved__card${index}`}
                      updateTask={true}
                      handleBtnClick={() => handleUpdateTaskForDay(element)}
                      {...element}
                    />
                  ))
              : cardData === "denied"
              ? data
                  ?.filter(
                    (element) =>
                      element.approved === false &&
                      element.request_denied === true
                  )
                  .map((element, index) => (
                    <Card key={`denied__card${index}`} {...element} />
                  ))
              : null}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </StaffJobLandingLayout>
  );
};

export default WorkLogRequestTeamLead;
