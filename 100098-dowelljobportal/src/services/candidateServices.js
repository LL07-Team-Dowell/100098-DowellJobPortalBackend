import { formerBackendAxiosInstance, currentBackendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await currentBackendAxiosInstance.post("/candidate_management/apply_job/", data)
}

export const getJobs = async (datass) => {
    console.log(datass);
    const data = { "company_id": datass };
    return await currentBackendAxiosInstance.post("/admin_management/get_jobs/", data)
}

export const getAppliedJobs = async (datass) => {
    const data = { "company_id": datass };
    return await currentBackendAxiosInstance.post("/candidate_management/get_job_application/", data)
}

export const getCandidateTask= async (companyId) => {
    return await currentBackendAxiosInstance.get(`task_management/get_task/${companyId}/`)
}



export const createCandidateTask = async (data) => {
    return await currentBackendAxiosInstance.post("task_management/create_task/",data)
}

export const candidateSubmitResponse = async (data) => {
    return await currentBackendAxiosInstance.patch("training_management/submit_response/", data)
}