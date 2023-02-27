import { formerBackendAxiosInstance, currentBackendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await currentBackendAxiosInstance.post("/jobs/add_application/", data)
}

export const getJobs = async () => {
    const data = { "company_id": "100098" };
    return await currentBackendAxiosInstance.post("/admin_management/get_jobs/", data)
}
