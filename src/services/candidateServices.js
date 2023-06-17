import { formerBackendAxiosInstance, currentBackendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await currentBackendAxiosInstance.post("/candidate_management/apply_job/", data)
}

export const getJobs = async (datass) => {
    console.log(datass);
    const data = { "company_id": datass };
    return await currentBackendAxiosInstance.post("/admin_management/get_jobs/", data)
}

export const getAppliedJobs = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `/candidate_management/get_job_application/${company_id}/`
  );
};

export const getCandidateTask= async (companyId) => {
    return await currentBackendAxiosInstance.get(`get_task/${companyId}/`)
}



export const createCandidateTask = async (data) => {
    return await currentBackendAxiosInstance.post("create_task/",data)
}

export const candidateSubmitResponse = async (data) => {
    return await currentBackendAxiosInstance.patch("submit_response/", data)
}