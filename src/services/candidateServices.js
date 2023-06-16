import { formerBackendAxiosInstance, currentBackendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await currentBackendAxiosInstance.post("candidate_apply_job/", data)
}

export const getJobs = async (datass) => {
    console.log(datass);
    const data = { "company_id": datass };
    return await currentBackendAxiosInstance.post("/admin_management/get_jobs/", data)
}

export const getAppliedJobs = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `/candidate_get_job_application/${company_id}/`
  );
};

export const getCandidateTask= async (companyId) => {
    return await currentBackendAxiosInstance.get(`task_management/get_task/${companyId}/`)
}



export const createCandidateTask = async (data) => {
    return await currentBackendAxiosInstance.post("task_management/create_task/",data)
}

export const candidateSubmitResponse = async (data) => {
    return await currentBackendAxiosInstance.patch("training_management/submit_response/", data)
}

export const getCandidateApplication = async (company_id) => {
    return await currentBackendAxiosInstance.get(`get_all_onboarded_candidate/${company_id}/`)
}

export const getAllOnBoardedCandidate = async (document_id) => {
    return await currentBackendAxiosInstance.get(`get_candidate_application/${document_id}/`)
}

export const deleteCandidateApplication = async (document_id) => {
    return await currentBackendAxiosInstance.delete(`delete_candidate_application/${document_id}/`)

}