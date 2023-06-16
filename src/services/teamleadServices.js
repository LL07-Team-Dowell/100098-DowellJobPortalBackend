import { currentBackendAxiosInstance } from "./axios";

export const leadHireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_hire_candidate/",
    data
  );
};

export const leadReHireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_rehire_candidate/",
    data
  );
};

export const getCandidateApplicationsForTeamLead = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `/candidate_management/get_job_application/${company_id}/`
  );
};

export const rejectCandidateApplicationForTeamLead = async (data) => {
  console.log(data);
  return await currentBackendAxiosInstance.post(
    "lead_reject_candidate/",
    data
  );
};

export const getCandidateTaskForTeamLead = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `/task_management/get_task/${companyId}/`
  );
};

export const candidateUpdateTaskForTeamLead = async (data) => {
  return await currentBackendAxiosInstance.post(
    "/task_management/update_task/",
    data
  );
};
