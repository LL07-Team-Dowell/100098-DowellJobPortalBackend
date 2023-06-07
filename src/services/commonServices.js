import { currentBackendAxiosInstance, liveStatusBackendAxiosInstance } from "./axios"

export const getJobs2 = async (data) => {
    return await currentBackendAxiosInstance.post("admin_management/get_jobs/",data )
}

export const getAllQuestions = async (company_id)=>{
    return await currentBackendAxiosInstance.get(`training_management/get_all_question/${company_id}`);
}

export const getAllTrainingResponses = async (company_id) => {
    return await currentBackendAxiosInstance.get(`training_management/get_all_responses/${company_id}`)
}

export const getUserLiveStatus = async () => {
    return await liveStatusBackendAxiosInstance.get("api/live_users")
}

export const postUserLiveStatus = async (data) => {
    return await liveStatusBackendAxiosInstance.post("en/live_status", data)
}