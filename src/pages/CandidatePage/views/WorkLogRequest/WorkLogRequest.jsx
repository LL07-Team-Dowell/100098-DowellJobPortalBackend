import React from "react";
import "./WorkLogRequest.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useGetAllUpdateTask } from "./hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
const WorkLogRequest = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, loading, error } = useGetAllUpdateTask(currentUser);
  if (error) return <h1>{error}</h1>;
  if (loading) return <LoadingSpinner />;
  return (
    <JobLandingLayout user={currentUser} afterSelection={true}>
      {""}
    </JobLandingLayout>
  );
};

export default WorkLogRequest;
