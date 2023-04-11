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

export const getCandidateTask= async (data) => {
    return await currentBackendAxiosInstance.post("task_management/get_task/",data)
}



export const createCandidateTask = async (data) => {
    return await currentBackendAxiosInstance.post("task_management/create_task/",data)
}