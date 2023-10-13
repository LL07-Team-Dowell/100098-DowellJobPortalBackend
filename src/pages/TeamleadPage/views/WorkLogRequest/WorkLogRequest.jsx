import React, { useEffect } from "react";
import "./style.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useGetAllUpdateTask } from "../../../CandidatePage/views/WorkLogRequest/hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Buttons from "../../../CandidatePage/views/WorkLogRequest/component/Buttons";
import { useState } from "react";
import Card from "../../../CandidatePage/views/WorkLogRequest/component/Card";
import { useNavigate } from "react-router-dom";
import { approveLogRequest, denyLogRequest, getAllUpdateTask } from "../../../../services/taskUpdateServices";

const WorkLogRequest = () => {
  const { currentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const { error } = useGetAllUpdateTask(currentUser);
  const [cardData, setCardData] = useState("pending-approved");
  const changeCardsStats = (cardData) => {
    setCardData(cardData);
  };
  const navigate = useNavigate();
  // asdsad

  useEffect(() => {
    setLoading(true);

    getAllUpdateTask(currentUser.portfolio_info[0].org_id)
      .then((response) => {
        // console.log(response.data.response.data);
        setData(
          response?.data?.response?.data?.filter(
            (applicant) =>
              applicant?.company_id === currentUser.portfolio_info[0].org_id
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  }, []);

  const approveRequest = () => {
    approveLogRequest(currentUser.portfolio_info[0].org_id)
    .then((response) => {
      console.log(response.date)
    })
  }

  const denyRequest = () => {
    denyLogRequest()
  }

  if (error) return <h1>{error}</h1>;
  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
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
                      approve={true}
                      deny={true}
                      handleApproveBtnClick={() => approveRequest()}
                      // handleDenyBtnClick={() => denyRequest()}
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
                    <Card key={`approved__card${index}`} {...element} />
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
