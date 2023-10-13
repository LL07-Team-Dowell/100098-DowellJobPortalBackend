import React from "react";
import "./WorkLogRequest.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useGetAllUpdateTask } from "./hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Buttons from "./component/Buttons";
import { useState } from "react";
import Card from "./component/Card";
import { useNavigate } from "react-router-dom";

const WorkLogRequest = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, loading, error } = useGetAllUpdateTask(currentUser);
  const [cardData, setCardData] = useState("pending-approved");
  const changeCardsStats = (cardData) => {
    setCardData(cardData);
  };
  const navigate = useNavigate();
  // asdsad

  const handleUpdateTaskForDay = (detail) => {
    navigate('/', { state: { log_request_date: detail?.update_task_date }})
  }


  if (error) return <h1>{error}</h1>;
  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
      <div className='work__log__request'>
        <Buttons changeCardsStats={changeCardsStats} />
        {!loading ? (
          <div className='cards'>
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
    </JobLandingLayout>
  );
};

export default WorkLogRequest;
