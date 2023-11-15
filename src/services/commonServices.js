import { currentBackendAxiosInstance, liveStatusBackendAxiosInstance } from "./axios"

export const getJobs2 = async (data) => {
    return await currentBackendAxiosInstance.get(`admin_get_all_jobs/${data.company_id}/`)
}

export const getAllQuestions = async (company_id)=>{
    return await currentBackendAxiosInstance.get(`get_all_question/${company_id}`);
}

// export const getAllTrainingResponses = async (company_id) => {
//     return await currentBackendAxiosInstance.get(`get_all_responses/${company_id}`)
// }

export const getAllTrainingResponses = async (company_id) => {
    return await currentBackendAxiosInstance.get(`get_all_responses/${company_id}`)
}

export const getUserLiveStatus = async () => {
    return await liveStatusBackendAxiosInstance.get("api/live_users")
}

export const postUserLiveStatus = async (data) => {
    return await liveStatusBackendAxiosInstance.post("en/live_status", data)
}

export const getAllCompanyUserSubProject = async (companyId, companyDataType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = (await currentBackendAxiosInstance.get(`settingusersubproject/`)).data;
            const projectForCompany = res?.data?.filter(item => item.company_id === companyId)?.filter(item => item.data_type === companyDataType);
            resolve(projectForCompany)
        } catch (error) {
            reject({ error })
        }    
    })
}

export const generateCommonAdminReport = async (data) => {
    return await currentBackendAxiosInstance.post(`generate_report/`, data);
}

export const getAllUpdateTaskRequests = async (companyId) => {
    return await currentBackendAxiosInstance.get(`/get_all_update_task/${companyId}`)
}

export const getWorklogDetailsWithinTimeframe = async (startDate, endDate, userID, companyId) => {
    return await currentBackendAxiosInstance.post(`/task_module/?type=task_details&start_date=${startDate}&end_date=${endDate}&user_id=${userID}&company_id=${companyId}`)
}