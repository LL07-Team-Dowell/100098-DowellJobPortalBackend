import { currentBackendAxiosInstance } from "./axios";

export const leadHireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_management/hire_candidate/",
    data
  );
};

export const leadReHireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_management/rehire_candidate/",
    data
  );
};

export const getCandidateApplicationsForTeamLead = async (data) => {
  return await currentBackendAxiosInstance.post(
    "/candidate_management/get_candidate_application/",
    data
  );
};
