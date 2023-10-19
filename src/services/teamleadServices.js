import axios from "axios";
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
export const fetchThread = async (data) => {
  return await currentBackendAxiosInstance.get(
    `fetch_team_thread/${data}/`
  )
}

export const updateSingleThread = async (data) => {
  return await currentBackendAxiosInstance.patch(
    `update_thread/`,
    data
  )
}

//Apis For comment 
export const postComment = async (data) => {
  return await currentBackendAxiosInstance.post(
    "create_comment/",
    data
  )
}

export const featchAllComment = async (data) => {
  return await currentBackendAxiosInstance.get("fetch_comment/", data);
};

export const updateSingleComment = async (data) => {
  return await currentBackendAxiosInstance.patch(
    "update_comment/",
    data
  )
}

export const approveTask = async (data) => {
  return await currentBackendAxiosInstance.patch(
    "approve_task/",
    data
  )
}


//Claim Vouchar
export const claimVoucher = async (data) => {
  try {
    const response = await axios.post('https://100105.pythonanywhere.com/api/v3/voucher/?type=claim_voucher', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Claim Vouchar
export const getVouchar = async (data) => {
  try {
    const response = await axios.post('https://100105.pythonanywhere.com/api/v3/voucher/?type=voucher_code_details', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyVouchar = async (data) => {
  try {
    const response = await axios.post(`https://100105.pythonanywhere.com/api/v3/voucher/?type=verify_voucher_redemption&voucher_id=${data}`);
    console.log({ "verify res": response });
    return response;
  } catch (error) {
    throw error
  }
}


export const getCandidateTasksV2 = async (data) => {
  return await currentBackendAxiosInstance.post(
    'task_module/?type=get_all_candidate_tasks',
    data
  )
}


export const createNewTeamTask = async (data) => {
  return await currentBackendAxiosInstance.post('/task_management/create_task/', data)
}

export const editTeamTask = async (taskId, data) => {
  return await currentBackendAxiosInstance.patch(`/edit_team_task/${taskId}/`, data)
}