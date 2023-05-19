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
    "/candidate_management/get_job_application/",
    data
  );
};

export const rejectCandidateApplicationForTeamLead = async (data) =>{
  console.log(data);
  return await currentBackendAxiosInstance.post(
    "lead_management/reject_candidate/",
    data
  )
}

export const getCandidateTaskForTeamLead = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `/task_management/get_task/${companyId}/`
  );
}

export const candidateUpdateTaskForTeamLead = async (data) => {
  return await currentBackendAxiosInstance.post(
    "/task_management/update_task/",
    data
  );
}
