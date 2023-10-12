import React from "react";
import "./WorkLogRequest.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useGetAllUpdateTask } from "./hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Buttons from "./component/Buttons";
import { useState } from "react";
import Card from "./component/Card";

const WorkLogRequest = () => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });
  const { data, loading, error } = useGetAllUpdateTask(currentUser);
  const [cardData, setCardData] = useState("");
  const changeCardsStats = (cardData) => {
    setCardData(cardData);
  };
  if (error) return <h1>{error}</h1>;
  if (loading) return <LoadingSpinner />;
  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
      <Buttons changeCardsStats={changeCardsStats} />
      {cardData === "pending-approved"
        ? data
            .filter(
              (element) =>
                element.approved === false && element.request_denied === false
            )
            .map((element, index) => (
              <Card key={`pending__approved__card${index}`} {...element} />
            ))
        : cardData === "approved"
        ? data
            .filter(
              (element) =>
                element.approved === true && element.request_denied === false
            )
            .map((element, index) => (
              <Card
                key={`approved__card${index}`}
                updateTask={true}
                {...element}
              />
            ))
        : cardData === "denied"
        ? data
            .filter(
              (element) =>
                element.approved === false && element.request_denied === true
            )
            .map((element, index) => (
              <Card key={`denied__card${index}`} {...element} />
            ))
        : null}
    </JobLandingLayout>
  );
};

export default WorkLogRequest;
