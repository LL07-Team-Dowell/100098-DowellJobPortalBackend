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
    `candidate_get_job_application/${company_id}/`
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
    `get_task/${companyId}/`
  );
};

export const candidateUpdateTaskForTeamLead = async (data) => {
  return await currentBackendAxiosInstance.patch(
    "update_task/",
    data
  );
};

// Apis For Threads 
export const fetchThread = async(data)=>{
  return await currentBackendAxiosInstance.get(
    "fetch_thread/",
    data
  )
}

//Apis For comment 
export const postComment = async(data)=>{
  return await currentBackendAxiosInstance.post(
    "create_comment/",
    data
  )
}

export const featchAllComment = async (data) => {
  console.log(data);
  return await currentBackendAxiosInstance.get("fetch_comment/", data );
};

export const updateComment = async(data)=>{
  return await currentBackendAxiosInstance.patch(
    "update_comment/",
    data
  )
}
