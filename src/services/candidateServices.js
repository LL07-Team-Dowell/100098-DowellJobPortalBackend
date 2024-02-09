import { currentBackendAxiosInstance } from "./axios";

export const submitNewApplication = async (data) => {
  return await currentBackendAxiosInstance.post("candidate_apply_job/", data);
};

export const getJobs = async (datass) => {
  const data = { company_id: datass };
  return await currentBackendAxiosInstance.get(`admin_get_all_jobs/${datass}/`);
};

export const getAppliedJobs = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `/candidate_get_job_application/${company_id}/`
  );
};

export const getCandidateTask = async (companyId) => {
  return await currentBackendAxiosInstance.get(`get_task/${companyId}/`);
};

export const createCandidateTask = async (data) => {
  return await currentBackendAxiosInstance.post("create_task/", data);
};

export const requestToUpdateTask = async (data) => {
  return await currentBackendAxiosInstance.post("create_task_update_request/", data);
};

export const candidateSubmitResponse = async (data) => {
  return await currentBackendAxiosInstance.patch("submit_response/", data);
};

export const getCandidateApplication = async (document_id) => {
  return await currentBackendAxiosInstance.get(
    `get_candidate_application/${document_id}/`
  );
};

export const getAllOnBoardedCandidate = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `get_all_onboarded_candidate/${company_id}/`
  );
};

export const deleteCandidateApplication = async (document_id) => {
  return await currentBackendAxiosInstance.delete(
    `delete_candidate_application/${document_id}/`
  );
};

export const submitPublicApplication = async (data, linkId) => {
  return await currentBackendAxiosInstance.post(
    `public_candidate_job_application/?link_id=${linkId}`,
    data
  );
};

export const addNewCandidateTaskV2 = async (data) => {
  return await currentBackendAxiosInstance.post(
    'task_module/?type=add_task',
    data
  )
};

export const updateNewCandidateTaskV2 = async (data, taskId) => {
  return await currentBackendAxiosInstance.post(
    `task_module/?type=update_candidate_task&task_id=${taskId}`,
    data
  )
};

export const saveCandidateTaskV2 = async (taskId) => {
  return await currentBackendAxiosInstance.get(
    `task_module/?type=save_task&task_id=${taskId}`
  )
};

export const getCandidateTasksOfTheDayV2 = async (data) => {
  return await currentBackendAxiosInstance.post(
    'task_module/?type=get_candidate_task',
    data
  )
};

export const updateSingleCandidateTaskV2 = async (data, taskId) => {
  return await currentBackendAxiosInstance.post(
    `task_module/?type=update_single_task&current_task_id=${taskId}`,
    data
  )
}

export const deleteSingleCandidateTaskV2 = async (taskId, status) => {
  return await currentBackendAxiosInstance.get(
    `task_module/?type=delete_current_task&current_task_id=${taskId}&action=${status}`,
  )
}

export const getPaymentRecord = async (data) => {
  return await currentBackendAxiosInstance.post(
    `invoice_module/?type=get-payment-records`, data
  )
}

export const savePaymentRecord = async (dataToPost) => {
  return await currentBackendAxiosInstance.post(
    `invoice_module/?type=save-payment-records`, dataToPost
  )
}

export const updatePaymentRecord = async (dataToPost) => {
  return await currentBackendAxiosInstance.post(
    `invoice_module/?type=update-payment-records`, dataToPost
  )
}